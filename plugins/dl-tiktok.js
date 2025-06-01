import fg from 'api-dylux';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return conn.reply(m.chat, `🥀 Ingresa un enlace válido de TikTok.`, m);
        }

        if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) {
            return conn.reply(m.chat, `❎ Enlace de TikTok inválido.`, m);
        }

        m.react('🕒');

        let data = await fg.tiktok(`${args[0]}`);
        let { title, play, duration } = data.result;
        let { nickname } = data.result.author;

        let caption = `
  乂 TikTok Download

  ◦ 👤 *Autor:* ${nickname}
  ◦ 📌 *Título:* ${title}
  ◦ ⏱️ *Duración:* ${duration}`;

        await conn.sendFile(m.chat, play, `tiktok.mp4`, caption, m);

        m.react('✅');
    } catch (e) {
        return conn.reply(m.chat, `❌ *Error:* ${e.message}`, m);
    }
};

handler.help = ["tiktok"];
handler.tags = ["download"];
handler.command = ["tt", "tiktok", "ttdl"];
export default handler;