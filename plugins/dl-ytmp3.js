import ffmpeg from 'fluent-ffmpeg';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; 

let handler = async(m, { conn, text, args }) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:v|e(?:mbed)?)\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
    if (!text || !youtubeRegex.test(text)) {
        return conn.reply(m.chat, `🌱 Ejemplo:\nytmp3 https://youtube.com/watch?v=DLh9mnfZvc0\n\n≡ Para descargar como documento agregue "--doc" al final. Ejemplo:\n\nytmp3 <url> --doc`, m);
    }
    try {
        m.react('⏳');        
        const search = await yts(args[0]); 
        let isDoc = /--doc|doc$/.test(text);
        const video = search.videos[0];       
        if (!video.url) return conn.reply(m.chat, `No se encontró el video.`, m);
        const mp3Response = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${video.url}`)).json();
        if (!mp3Response || !mp3Response.result || !mp3Response.result.download || !mp3Response.result.download.url) {
            return conn.reply(m.chat, `No se pudo obtener el enlace de descarga del audio. La API no respondió correctamente.`, m);
        }
        const mp3 = mp3Response.result.download; 
        let file = await process(mp3.url, "mp3");
        let cap = `
\`\`\`
⊜─⌈ 📻 ◜YouTube MP3◞ 📻 ⌋─⊜

≡ 🎵 Título : ${video.title}
≡ 📺 Canal : ${video.author.name}
≡ ⏳ Duración : ${video.timestamp}
≡ 👀 Vistas : ${video.views.toLocaleString()}
≡ 📅 Publicado : ${video.ago}
≡ 🔗 Enlace : ${video.url}
≡ 🌳 Calidad : 320kbps
\`\`\`
≡ Enviado como : ${isDoc ? "Documento" : "Audio"}
`;
        conn.sendFile(m.chat, file.path, `${video.title}.mp3`, cap, m, null, {
            asDocument: isDoc ? true : false,
            mimetype: "audio/mpeg"
        });
await fs.promises.unlink(file.path)
        m.react('✅');
    } catch (error) {
        console.error(error); 
        return conn.reply(m.chat, `Error al descargar el audio.\n\n` + error, m);
    }
};

handler.command = ["yta", "ytmp3", "ytmp3doc"];
handler.help = ["ytmp3"];
handler.tags = ["dl"];
handler.diamond = 2;
export default handler;

const dir = "./downloads";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

function info(url) {
    return new Promise((res, rej) => {
        ffmpeg.ffprobe(url, (err, meta) => {
            if (err) return rej(err);

            const fmt = meta.format;
            const dur = fmt.duration ? fmt.duration : 0;
            const min = Math.floor(dur / 60);
            const sec = Math.floor(dur % 60);
            const durFmt = `${min}:${sec < 10 ? '0' : ''}${sec} m`;
            let q = "Unknown";
            let br = 0;
            if (meta.streams) {
                const vid = meta.streams.find(s => s.codec_type === 'video');
                const aud = meta.streams.find(s => s.codec_type === 'audio');

                if (vid) {
                    q = `${vid.height}p`;
                } else if (aud && aud.bit_rate) {
                    br = Math.floor(aud.bit_rate / 1000);
                    q = `${br}kbps`;
                }
            }
            res({ q, br, dur: durFmt });
        });
    });
}
function convertToAudio(url, out) {
    return new Promise((res, rej) => {
        ffmpeg(url)
            .audioCodec('libmp3lame')
            .audioBitrate('320k')
            .audioChannels(2)
            .audioFrequency(44100)
            .save(out)
            .on('end', () => res(fs.statSync(out).size))
            .on('error', rej);
    });
}
function convertToVideo(url, out) {
    return new Promise((res, rej) => {
        ffmpeg(url)
            .videoCodec('libx264')
            .videoBitrate('5000k')
            .size('1920x1080')
            .outputOptions('-crf 18')
            .audioCodec('aac')
            .audioBitrate('192k')
            .audioChannels(2)
            .save(out)
            .on('end', () => res(fs.statSync(out).size))
            .on('error', rej);
    });
}
async function process(url, format) {
    const before = await info(url);
    const name = crypto.randomBytes(2).toString('hex');
    let file;
    if (format === 'mp3') {
        file = path.join(dir, name + '.mp3');
        await convertToAudio(url, file);
    } else if (format === 'mp4') {
        file = path.join(dir, name + '.mp4');
        await convertToVideo(url, file);
    } else {
        throw new Error('Unsupported format');
    }
    const after = await info(file);
    const size = fs.statSync(file).size;
    return {
        before: before.q,
        after: after.q,
        size: `${(size / 1024 / 1024).toFixed(2)} MB`,
        path: file
    };
}