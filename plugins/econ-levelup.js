import { canLevelUp, xpRange } from '../lib/levelling.js';

let handler = async (m, { conn }) => {
    let name = conn.getName(m.sender);
    let user = global.db.data.users[m.sender];
    let { min, xp, max } = xpRange(user.level, multiplier);

    let maxLevel = 1000;

    if (!canLevelUp(user.level, user.exp, multiplier)) {
    let text = `
   👤 User : ${name}
   ⚗️ EXP : ${user.level} / 1000
   ⛩️ Rol : ${user.exp - min} / ${xp}
   📊 Level ${user.level} 

\`\`\`¡¡No tienes suficiente exp para subir de nivel!!\`\`\`

*Experiencia faltante: ${max - user.exp}* ! ✨
`.trim();
        await conn.sendMessage(m.chat, { text: text }, { quoted: fkontak });
    } else {
        let beforeLevel = user.level * 1;
        while (canLevelUp(user.level, user.exp, multiplier)) {
            user.level++;
        }

        if (beforeLevel !== user.level) {
            let str = `
\`\`\`🎉 C O N G R A T S 🎉

${beforeLevel} ➔ ${user.level} [ *${user.role}* ]\`\`\``.trim();

await conn.sendMessage(m.chat, { text: str }, { quoted: fkontak });
        }
    }
}
handler.command = ['lvl', 'levelup', 'lv', 'nivel']
handler.help = ['nivel']
handler.tags = ['econ']
export default handler