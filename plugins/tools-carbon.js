import crypto from "crypto"
let handler = async(m, { conn, text, args }) => {
      let ya = text && m.quoted ? (m.quoted.text ? text + '\n\n' + m.quoted.text : text) : text ? text : (m.quoted ? (m.quoted.text ? m.quoted.text : false) : false);
      if (!ya) {
         return conn.reply(m.chat, `🌱 Ejemplo: carbon <text / quoted text>`, m);
      }
m.react('⏳');
      let old = new Date()
      let img = await carbon(ya);
      await conn.sendFile(m.chat, img.file, "carbon.png", `🍟 *Process* : ${((new Date() - old) * 1)} ms`, m);
      fs.unlinkSync(img.file);
      m.react("☑️");
}
handler.help = ['carbon']
handler.command = ["carbon", "carbonfy"]
handler.tags =['tools']
export default handler

async function carbon(input) {
   let cap = `//-- Powered By Sylphiette's\n\n` + input;
   let Blobs = await fetch("https://carbonara.solopov.dev/api/cook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "code": cap })
   }).then(response => response.blob());

   let arrayBuffer = await Blobs.arrayBuffer();
   let buffer = Buffer.from(arrayBuffer);
   const filename = crypto.randomBytes(2).toString('hex');
   const filePath = `./downloads/${filename}.png`;
   fs.writeFileSync(filePath, buffer);
   return { file: filePath, type: 'image/png' };
}