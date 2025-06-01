import { fetch } from "undici"
let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        if (!args[0]) return m.reply(`🌿 Ejemplo de uso: ${usedPrefix + command} https://www.facebook.com/share/v/1FwfwCUQEv/`);
        if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) {
            return m.reply("Enlace inválido. Asegúrate de que sea un enlace de Facebook válido.");
        }
m.react('🕒');
let fb = await aio(args[0]);
if (!fb.medias[0]) {
return m.reply("No se pudo obtener el video. Puede que el enlace no sea público o esté restringido.");
}
if (fb.medias[1]) {
conn.sendFile(m.chat, fb.medias[1].url, `video.mp4`, `🌷 \`Calidad :\` ${fb.medias[1].quality}\n🌳 \`Peso :\` ${fb.medias[1].formattedSize}`, m);
} else {
conn.sendFile(m.chat, fb.medias[0].url, `video.mp4`, `🌷 \`Calidad :\` ${fb.medias[0].quality}\n🌳 \`Peso :\` ${fb.medias[0].formattedSize}`, m);
}
    } catch (e) {
        return conn.reply(m.chat, `Error al descargar el video:\n${e.message}`, m);
    }
};

handler.help = ["facebook"];
handler.command = ["fb", "facebook"];
handler.tags = ["download"];
export default handler;

async function aio(url) {
    try {
        const response = await fetch("https://anydownloader.com/wp-json/aio-dl/video-data/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://anydownloader.com/",
                "Token": "5b64d1dc13a4b859f02bcf9e572b66ea8e419f4b296488b7f32407f386571a0d"
            },
            body: new URLSearchParams({
                url
            }),
        }, );
        const data = await response.json();
        if (!data.url) return data
        return data;
    } catch (error) {
        console.error("Error fetching data:", );
        throw error
    }
}