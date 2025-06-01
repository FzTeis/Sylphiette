import { yupload } from "../lib/yupload.js";

const handler = async (m, { conn, text, usedPrefix, command, args }) => {
  if (!args[0]) throw `🍂 Ingresa un link de YourUpload. Ejemplo:\n${command} https://www.yourupload.com/watch/wYk0lUX3cwGk`
  if (!/^https?:\/\/(www\.)?yourupload\.com\/watch\/[a-zA-Z0-9]+$/.test(args[0])) throw `⚠️ La URL no parece ser válida de YourUpload`

  m.react(rwait)

  const { title, views, shareUrl, embedUrl, type, size, uploaded, dl } = await yupload.info(args[0])

  const body = `
\`\`\`◜ YourUpload - Download ◞\`\`\`

≡ 🌿 \`Título : »\` ${title}
≡ 🌲 \`Views : »\` ${views}
≡ 🌱 \`Uploaded : »\` ${uploaded}
    
≡ 🌳 \`URL : »\` ${shareUrl}
≡ 🌾 \`Embed URL : »\` ${embedUrl}
    
_# 🌴 Su Archivo se enviará en un momento . . ._`

  let buffer = await (await fetch(menu)).arrayBuffer()
  conn.sendSylph(m.chat, body, Buffer.from(buffer), footer, "", "", fkontak)
  let file = await yupload.dl(dl)
  await conn.sendFile(m.chat, file, title, "", m, null, { asDocument: true })
  m.react(done)
  fs.unlinkSync(file)
}

handler.command = handler.help = ['yupload']
handler.tags = ["download"];
export default handler