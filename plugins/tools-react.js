let handler = async (m, { args, text, command, conn }) => {
    if (!args[0]) {
        return m.reply(`🌱 Ejemplo de uso :\n${command} https://whatsapp.com/channel/.... Hola`);
    }

    if (!args[0].startsWith("https://whatsapp.com/channel/")) {
        return m.reply("No es un enlace válido.");
    }

    const hurufGaya = {
        a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
        h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
        o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
        v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
        '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
        '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
    };

    const emojiInput = args.slice(1).join(' ').toLowerCase();
    const emoji = emojiInput.split('').map(c => {
        if (c === ' ') return '―';
        return hurufGaya[c] || c;
    }).join('');

    try {
        const link = args[0];
        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];

        const res = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(res.id, messageId, emoji);

        return m.reply(`Se envió exitosamente la reacción *${emoji}* al mensaje en el canal *${res.name}*.`);
    } catch (e) {
        console.error(e);
        return m.reply("No se pudo enviar la reacción. Asegúrese de que el enlace y el texto sean válidos: " + e);
    }
};
handler.help = handler.command = ["react"]
handler.tags = ["tools"]
export default handler