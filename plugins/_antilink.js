const groupLinkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;
const channelLinkRegex = /whatsapp\.com\/channel\/([0-9A-Za-z]+)/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m || !m.text) return;
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;

  const chat = global.db?.data?.chats?.[m.chat];
  if (!chat || !chat.antiLink) return !0;

  const isGroupLink = groupLinkRegex.test(m.text);
  const isChannelLink = channelLinkRegex.test(m.text);

  if ((isGroupLink || isChannelLink) && !isAdmin) {
    let isOwnGroupLink = false;

    if (isGroupLink && isBotAdmin) {
      try {
        const ownCode = await conn.groupInviteCode(m.chat);
        isOwnGroupLink = m.text.includes(`chat.whatsapp.com/${ownCode}`);
      } catch (e) {}
    }

    if (isOwnGroupLink) return !0;

    if (isBotAdmin) {
      try {
        await conn.sendMessage(m.chat, { delete: m.key });
      } catch (e) {}
    }

    if (!global.antifloodLinks) global.antifloodLinks = {};
    const last = global.antifloodLinks[m.sender] || 0;
    const now = Date.now();
    if (now - last > 5000) {
      global.antifloodLinks[m.sender] = now;
      await conn.reply(m.chat, `*≡ Enlace Detectado*\n\nNo se permiten enlaces de ${isChannelLink ? 'canales' : 'otros grupos'}. Lo siento, *@${m.sender.split('@')[0]}*, serás expulsado.${isBotAdmin ? '' : '\n\n(No soy admin, así que no puedo expulsarte)'}`, null, {
        mentions: [m.sender]
      });
    }

    if (isBotAdmin) {
      try {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      } catch (err) {}
    }
  }

  return !0;
}
