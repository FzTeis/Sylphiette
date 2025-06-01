import fetch from 'node-fetch'
import FormData from 'form-data'
let handler = async (m, { conn, command }) => {
  conn.hdr = conn.hdr || {}
  if (m.sender in conn.hdr) throw 'Aún hay un proceso que no se ha completado, por favor espere...'

  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime) throw 'Envía o responde a la imagen con el comando.'
  if (!/image\/(jpe?g|png)/.test(mime)) throw `El formato ${mime} no es compatible`

  conn.hdr[m.sender] = true
  await conn.sendMessage(m.chat, { react: { text: "♻️", key: m.key } })

  let img = await q.download?.()
  let error

  try {
    const imageUrl = await up(img)
    const api = `https://fastrestapis.fasturl.cloud/aiimage/upscale?imageUrl=${encodeURIComponent(imageUrl)}&resize=4`
    const res = await fetch(api)
    const buffer = await res.buffer()
    await conn.sendFile(m.chat, buffer, 'hd.jpg', footer, m)
  } catch {
    error = true
  } finally {
    if (error) m.reply(error)
    delete conn.hdr[m.sender]
  }
}

handler.help = ['hd', 'remini']
handler.tags = ['tools']
handler.command = /^(hd|remini)$/i

export default handler

async function up(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, 'image.jpg')
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  const url = await res.text()
  if (!url.startsWith('https://')) throw 'gagal upload ke Catbox'
  return url.trim()
}