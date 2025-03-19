import axios from 'axios';
import cheerio from 'cheerio';
import ffmpeg from 'fluent-ffmpeg';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        if (!args[0]) return m.reply(`🌿 Ejemplo de uso: ${usedPrefix + command} https://www.facebook.com/share/r/1FF7Yu9d4J/`);
        if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) {
            return m.reply("Enlace inválido. Asegúrate de que sea un enlace de Facebook válido.");
        }

        m.react('🕒');
        let fb = await Facebook(args[0]);

        if (!fb.video) {
            return m.reply("No se pudo obtener el video. Puede que el enlace no sea público o esté restringido.");
        }
        conn.sendFile(m.chat, fb.video, `video.mp4`, `🌷 \`Calidad :\` ${fb.info.quality}\n🌳 \`Duración :\` ${fb.info.duration}`, m);

        if (fb.audio) {
            conn.sendFile(m.chat, fb.audio, `audio.mp3`, `🌷 \`Audio :\` ${fb.info.quality}\n🌳 \`Duración :\` ${fb.info.duration}`, m);
        }
    } catch (e) {
        return conn.reply(m.chat, `Error al descargar el video:\n${e.message}`, m);
    }
};

handler.help = ["facebook"];
handler.command = ["fb", "facebook"];
handler.tags = ["dl"];
handler.diamond = true;
export default handler;

async function check(url) {
    try {
        const response = await axios.head(url);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function getd(url) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(url, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            const duration = metadata.format.duration;
            resolve(duration);
        });
    });
}

async function Facebook(url) {
    let result = {
        status: false,
        title: "",
        image: "",
        video: "",
        audio: "",
        info: {
            duration: "No disponible",
            quality: "No disponible",
        },
    };

    let { data } = await axios
        .post(
            "https://getmyfb.com/process",
            `id=${encodeURIComponent(url)}&locale=id`, {
                headers: {
                    "HX-Request": true,
                    "HX-Trigger": "form",
                    "HX-Target": "target",
                    "HX-Current-URL": "https://getmyfb.com/id",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
                    Referer: "https://getmyfb.com/id",
                },
            },
        )
        .catch((e) => e.response);

    const $ = cheerio.load(data);

    const caption = $(".results-item-text").text().trim();
    const imageUrl = $(".results-item-image").attr("src");

    result.title = caption;
    result.image = imageUrl;

    let foundLink = false;
    const links = $(".results-list li");

    for (let i = 0; i < links.length; i++) {
        const downloadLink = $(links[i]).find("a").attr("href");
        const quality = $(links[i]).text().trim().split("(")[0];
        const duration = $(links[i]).text().trim().split("(")[1]?.split(")")[0];

        if (downloadLink && await check(downloadLink)) {
            result.status = true;
            if ($(links[i]).text().trim().includes("Mp3")) {
                result.audio = downloadLink;
            } else {
                result.video = downloadLink;
            }

            const videoDuration = await getd(downloadLink);
            const formattedDuration = formt(videoDuration);

            result.info = {
                duration: formattedDuration || "No disponible",
                quality: quality || "No disponible",
            };

            foundLink = true;
            break;
        }
    }

    if (foundLink) {
        console.log(result);
    } else {
        result.status = false;
        result.video = "";
        result.audio = "";
    }

    return result;
}

function formt(durationInSeconds) {
    if (durationInSeconds < 60) {
        return `${Math.floor(durationInSeconds)}s`;
    }

    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}m`;
}