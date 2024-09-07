import { canLevelUp, xpRange } from '../lib/levelling.js'

let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]
    if (!canLevelUp(user.level, user.exp, global.multiplier)) {
        let { min, xp, max } = xpRange(user.level, global.multiplier)
        throw `
Level ${user.level} 📊
*${user.exp - min} / ${xp}*
\`\`\`¡¡No tienes suficiente exp para subir de nivel!!\`\`\`

*Experiencia faltante: ${max - user.exp}* ! ✨
`.trim()
    }
    let before = user.level * 1
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++
    if (before !== user.level) {
        let teks = `.             ${user.role}`
        let str = `
\`\`\`🎉 C O N G R A T S 🎉

${before} ➔ ${user.level} [ *${user.role}* ]\`\`\``.trim()
        try {
             conn.reply(m.chat, str, null, { quoted: fkontak })
        } catch (e) {
             conn.reply(m.chat, str, null, { quoted: fkontak })
        }
    }
}

handler.help = ['levelup']
handler.tags = ['econ']
handler.command = ['lvl', 'level', 'levelup']
export default handler