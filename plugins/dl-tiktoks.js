let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `🌷 Ingresa un texto para buscar en Tiktok. Ejemplo:\n${usedPrefix + command} Black clover`
try {
let res = await ttks(text)
let { title, no_wm, music } = res.data
await conn.sendFile(m.chat, no_wm, title, title, m)
await conn.sendMessage(m.chat, { audio: { url: music }}, m)
m.react(done)
} catch(e) {
throw `Ocurrió un error, inténtelo nuevamente.`
}
}
handler.help = handler.command = ['ttks', 'tiktoks', 'ttsearch', 'ttrandom']
handler.tags = ['dl']
export default handler

async function ttks(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 10,
          cursor: 0,
          HD: 1
        }
      });
      const videos = response.data.data.videos;
      if (videos.length === 0) {
        reject("No se encontraron videos.");
      } else {
        const gywee = Math.floor(Math.random() * videos.length);
        const videorndm = videos[gywee]; 

        const result = {
          status: true,
          creator: "I'm Fz~",
          data: {
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_wm: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
          }
        };
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}