let handler = async (m, {conn, usedPrefix}) => {
	
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[m.chat][who]
    if (!(who in global.db.data.users[m.chat])) throw `✳️ El usuario no se encuentra en la database de este chat.`
    conn.reply(m.chat, `
 ≡ \`Usuario :\` @${who.split('@')[0]}

💎 \`Diamantes :\` _${user.diamond.toLocaleString()}_
🍄 \`Experiencia :\` _${user.exp.toLocaleString()}_

> Recuerda que tu balance es diferente en cada grupo / chat.
`, m, { mentions: [who] })
}
handler.help = ['balance']
handler.tags = ['economy']
handler.command = ['bal', 'diamantes', 'diamond', 'balance'] 

export default handler