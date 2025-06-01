let handler = async (m, { conn, text, isROwner, isOwner }) => {
  if (text) {
    global.db.data.chats[m.chat].sWelcome = text
    m.reply(`✅ Se cambió correctamente la bienvenida para el grupo.`)
  } else throw `✳️ Ingresa la nueva bienvenida para el grupo. Usa "@user" para mencionar al usuario.`
}
handler.help = ['setwelcome']
handler.tags = ['group']
handler.command = ['setwelcome'] 
handler.admin = true
handler.owner = false

export default handler