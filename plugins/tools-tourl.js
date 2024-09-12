import fs from "fs"
import fetch from "node-fetch"
import FormData from "form-data"

let handler = async m => {
  try {
    const q = m.quoted || m
    const mime = q.mediaType || ""    
    if (!/image|video|audio|sticker|document/.test(mime)) 
      throw "```[ 📤 ] Responde a una imagen / vídeo / audio ( normal o documento )```"
    const media = await q.download(true)
    const fileSizeInBytes = fs.statSync(media).size    
    if (fileSizeInBytes === 0) {
      await m.reply("```[ ❗ ] El archivo es demasiado ligero```")
      await fs.promises.unlink(media)
      return
    }   
    if (fileSizeInBytes > 1073741824) {
      await m.reply("```[ 🌴 ] El archivo supera 1GB```")
      await fs.promises.unlink(media)
      return
    }    
    const { files } = await uploadUguu(media)
    const caption = `\`\`\`[ 🍄 ] Aquí tienes la URL de tu archivo:\n${files[0]?.url}\`\`\``
    await m.reply(caption)
  } catch (e) {
    await m.reply(`${e}`)
  }
}

handler.help = ["tourl2", "tourl"]
handler.tags = ["tools"]
handler.command = /^(tourl2|tourl)$/i
export default handler

async function uploadUguu(path) {
  try {
    const form = new FormData()
    form.append("files[]", fs.createReadStream(path))   
    const res = await fetch("https://uguu.se/upload.php", {
      method: "POST",
      headers: form.getHeaders(),
      body: form
    })    
    const json = await res.json()
    await fs.promises.unlink(path)   
    return json
  } catch (e) {
    await fs.promises.unlink(path)
    throw "Upload failed"
  }
}