let handler = async (m, { conn, text, command, usedPrefix }) => {
if (!text) throw `🌱 Ingrese un texto o URL lara buscar o descargar una canción de Spotify.`

if (command === 'spotify' || command === 'spotifys') {
let texto = text
m.react(rwait)
try {
let res = await (await fetch(`https://api.lyrax.net/api/search/spotify-s?text=${texto}&apikey=Tesina`)).json()

let { title, popularity, url } = res.result[0]

let info = await (await fetch(`https://api.lyrax.net/api/dl/spotifyV2?url=${url}&apikey=Tesina`)).json()
let { img, duration } = info.data
let txt = `
╌╌╌⟢ \`Spotify | Download\` ⟣╌╌╌
 
 📦 \`Titulo\` : ${title}
 🗓️ \`Duración\` : ${duration}
 🏆 \`Popularidad\` : ${popularity}
 🖇️ \`URL\` : ${url}
`;
await conn.sendMessage(m.chat, {
      image: { url: img },
      caption: txt,
      footer: `© ` + botName + ` | Powered by I'm Fz ~`,
      buttons: [
        {
          buttonId: `.spotifydl ${url}`,
          buttonText: {
            displayText: '🎵 Descargar Canción',
          },
        },
      ],
      viewOnce: true,
      headerType: 4,
    }, { quoted: fkontak });
    m.react('🌱');
    } catch {
    throw `Ocurrió un error. Intente usando el nombre específico del artista o canción tal cual está en Spotify.`
    m.react(error)
    }
} else if (command === 'spotifydl') {
let url = text
let isValid = /^https?:\/\/(open|play)\.spotify\.com\/(track|album|artist|playlist)\/[a-zA-Z0-9]+$/i.test(url)
if (isValid) {
m.react(rwait);
try {
let dll = await (await fetch(`https://api.lyrax.net/api/dl/spotifyV2?url=${url}&apikey=Tesina`)).json()
let { dl, song_name, artist } = dll.data
conn.sendMessage(m.chat, { audio: { url: dl }, mimetype: "audio/mpeg" }, { quoted: m})
m.react(done);
} catch {
throw `Ocurrió un error. Intente con otra URL.`
m.react(error);
}
} else {
throw `Ingresa una URL válida de Spotify. Ejemplo:
## https://open.spotify.com/track/6tMdpUXfT70TD6Eh3XfB1p
`
m.react(error)
}
} else {
throw `Comando no reconocido.`
}
}
handler.tags = ['dl'];
handler.help = ['spotify'];
handler.command = ['spotify', 'spotifys', 'spotifydl'];
export default handler;