import { Sticker } from 'wa-sticker-formatter'
import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'
import sharp from 'sharp'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (args[0] === '---i') {
    let helpText = `
🌿 \`Lista de Formas y Efectos Disponibles :\`

*Formas:*
- -c : Crea un sticker circular
- -t : Crea un sticker triangular
- -s : Crea un sticker con forma de estrella
- -r : Crea un sticker con esquinas redondeadas
- -h : Crea un sticker hexagonal
- -d : Crea un sticker con forma de diamante
- -f : Crea un sticker con un marco
- -b : Crea un sticker con un borde
- -w : Crea un sticker con forma de onda
- -m : Crea un sticker espejado
- -o : Crea un sticker octogonal
- -y : Crea un sticker pentagonal
- -e : Crea un sticker elíptico
- -z : Crea un sticker en forma de cruz
- -v : Crea un sticker con forma de corazón
- -x : Crea un sticker expandido (cover)
- -i : Crea un sticker expandido (contain)

*Efectos:*
- -blur : Aplica un efecto de desenfoque
- -sepia : Aplica un efecto sepia
- -sharpen : Aplica un efecto de nitidez
- -brighten : Aumenta el brillo
- -darken : Disminuye el brillo
- -invert : Invierte los colores
- -grayscale : Aplica escala de grises
- -rotate90 : Rota la imagen 90 grados
- -rotate180 : Rota la imagen 180 grados
- -flip : Invierte la imagen horizontalmente
- -flop : Invierte la imagen verticalmente
- -normalice : Normaliza la imagen
- -negate : Negatiza la imagen
- -tint : Aplica un tinte de color a la imagen (rojo por defecto)

🌾 \`Ejemplo :\`
${usedPrefix + command} -c -blur Texto | Autor
`
    return m.reply(helpText)
  }
  let stiker = false
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    let txt = args.join(' ')

    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime) && (q.msg || q).seconds > 15) {
        return m.reply(`🌱 ¡El video no puede durar más de 15 segundos!...`)
      }

      let img = await q.download?.()

      if (!img) {
        return conn.reply(m.chat, `🌿 Responde a una *imagen/video/gif* para convertirlo en sticker. Para saber la lista de efectos y formas usa *"---i"*`, m)
      }

      let out

      let texto1 = global.wm
      let texto2 = global.author
      let marca = txt ? txt.split(/[\u2022|]/).map(part => part.trim()) : [texto1, texto2]

      if (/video/g.test(mime) || /gif/g.test(mime) || q.isAnimated) {
        stiker = await sticker(img, false, marca[0], marca[1])
      } else {
        const type = args.includes('-i') ? 'expand'
                    : args.includes('-x') ? 'cover'
                    : args.includes('-c') ? 'circle'
                    : args.includes('-t') ? 'triangle'
                    : args.includes('-s') ? 'star'
                    : args.includes('-r') ? 'roundrect'
                    : args.includes('-h') ? 'hexagon'
                    : args.includes('-d') ? 'diamond'
                    : args.includes('-f') ? 'frame'
                    : args.includes('-b') ? 'border'
                    : args.includes('-w') ? 'wave'
                    : args.includes('-m') ? 'mirror'
                    : args.includes('-o') ? 'octagon'
                    : args.includes('-y') ? 'pentagon'
                    : args.includes('-e') ? 'ellipse'
                    : args.includes('-z') ? 'cross'
                    : args.includes('-v') ? 'heart'
                    : 'default'

        const effect = args.includes('-blur') ? 'blur'
                       : args.includes('-sepia') ? 'sepia'
                       : args.includes('-sharpen') ? 'sharpen'
                       : args.includes('-brighten') ? 'brighten'
                       : args.includes('-darken') ? 'darken'
                       : args.includes('-invert') ? 'invert'
                       : args.includes('-grayscale') ? 'grayscale'
                       : args.includes('-rotate90') ? 'rotate90'
                       : args.includes('-rotate180') ? 'rotate180'
                       : args.includes('-flip') ? 'flip'
                       : args.includes('-flop') ? 'flop'
                       : args.includes('-normalice') ? 'normalice'
                       : args.includes('-negate') ? 'negate'
                       : args.includes('-tint') ? 'tint'
                       : null

        let image = sharp(img).resize(512, 512, {
          fit: (type === 'cover') ? 'cover' : 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })

        let mask = {
          circle: `<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="white"/></svg>`,
          triangle: `<svg width="512" height="512"><polygon points="256,0 512,512 0,512" fill="white"/></svg>`,
          star: `<svg width="512" height="512"><polygon points="256,20 298,190 478,190 330,290 380,460 256,360 132,460 182,290 34,190 214,190" fill="white"/></svg>`,
          roundrect: `<svg width="512" height="512"><rect x="0" y="0" width="512" height="512" rx="100" ry="100" fill="white"/></svg>`,
          hexagon: `<svg width="512" height="512"><polygon points="256,0 450,128 450,384 256,512 62,384 62,128" fill="white"/></svg>`,
          diamond: `<svg width="512" height="512"><polygon points="256,0 512,256 256,512 0,256" fill="white"/></svg>`,
          frame: `<svg width="512" height="512"><rect x="20" y="20" width="472" height="472" rx="20" ry="20" fill="none" stroke="white" stroke-width="40"/></svg>`,
          wave: `<svg width="512" height="512"><path d="M0,320 C150,400 350,200 512,320 L512,0 L0,0 Z" fill="white"/></svg>`,
          octagon: `<svg width="512" height="512"><polygon points="161,0 351,0 512,161 512,351 351,512 161,512 0,351 0,161" fill="white"/></svg>`,
          pentagon: `<svg width="512" height="512"><polygon points="256,0 512,196 412,512 100,512 0,196" fill="white"/></svg>`,
          ellipse: `<svg width="512" height="512"><ellipse cx="256" cy="256" rx="256" ry="150" fill="white"/></svg>`,
          cross: `<svg width="512" height="512"><polygon points="236,0 276,0 276,236 512,236 512,276 276,276 276,512 236,512 236,276 0,276 0,236 236,236" fill="white"/></svg>`,
          heart: `<svg width="512" height="512"><path d="M256 480 L 47 273 C 18 244 0 207 0 170 C 0 87 67 20 150 20 C 202 20 256 64 256 64 C 256 64 309 20 362 20 C 445 20 512 87 512 170 C 512 207 494 244 465 273 L 256 480 Z" fill="white"/></svg>`,
        }

        if (mask[type]) {
          image = image.composite([{ input: Buffer.from(mask[type]), blend: 'dest-in' }])
        }

        if (effect === 'blur') {
          image = image.blur(5)
        } else if (effect === 'sepia') {
          image = image.recomb([
            [0.393, 0.769, 0.189],
            [0.349, 0.686, 0.168],
            [0.272, 0.534, 0.131],
          ]);
        } else if (effect === 'sharpen') {
          image = image.sharpen()
        } else if (effect === 'brighten') {
          image = image. Clahe()
        } else if (effect === 'darken') {
          image = image. Clahe({ clipLimit: 10 })
        } else if (effect === 'invert') {
          image = image.negate()
        } else if (effect === 'grayscale') {
          image = image.greyscale()
        } else if (effect === 'rotate90') {
          image = image.rotate(90)
        } else if (effect === 'rotate180') {
          image = image.rotate(180)
        } else if (effect === 'flip') {
          image = image.flip()
        } else if (effect === 'flop') {
          image = image.flop()
        } else if (effect === 'normalice') {
          image = image.normalise()
        } else if (effect === 'negate') {
          image = image.negate()
        } else if (effect === 'tint') {
          image = image.tint({r: 255, g: 100, b: 100})
        }

        const buffer = await image.webp().toBuffer()

        let filteredText = txt.replace(/-\w+/g, '').trim()

        let pack = global.wm
        let author = "" //global.author
        if (filteredText) {
          const parts = filteredText.split("|")
          pack = (parts[0] || '').trim() || global.wm
          author = (parts[1] || '').trim() //|| global.author
        }

        stiker = await sticker(buffer, false, pack, author)
      }
    } else if (args[0] && isUrl(args[0])) {
      stiker = await sticker(false, args[0], global.packsticker, global.packsticker2)
    }

  } finally {
    if (stiker) {
      conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    } else {
      return conn.reply(m.chat, `🍄 Responde a una *imagen/video/gif* para convertirlo en sticker. Para saber la lista de efectos y formas usa *"---i"*`, m)
    }
  }
}

handler.help = ['sticker']
handler.tags = ['tools']
handler.command = ['s', 'sticker']

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}