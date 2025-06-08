const anyLinkRegex = /https?:\/\/[^\s]+/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (!m || !m.text) return;
    if (m.isBaileys && m.fromMe) return !0;
    if (!m.isGroup) return !1;

    let chat = global.db?.data?.chats?.[m.chat];
    if (!chat || !chat.antilinkall) return !0;

    let containsLink = anyLinkRegex.test(m.text);

    if (containsLink && !isAdmin) {
        if (isBotAdmin) {
            try {
                const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
                if (m.text.includes(linkThisGroup)) return !0;
            } catch (error) {
                console.error("[ERROR] No se pudo obtener el código del grupo:", error);
            }
        }

        await conn.reply(m.chat, `*≡ Enlace Detectado*

No se permiten enlaces de ningún tipo. Lo siento, *@${m.sender.split('@')[0]}*, serás expulsado. ${isBotAdmin ? '' : '\n\nNo soy admin así que no te puedo expulsar :v'}`, null, {
            mentions: [m.sender]
        });

        if (isBotAdmin) {
            try {
                await conn.sendMessage(m.chat, { delete: m.key });
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                console.log(`[LOG] Usuario ${m.sender} eliminado del grupo ${m.chat}`);
            } catch (error) {
                console.error("[ERROR] No se pudo eliminar el mensaje o expulsar al usuario:", error);
            }
        }
    }

    return !0;
}
