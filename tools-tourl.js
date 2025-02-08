import Catbox from '../lib/Catbox.js';
let handler = async (m, { args, command, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw `🌱 Responde a un archivo usando el comando.`;
  let media = await q.download();
  try {
    let sizeMB = media.length / (1024 * 1024);
    const link = await Catbox(media);
    conn.sendButton(m.chat, `➤ URL:\n${link}\n➤ Size: ${sizeMB.toFixed(2)} MB`, botName, link, [], link, null, m)
    m.react(done)
  } catch (error) {
    console.error('Error al subir el archivo:', error.message);
    throw `Ocurrió un error. Inténtalo nuevamente.`;
  }
}
handler.help = handler.command = ['upload', 'tourl'];
handler.tags = ['tools']
export default handler;