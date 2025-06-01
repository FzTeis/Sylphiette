import fetch from "node-fetch";
import Lyrics from "song-lyrics-api";
import lyric from "@green-code/music-track-data";

const lyrics = new Lyrics();

let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(m.chat, `🌷 Ejemplo de uso: lyrics Mon Laferte - Tu falta de querer`, m);
    }

    let info = await Lyric(text);
    if (!info) {
        return conn.reply(m.chat, "No se encontraron resultados.", m);
    }

    let { title, artist, mp3, lyrics: songLyrics, image } = info.data;
    let caption = `
◜ Lyrics - Search ◞

≡ 🌷 \`Artista :\` ${artist}
≡ 🌿 \`Título :\` ${title}

≡ 🗃️ \`Letra :\`

\`\`\`${songLyrics}\`\`\`
`;
conn.sendMessage(m.chat, { text: caption,
contextInfo: {
isForwarded: true,
forwardingScore: 999,
externalAdReply: {
title: "PB | Private Bot",
body: author,
thumbnail: image ? await (await fetch(image)).buffer() : await (await fetch("https://files.cloudmini.net/download/I027.jpeg")).buffer(),
sourceUrl: "https://files.cloudmini.net/download/I027.jpeg",
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: m })
m.react("🌲")
    if (mp3) {
        conn.sendFile(m.chat, mp3, `${title} - ${artist}.mp3`, '', m);
    }
};

handler.help = ["lyrics"];
handler.command = ["lyrics", "letra", "lirik", "liric"];
handler.tags = ["tools"];
handler.limit = true;

export default handler;

async function Lyric(text) {
    try {
        let info = await lyric.getTracks(text);
        if (!info || info.length === 0) return null;

        let { title, artist, preview } = info[0];
        let ly = await lyrics.getLyrics(`${title} ${artist}`);
        if (!ly || ly.length === 0 || !ly[0].lyrics?.lyrics) return null;

        return {
            status: true,
            data: {
                title,
                artist,
                mp3: preview,
                lyrics: ly[0].lyrics.lyrics
            }
        };
    } catch (error) {
        console.error("Error obteniendo la letra:", error);
        return null;
    }
}