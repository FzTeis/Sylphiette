import fetch from 'node-fetch';
import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { text, conn, args}) => {
  if (!text) return m.reply('🌸 Ingresa el título o URL del video.')

  conn.xvideos = conn.xvideos || {}
  const isUrl = text.includes('xvideos.com')
  if (isUrl) {
    await m.react(rwait)
    try {
      const res = await xvideosdl(args[0])
      const { duration, quality, views, likes, deslikes } = res.result
      const txt = `◜ \`XVIDEOS - DOWNLOAD\` ◞

▸ 🌸 \`Título :\` ${res.result.title}
▸ ⏱️ \`Duración :\` ${duration || 'Desconocida'}
▸ ☘️ \`Likes :\` ${likes || 'Desconocida'}
▸ 🌾 \`Des-Likes :\` ${deslikes}
▸ 👁️ \`Vistas :\` ${views || 'Desconocidas'}`
      const dll = res.result.url
      await conn.sendFile(m.chat, dll, res.result.title + '.mp4', txt, m)
      await m.react(done)
    } catch (e) {
      await conn.reply(m.chat, `Error al descargar el video :\n` + e, m)
    }
    return
  }

  m.react("🔥")
  const res = await search(text)
  if (!res.length) return m.reply('🥀 No se encontraron resultados.')

  const list = res.slice(0, 10).map((v, i) => `*${i + 1}*\n≡ 🌳 *Título  :*\n• \`${v.title}\`\n≡ 🌿 *Link :*\n• ${v.url}`).join('\n\n')
  const caption = `⊜─⌈ 🔞 ◜XVIDEOS Search◞ 🔞 ⌋─⊜

${list}

> Responde con el número para descargar uno de los siguientes vídeos o bien, usa directamente la URL.`

  const { key } = await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
  conn.xvideos[m.sender] = {
    result: res,
    key,
    downloads: 0,
    timeout: setTimeout(() => delete conn.xvideos[m.sender], 120_000),
  }
}

handler.before = async (m, { conn }) => {
  conn.xvideos = conn.xvideos || {}
  const session = conn.xvideos[m.sender]
  if (!session || !m.quoted || m.quoted.id !== session.key.id) return

  const n = parseInt(m.text.trim())
  if (isNaN(n) || n < 1 || n > session.result.length) return
  try {
    await m.react(rwait)
    const link = session.result[n - 1].url
    const res = await xvideosdl(link)
      const { duration, quality, views, likes, deslikes } = res.result
      const txt = `◜ \`XVIDEOS - DOWNLOAD\` ◞

▸ 🌸 \`Título :\` ${res.result.title}
▸ ⏱️ \`Duración :\` ${duration || 'Desconocida'}
▸ ☘️ \`Likes :\` ${likes || 'Desconocida'}
▸ 🌾 \`Des-Likes :\` ${deslikes}
▸ 👁️ \`Vistas :\` ${views || 'Desconocidas'}`
      const dll = res.result.url
      await conn.sendFile(m.chat, dll, res.result.title + '.mp4', txt, m)
      await m.react(done)
  } catch (e) {
    await conn.reply(m.chat, `Error al descargar el video :\n` + e, m)
  } finally {
    session.downloads++
    if (session.downloads >= 5) {
      clearTimeout(session.timeout)
      delete conn.xvideos[m.sender]
    }
  }
}

handler.command = ['xvideos', 'xvsearch', 'xvideosdl', 'xvid']
handler.tags = ['download']
handler.help = ['xvideos']
export default handler

async function search(query) {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `https://www.xvideos.com/?k=${encodeURIComponent(query)}`;
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const results = [];
            $("div.mozaique > div").each((index, element) => {
                const title = $(element).find("p.title a").attr("title");
                const videoUrl = "https://www.xvideos.com" + $(element).find("p.title a").attr("href");
                const duration = $(element).find("span.duration").text().trim();
                const quality = $(element).find("span.video-hd-mark").text().trim();

                results.push({ title, url: videoUrl, duration, quality });
            });

            resolve(results);
        } catch (error) {
            reject(error);
        }
    });
}

async function xvideosdl(url) {
    return new Promise((resolve, reject) => {
        fetch(`${url}`, { method: 'get' })
            .then(res => res.text())
            .then(res => {
                let $ = cheerio.load(res, { xmlMode: false });
                const title = $("meta[property='og:title']").attr("content");
                const keyword = $("meta[name='keywords']").attr("content");
                const views = $("div#video-tabs > div > div > div > div > strong.mobile-hide").text() + " views";
                const vote = $("div.rate-infos > span.rating-total-txt").text();
                const likes = $("span.rating-good-nbr").text();
                const deslikes = $("span.rating-bad-nbr").text();
                const thumb = $("meta[property='og:image']").attr("content");
                const videoUrl = $("#html5video > #html5video_base > div > a").attr("href");
                resolve({ status: 200, result: { title, url: videoUrl, keyword, views, vote, likes, deslikes, thumb } });
            })
            .catch(err => reject(err));
    });
}