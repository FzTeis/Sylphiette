import axios from "axios";
import cheerio from "cheerio";
process.env['SPOTIFY_CLIENT_ID'] = '4c4fc8c3496243cbba99b39826e2841f'
process.env['SPOTIFY_CLIENT_SECRET'] = 'd598f89aba0946e2b85fb8aefa9ae4c8'

const sentMessages = new Set();

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply("🌿 Ingresa un enlace de Spotify, o bien, escribe el nombre de una canción.");

    if (sentMessages.has(m.key.id)) return;
    sentMessages.add(m.key.id);

    if (text.includes("https://open.spotify.com/track/")) {
        const result = await getSpotify(text);
        let info = await getInfo(text);
        if (!result) return m.reply("No se encontraron resultados.");

        const { audio } = result;
        const { album, album_artist, album_name, artist, cover_url, name, url, releaseDate } = info;
        await conn.sendMessage(
            m.chat,
            {
                text:
                    "「 Spotify Download 」\n" +
                    `• 🌿 \`Título :\` ${name}\n` +
                    `• 🌴 \`Artista :\` ${artist}\n\n` +
                    `   乂 *INFO :*\n` +
                    `≡ 🌾 \`Album :\` ${album}\n` +
                    `≡ 🌳 \`Subido el :\` ${releaseDate}\n` +
                    `≡ 🍂 \`Url :\` ${url}\n\n` +
                    footer,
                contextInfo: {
                    externalAdReply: {
                        title: name,
                        body: artist,
                        thumbnail: await (await fetch(cover_url)).buffer(),
                        sourceUrl: text,
                        mediaType: 1,
                    },
                },
            },
            { quoted: fkontak }
        );

        await conn.sendMessage(
            m.chat,
            {
                audio: { url: audio },
                mimetype: "audio/mpeg",
                ptt: false,
            },
            { quoted: m }
        );

        setTimeout(() => sentMessages.delete(m.key.id), 30000);
    } else {
        let searchResults = await search(text);
        if (!searchResults.status || searchResults.result.length === 0) {
            return m.reply("No se encontraron resultados.");
        }

        let caption = "「 Spotify Search 」\n\n";
        searchResults.result.slice(0, 10).forEach((track, index) => {
            caption += `≡ ${index + 1}. ${track.title}\n`;
            caption += `≡ 🌳 \`Duración :\` ${track.duration}\n`;
            caption += `≡ 🌿 \`Popularidad :\` ${track.popularity}\n`;
            caption += `∘ 🌾 URL: ${track.url}\n\n`;
        });

        await conn.sendMessage(
            m.chat,
            {
                text: caption + footer,
                contextInfo: {
                    externalAdReply: {
                        title: "Spotify Search",
                        body: wm,
                        thumbnail: await (await fetch(menu)).buffer(),
                        sourceUrl: "",
                        mediaType: 1,
                    },
                },
            },
            { quoted: fkontak }
        );
    }
};

handler.help = ["spotify"];
handler.tags = ["dl"];
handler.command = ["spotify", "spotifydl"];
handler.diamond = true;
export default handler;

async function getSpotify(urlSpot) {
    try {
        const response = await axios.get(`https://api.parsico.org/spotify?url=${encodeURIComponent(urlSpot)}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        if (response.status !== 200) return null;

        const $ = cheerio.load(response.data);
        const audio = $("audio source").attr("src");
        const title = $("div.result p:nth-child(2)").text().replace("Song Name: ", "");
        const artist = $("div.result p:nth-child(3)").text().replace("Artist: ", "");
        const cover = $("div.result img").attr("src");

        if (!audio) return null;
        return { title, artist, cover, audio };
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

async function convert(ms) {
    return new Promise((resolve) => {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);
        resolve(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
    });
}
   
async function spotifyCreds() {
      return new Promise(async resolve => {
         try {
            const json = await (await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
               headers: {
                  Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
               }
            })).data
            if (!json.access_token) return resolve({
               creator: "I'm Fz ~",
               status: false,
               msg: 'Can\'t generate token!'
            })
            resolve({
               creator: 'Im Fz ~',
               status: true,
               data: json
            })
         } catch (e) {
            resolve({
               creator: 'Im Fz ~',
               status: false,
               msg: e.message
            })
         }
      })
   }
async function search(query, type = "track", limit = 20) {
    try {
        const creds = await spotifyCreds();
        if (!creds.status) return creds;

        const { data } = await axios.get(
            `https://api.spotify.com/v1/search?query=${query}&type=${type}&offset=0&limit=${limit}`,
            { headers: { Authorization: `Bearer ${creds.data.access_token}` } }
        );

        if (!data.tracks.items.length) {
            return { creator: "I'm Fz ~", status: false, msg: "Music not found!" };
        }

        const results = await Promise.all(
            data.tracks.items.map(async (v) => ({
                title: `${v.album.artists[0].name} - ${v.name}`,
                duration: await convert(v.duration_ms),
                popularity: v.popularity + "%",
                preview: v.preview_url,
                url: v.external_urls.spotify,
            }))
        );

        return { creator: "I'm Fz ~", status: true, result: results };
    } catch (e) {
        return { creator: "I'm Fz ~", status: false, msg: e.message };
    }
}
async function getInfo(url) {
const met = await axios.post(`https://spotydown.media/api/get-metadata`, { url: url }).then(a => a.data.apiResponse.data[0])
return met
}