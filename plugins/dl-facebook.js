import axios from "axios";
import cheerio from "cheerio";

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        if (!args[0]) return m.reply(`🌿 Ejemplo de uso: ${usedPrefix + command} https://www.facebook.com/share/r/1FF7Yu9d4J/`);
        if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) {
            return m.reply("⚠️ Enlace inválido. Asegúrate de que sea un enlace de Facebook válido.");
        }

        m.react('🕒');
        let json = await fbdl(args[0]);

        if (!json.media || Object.keys(json.media).length === 0) {
            return m.reply("No se pudo obtener el video. Puede que el enlace no sea público o esté restringido.");
        }

        let bestQuality = Object.keys(json.media).sort((a, b) => parseInt(b) - parseInt(a))[0]; 
        let videoUrl = json.media[bestQuality];

        conn.sendFile(m.chat, await (await fetch(videoUrl)).buffer(), `video.mp4`, `🌷 *Calidad:* ${bestQuality}p`, m);
    } catch (e) {
        return conn.reply(m.chat, `Error al descargar el video:\n${e.message}`, m);
    }
};

handler.help = ["facebook"];
handler.command = ["fb", "facebook"];
handler.tags = ["dl"];
handler.limit = true;

export default handler;

async function fbdl(url) {
    let results = {};

    try {
        let { data } = await axios.post(
            "https://getmyfb.com/process",
            `id=${encodeURIComponent(url)}&locale=id`,
            {
                headers: {
                    "HX-Request": true,
                    "HX-Trigger": "form",
                    "HX-Target": "target",
                    "HX-Current-URL": "https://getmyfb.com/id",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
                    Referer: "https://getmyfb.com/id",
                },
            }
        );

        const $ = cheerio.load(data);
        const caption = $(".results-item-text").text().trim();
        const imageUrl = $(".results-item-image").attr("src");

        let media = {};

        $(".results-list li").each(function () {
            let text = $(this).text().trim();
            let qualityMatch = text.match(/(\d+)p/); 
            let quality = qualityMatch ? qualityMatch[1] : "Unknown";

            let downloadLink = $(this).find("a").attr("href");

            if (downloadLink) {
                media[quality] = downloadLink;
            }
        });

        if (Object.keys(media).length === 0) {
            throw new Error("No se encontraron enlaces de descarga.");
        }

        results = {
            metadata: {
                title: caption || "Sin título",
                image: imageUrl || "",
            },
            media,
        };
    } catch (error) {
        console.error("Error en fbdl:", error);
    }

    return results;
}