const {
    getBinaryNodeChild,
    getBinaryNodeChildren,
    generateWAMessageFromContent,
    proto
} = (await import('@whiskeysockets/baileys')).default;

const handler = async (m, { conn, text, participants, usedPrefix, command }) => {
    if (!text && !m.quoted) {
        return m.reply(`Responde a un usuario o ingresa su número, ejemplo:\n${usedPrefix + command} +52 xxx xxx`);
    }

    let link = await conn.groupInviteCode(m.chat).catch(() => null);
    if (!link) return m.reply("⚠️ Error: No se puede obtener el código de invitación al grupo.");

    let metadata = await conn.groupMetadata(m.chat).catch(() => null);
    if (!metadata) return m.reply("⚠️ Error: No se pudo obtener la información del grupo.");
    
    let groupName = metadata.subject;
    let existingParticipants = metadata.participants.map(user => user.id);
    let inputNumbers = [];

    if (m.quoted) {
        inputNumbers.push(m.quoted.sender.split('@')[0]);
    }

    if (text) {
        inputNumbers = inputNumbers.concat(
            text.split(',')
                .map(v => v.replace(/[^0-9]/g, ''))
                .filter(v => v.length > 4 && v.length < 20)
        );
    }

    inputNumbers = [...new Set(inputNumbers)];
    for (const number of inputNumbers) {
        const jid = `${number}@s.whatsapp.net`;

        if (existingParticipants.includes(jid)) {
            await m.reply(`⚠️ El usuario ya es miembro de este grupo @${number}`);
            continue;
        }

        const exists = await conn.onWhatsApp(jid);
        if (!exists[0]?.exists) {
            await m.reply(`⚠️ El usuario @${number} no está registrado en WhatsApp`);
            continue;
        }

        try {
            const response = await conn.query({
                tag: 'iq',
                attrs: {
                    type: 'set',
                    xmlns: 'w:g2',
                    to: m.chat,
                },
                content: [{
                    tag: 'add',
                    attrs: {},
                    content: [{
                        tag: 'participant',
                        attrs: { jid },
                    }],
                }],
            });

            const participant = getBinaryNodeChildren(response, 'add');
            const user = participant[0]?.content.find(item => item.attrs.jid === jid);

            if (user?.attrs.error === '421') {
                m.reply("⚠️ No se puede agregar ese usuario. Ha restringido las invitaciones a grupos.");
                continue;
            }

            if (user?.attrs.error === '408') {
                await m.reply(`✅ La invitación al grupo se envió exitosamente a @${number} porque el usuario acaba de abandonar el grupo.`);
                await conn.sendMessage(
                    jid, {
                        text: `✨ Estás invitado nuevamente a este grupo:\nhttps://chat.whatsapp.com/${link}`,
                        contextInfo: {
                            externalAdReply: {
                                title: groupName,
                                body: null,
                                thumbnailUrl: await conn.profilePictureUrl(m.chat, 'image').catch(() => null),
                                sourceUrl: `https://chat.whatsapp.com/${link}`,
                                mediaType: 1,
                                renderLargerThumbnail: false,
                            },
                        },
                    }, { quoted: null }
                );
                continue;
            }
            if (user?.attrs.error === '403') {
                await m.reply(`Enviando un enlace a @${number}.`);
                const content = getBinaryNodeChild(user, 'add_request');
                const { code, expiration } = content.attrs;
                const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => null);
                const jpegThumbnail = pp ? await fetch(pp).then(res => res.buffer()) : Buffer.alloc(0);

                const msgs = generateWAMessageFromContent(
                    m.chat,
                    proto.Message.fromObject({
                        groupInviteMessage: {
                            groupJid: m.chat,
                            inviteCode: code,
                            inviteExpiration: parseInt(expiration),
                            groupName: groupName,
                            jpegThumbnail: jpegThumbnail,
                            caption: "Invitación para unirse a mi grupo de WhatsApp",
                        },
                    }), {
                        userJid: conn.user.id,
                    }
                );
                await conn.sendMessage(jid, {
                    forward: msgs,
                    mentions: [jid]
                });
            }
        } catch (err) {
            console.error(err);
            await m.reply(`Se produjo un error al agregar @${number}: ${err.message}`);
        }
    }
};

handler.help = ['add']
handler.tags = ['group']
handler.command = ['add', 'añadir', 'anadir']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null
export default handler