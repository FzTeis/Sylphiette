import fetch from 'node-fetch';

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    args
}) => {
    try {
        if (!args || !args[0]) return conn.reply(m.chat, `🌱 Ejemplo de uso: ${usedPrefix}${command} https://www.instagram.com/p/CK0tLXyAzEI`, m);
        if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) return conn.reply(m.chat, global.status.invalid, m);

        let old = new Date();
        m.react('🕒');

        var json = await (await fetch(`https://api.neoxr.eu/api/ig?url=${args[0]}&apikey=GataDios`)).json();
        if (!json.status) return conn.reply(m.chat, JSON.stringify(json, null, 2), m);

        conn.sendFile(m.chat, json.data[0].url, "Instagram.mp4", `🍟 *Proceso* : ${((new Date - old) * 1)} ms`, m);
        await delay(1500);

    } catch (e) {
        return conn.reply(m.chat, `Error: ${e.message}`, m);
    }
};

handler.help = ['instagram'];
handler.command = ['ig', 'instagram']
handler.tags = ["download"];;
export default handler;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}