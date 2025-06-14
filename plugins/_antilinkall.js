const linkRegex = /((https?:\/\/)?[^\s]+\.(com|net|org|xyz|info|link|store|site|online|club|click|live|top|ru|cn|tk|ml|ga|cf|gq|biz|me|tv|to|co|app)(\/[^\s]*)?)/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m || !m.text) return;
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;

  const chat = global.db?.data?.chats?.[m.chat];
  if (!chat || !chat.antiLinkAll) return !0;

  if (linkRegex.test(m.text) && !isAdmin) {
    if (isBotAdmin) {
      try {
        await conn.sendMessage(m.chat, { delete: m.key });
      } catch (e) {}
    }

    if (!global.antifloodLinksAll) global.antifloodLinksAll = {};
    const last = global.antifloodLinksAll[m.sender] || 0;
    const now = Date.now();
    if (now - last > 5000) {
      global.antifloodLinksAll[m.sender] = now;
      await conn.reply(m.chat, `*≡ Enlace Detectado*\n\nNo se permiten enlaces de ningún tipo, *@${m.sender.split('@')[0]}*. Serás expulsado.${isBotAdmin ? '' : '\n\n(No soy admin, así que no puedo expulsarte)'}`, null, {
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
