
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
	
  let te = `✳️ ${mssg.langList}\n- es (Español)\n- en (Inglés)`
  if (!text) throw te
  let user = global.db.data.users[m.sender]
   if (args[0] === "es") {
       user.language = args[0]
       m.reply("✅ *Español Seleccionado*\n\nAhora el bot responderá a su mensaje en Español")
      } else if (args[0] === "en") {
       user.language = args[0]
       m.reply("✅ *Selected English*\n\nNow the bot will reply to your message in English")
      } else {
       m.reply(te)
     }
    
 }
 handler.help = ['language <es-en>']
 handler.tags = ['main']
 handler.command = ['language', 'lenguaje', 'lang', 'idioma'] 
 export default handler
