import fs from 'fs'
let handler = async (m, { text, usedPrefix, command }) => {
    if (text) throw `Texto faltante`
    if (!m.quoted.text) throw `Responder al mensaje!`
    let path = `./config.js`
    await fs.writeFileSync(path, m.quoted.text)
    m.reply(`Se actualizo ${path}`)
}
handler.help = ['savec']
handler.tags = ['owner']
handler.command = ["savec"]
handler.private = true
export default handler