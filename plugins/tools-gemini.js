import { GoogleGenerativeAI } from "@google/generative-ai";
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `🍂 Ejemplo de uso : ${command} Hola`
const apikeynyah = "AIzaSyB3Q74etnADQ_qSX3OJtzTnteGh-fd4df8"
await conn.sendPresenceUpdate('composing', m.chat)
const genAI = new GoogleGenerativeAI(apikeynyah);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const prompt = `${text}`;
const result = await model.generateContent(prompt);  
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `${result.response.text()}`
  if (!/image\/(jpe?g|png|webp)/.test(mime)) {
        return m.reply(`¡El tipo ${mime} no es compatible!`);
    } 
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await upload(media)
  const imageResp = await fetch(
    `${link}`
)
    .then((response) => response.arrayBuffer());

const result2 = await model.generateContent([
    {
        inlineData: {
            data: Buffer.from(imageResp).toString("base64"),
            mimeType: "image/jpeg",
        },
    },
    `${text}`,
]);
  let yayaya = `${result2.response.text()}`
  m.reply(yayaya)
}
handler.help = ["gemini", "openai"]
handler.tags = ['tools'];
handler.command = ["gemini", "bard", "ia", "ai", "openai"]
export default handler

async function upload(buffer) {
  let { ext } = await fileTypeFromBuffer(buffer);
  let bodyForm = new FormData();
  bodyForm.append("fileToUpload", buffer, "file." + ext);
  bodyForm.append("reqtype", "fileupload");

  let res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: bodyForm,
  });

  let data = await res.text();
  return data;
}