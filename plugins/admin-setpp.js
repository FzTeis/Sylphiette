import { makeWASocket } from '@whiskeysockets/baileys';

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';

  if (/image/.test(mime)) {
    let img = await q.download();
    if (!img) return m.reply('🌱 Responde a una imagen para cambiar el ícono del grupo.');

    try {
      await conn.updateProfilePicture(m.chat, img);
      m.react(done)
    } catch (e) {
      m.reply(`︎\`Error :\` ${e.message}`);
    }
  } else {
    return m.reply('🌷 Responde a una imagen.');
  }
};
handler.tags = ['group']
handler.help = handler.command = ['setpp'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;