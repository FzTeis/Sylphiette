const groupLinkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;
const channelLinkRegex = /whatsapp.com\/channel\/([0-9A-Za-z]+)/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (!m || !m.text) return;
    if (m.isBaileys && m.fromMe) return !0;
    if (!m.isGroup) return !1;

    let chat = global.db?.data?.chats?.[m.chat];
    if (!chat || !chat.antiLink) return !0;

    console.log(`[LOG] Mensaje recibido en grupo: ${m.chat}, de: ${m.sender}`);
    
    let isGroupLink = m.text.match(groupLinkRegex);
    let isChannelLink = m.text.match(channelLinkRegex);

    if ((isGroupLink || isChannelLink) && !isAdmin) {
        if (isBotAdmin) {
            try {
                const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
                if (isGroupLink && m.text.includes(linkThisGroup)) return !0;
            } catch (error) {
                console.error("[ERROR] No se pudo obtener el código del grupo:", error);
            }
        }

        await conn.reply(m.chat, `*≡ Enlace Detectado*
            
No permitimos enlaces de ${isChannelLink ? 'canales' : 'otros grupos'}. Lo siento, *@${m.sender.split('@')[0]}*, serás expulsado. ${isBotAdmin ? '' : '\n\nNo soy admin así que no te puedo expulsar :v'}`, null, { mentions: [m.sender] });

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