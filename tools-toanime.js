import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `✳️ ${mssg.replyImg}`
  let media = await q.download()
  let isTele = /image\/(png|jpe?g)/.test(mime)
  let link = await (isTele ? uploadImage : uploadFile)(media)
m.react(rwait)
  let imagen = `https://skizo.tech/api/toanime?apikey=GataDios&url=${link}`
  await conn.sendMessage(m.chat, { image: { url: imagen }, caption: `*🖼️ Resultado:*` }, m);
m.react(done);
}
handler.help = ['toanime']
handler.tags = ['tools']
handler.command = ['toanime', 'anime']
handler.diamond = 1
export default handler