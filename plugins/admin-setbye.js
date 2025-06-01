let handler = async (m, { conn, text, isROwner, isOwner }) => {
  if (text) {
    global.db.data.chats[m.chat].sBye = text
    m.reply(`✅ Se cambió con éxito la despedida del grupo.`)
  } else throw `✳️ Ingresa el nuevo texto de bienvenida. Usa "@user" para mencionar al usuario.`
}
handler.help = ['setbye']
handler.tags = ['group']
handler.command = ['setbye'] 
handler.admin = true
handler.owner = false

export default handler