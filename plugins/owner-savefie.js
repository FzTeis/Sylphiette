import fs from 'fs'

let handler = async (m, { conn, command, text }) => {
   try {
      if (!text) return conn.reply(m.chat, `🌱 Ingresa la ruta y nombre del archivo.`, m)

      if (command === 'savefile') {
         if (!m.quoted) return conn.reply(m.chat, `🌿 Responde a un mensaje que contenga un archivo o texto.`, m)

         if (m.quoted.mimetype) {
            let buffer = await m.quoted.download()
            fs.writeFileSync(text, buffer)
            conn.reply(m.chat, `✅ \`Archivo guardado en *${text}*\``, m)
         } else if (m.quoted.text) {
            fs.writeFileSync(text, m.quoted.text)
            conn.reply(m.chat, `✅ \`Texto guardado en *${text}*\``, m)
         } else {
            conn.reply(m.chat, `🌱 \`El mensaje citado no contiene contenido válido.\``, m)
         }

      } else if (command === 'delfile') {
         if (!fs.existsSync(text)) return conn.reply(m.chat, `🌾 \`El archivo *${text}* no existe.\``, m)
         fs.unlinkSync(text)
         conn.reply(m.chat, `🗑️ \`Archivo *${text}* eliminado.\``, m)
      }

   } catch (e) {
      console.error(e)
      conn.reply(m.chat, `Error:\n${e.message}`, m)
   }
}

handler.command = handler.help = ['savefile', 'delfile']
handler.tags = ['owner']
handler.owner = true

export default handler