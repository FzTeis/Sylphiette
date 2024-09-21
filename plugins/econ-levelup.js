import { canLevelUp, xpRange } from '../lib/levelling.js';
import canvafy from 'canvafy';

let handler = async (m, { conn }) => {
    let name = conn.getName(m.sender);
    let user = global.db.data.users[m.sender];
    let { min, xp, max } = xpRange(user.level, multiplier); // multiplier tidak perlu global.

    let maxLevel = 1000; // Tentukan level maksimum

    // Ambil URL gambar profil pengguna
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/2WzLyGk/profile.jpg');

    if (!canLevelUp(user.level, user.exp, multiplier)) {
    let text = `
   - - - ${botName} - - -
    
   [ 👤 ] User : ${name}
   [ ⚗️ ] EXP : ${user.level} / 1000
   [ ⛩️ ] Rol : ${user.exp - min} / ${xp}
   [ 📊 ] Level ${user.level} 

\`\`\`¡¡No tienes suficiente exp para subir de nivel!!\`\`\`

*Experiencia faltante: ${max - user.exp}* ! ✨
`.trim();

        const image = await new canvafy.WelcomeLeave()
            .setAvatar(pp) 
            .setBackground("image", "https://i.ibb.co/GnBgVZF/Sylph.jpg")
            .setTitle('Estadísticas')
            .setDescription(`¡¡Necesitas ${max - user.exp} XP para subir de nivel!!`)
            .setBorder("#000000")
            .setAvatarBorder("#F0F8FF")
            .setOverlayOpacity(0.5)
            .build();

        await conn.sendMessage(m.chat, { image: image, caption: text }, { quoted: fkontak });
    } else {
        let beforeLevel = user.level * 1;
        while (canLevelUp(user.level, user.exp, multiplier)) {
            user.level++;
        }

        if (beforeLevel !== user.level) {
            let str = `
\`\`\`🎉 C O N G R A T S 🎉

${beforeLevel} ➔ ${user.level} [ *${user.role}* ]\`\`\``.trim();

            const image = await new canvafy.WelcomeLeave()
                .setAvatar(pp) // Menggunakan gambar profil pengguna
                .setBackground("image", "https://i.ibb.co/GnBgVZF/Sylph.jpg")
                .setTitle('¡Level Up!')
                .setDescription(`Felicidades ¡Has subido de nivel!`)
                .setBorder("#000000")
                .setAvatarBorder("#F0F8FF")
                .setOverlayOpacity(0.5)
                .build();

            await conn.sendMessage(m.chat, { image: image, caption: str }, { quoted: fkontak });
        }
    }
}
handler.command = ['lvl', 'levelup', 'lv', 'nivel']
handler.help = ['nivel']
handler.tags = ['econ']
export default handler