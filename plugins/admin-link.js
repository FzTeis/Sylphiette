let handler = async (m, { conn, groupMetadata }) => { 
 let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat)
 conn.reply(m.chat, `\nEnlace de invitación para el grupo *${groupMetadata.subject}*\n\n${link}`, m, {detectLink: true})
}
handler.help = ['link']
handler.tags = ['group']
handler.command = ['linkgroup', 'link'] 
handler.group = true
handler.botAdmin = true

export default handler