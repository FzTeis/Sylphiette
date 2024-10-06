let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.quoted) throw `✳️ ${mssg.replyStick}`
    let xx = m.quoted;
  conn.sendMessage(m.chat, { image: await xx.download(), caption: `\`\`\`[ 🌱 ] ${mssg.result}\`\`\`` }, m)
        }
handler.help = ['toimg <sticker>']
handler.tags = ['sticker']
handler.command = ['toimg', 'jpg', 'aimg'] 
export default handler