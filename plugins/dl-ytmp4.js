import axios from 'axios'
import FormData from 'form-data'
import WebSocket from 'ws'
import cheerio from 'cheerio'
import crypto from 'crypto'
import yts from "yt-search"
import fs from 'fs'
import { get } from 'https'
import { createWriteStream } from 'fs'
import { promisify } from 'util'
const unlink = promisify(fs.unlink)

let handler = async (m, { conn, text, args }) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:v|e(?:mbed)?)\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    if (!text || !youtubeRegex.test(text)) {
        return conn.reply(m.chat, `🌱 Uso correcto : ytmp4 https://youtube.com/watch?v=DLh9mnfZvc0`, m)
    }

    try {
        m.react('⏳')
        const search = await yts(args[0])
        const video = search.videos[0]
        if (!video || !video.url) return conn.reply(m.chat, `No se encontró el video.`, m)
        const isDoc = /doc$/.test(text)
        const cap = `
\`\`\`
⊜─⌈ 📻 ◜YouTube MP4◞ 📻 ⌋─⊜

≡ 🎵 Título : ${video.title}
≡ 📺 Canal : ${video.author.name}
≡ ⏳ Duración : ${video.timestamp}
≡ 👀 Vistas : ${video.views.toLocaleString()}
≡ 📅 Publicado : ${video.ago}
≡ 🔗 Enlace : ${video.url}
≡ 🌳 Calidad : ${args[1] || "360"}
\`\`\`
  ${footer}
`
        if (isDoc) m.reply(cap)
        const vid = await ytmp4(video.url, args[1] || "360")
        const path = `/tmp/${Date.now()}.mp4`
        await new Promise((resolve, reject) => {
            const file = createWriteStream(path)
            get(vid.dl_url, (res) => {
                res.pipe(file)
                file.on('finish', () => file.close(resolve))
                file.on('error', reject)
            }).on('error', reject)
        })
const stats = fs.statSync(path)
const sizeB = stats.size
const sizeMB = sizeB / (1024 * 1024)
const fDoc = sizeMB > 80
await conn.sendFile(m.chat, path, `${video.title}.mp4`, (isDoc || fDoc) ? "" : cap, m, null, {
    asDocument: isDoc || fDoc,
    mimetype: "video/mp4"
})
        await unlink(path)
        m.react('✅')
    } catch (error) {
        console.error(error)
        return conn.reply(m.chat, `Error al descargar el video.\n\n${error.message}`, m)
    }
}

handler.command = ["ytv", "ytmp4", "ytmp4doc"]
handler.help = ["ytmp4"]
handler.tags = ["download"]
export default handler

async function ytmp4(url, quality) {
  const base_url = 'https://amp4.cc'
  const headers = { Accept: 'application/json', 'User-Agent': 'Postify/1.0.0' }
  const cookies = {}

  const parse_cookies = (set_cookie_headers) => {
    if (set_cookie_headers) {
      set_cookie_headers.forEach((cookie) => {
        const [key_value] = cookie.split(';')
        const [key, value] = key_value.split('=')
        cookies[key] = value
      })
    }
  }

  const get_cookie_string = () =>
    Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ')

  const client_get = async (url) => {
    const res = await axios.get(url, {
      headers: { ...headers, Cookie: get_cookie_string() }
    })
    parse_cookies(res.headers['set-cookie'])
    return res
  }

  const client_post = async (url, data, custom_headers = {}) => {
    const res = await axios.post(url, data, {
      headers: { ...headers, Cookie: get_cookie_string(), ...custom_headers }
    })
    parse_cookies(res.headers['set-cookie'])
    return res
  }

  const yt_regex = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/

  const hash_challenge = async (salt, number, algorithm) =>
    crypto.createHash(algorithm.toLowerCase()).update(salt + number).digest('hex')

  const verify_challenge = async (challenge_data, salt, algorithm, max_number) => {
    for (let i = 0; i <= max_number; i++) {
      if (await hash_challenge(salt, i, algorithm) === challenge_data) {
        return { number: i, took: Date.now() }
      }
    }
    throw new Error('Captcha verification failed')
  }

  const solve_captcha = async (challenge) => {
    const { algorithm, challenge: challenge_data, salt, maxnumber, signature } = challenge
    const solution = await verify_challenge(challenge_data, salt, algorithm, maxnumber)
    return Buffer.from(
      JSON.stringify({
        algorithm,
        challenge: challenge_data,
        number: solution.number,
        salt,
        signature,
        took: solution.took
      })
    ).toString('base64')
  }

  const connect_ws = async (id) => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`wss://amp4.cc/ws`, ['json'], {
        headers: { ...headers, Origin: `https://amp4.cc` },
        rejectUnauthorized: false
      })

      let file_info = {}
      let timeout_id = setTimeout(() => {
        ws.close()
      }, 30000)

      ws.on('open', () => ws.send(id))
      ws.on('message', (data) => {
        const res = JSON.parse(data)
        if (res.event === 'query' || res.event === 'queue') {
          file_info = {
            thumbnail: res.thumbnail,
            title: res.title,
            duration: res.duration,
            uploader: res.uploader
          }
        } else if (res.event === 'file' && res.done) {
          clearTimeout(timeout_id)
          ws.close()
          resolve({ ...file_info, ...res })
        }
      })
      ws.on('error', () => clearTimeout(timeout_id))
    })
  }

  try {
    const link_match = url.match(yt_regex)
    if (!link_match) throw new Error('Invalid YouTube URL')
    const fixed_url = `https://youtu.be/${link_match[3]}`
    const page_data = await client_get(`${base_url}/`)
    const $ = cheerio.load(page_data.data)
    const csrf_token = $('meta[name="csrf-token"]').attr('content')

    if (!isNaN(quality)) quality = `${quality}p`

    const form = new FormData()
    form.append('url', fixed_url)
    form.append('format', 'mp4')
    form.append('quality', quality)
    form.append('service', 'youtube')
    form.append('_token', csrf_token)

    const captcha_data = await client_get(`${base_url}/captcha`)
    if (captcha_data.data) {
      const solved_captcha = await solve_captcha(captcha_data.data)
      form.append('altcha', solved_captcha)
    }

    const res = await client_post(`${base_url}/convertVideo`, form, form.getHeaders())
    const ws = await connect_ws(res.data.message)
    const dlink = `${base_url}/dl/${ws.worker}/${res.data.message}/${encodeURIComponent(ws.file)}`

    return {
      title: ws.title || '-',
      uploader: ws.uploader,
      duration: ws.duration,
      quality,
      type: 'video',
      format: 'mp4',
      thumbnail: ws.thumbnail || `https://i.ytimg.com/vi/${link_match[3]}/maxresdefault.jpg`,
      dl_url: dlink
    }
  } catch (err) {
    throw Error(err.message)
  }
}