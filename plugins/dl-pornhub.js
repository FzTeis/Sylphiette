import { PornHub } from 'pornhub.js';
import fs from 'fs';
import { exec } from 'child_process';
import crypto from "crypto";

let handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🚀 Ejemplo de uso: phub sweetie fox`, m);
    }

    const bkp = new PornHub();
    m.react('🕒');

    if (text.includes('pornhub.com/view_video.php?')) {
      const dl = await bkp.video(text);
      const resolution = dl.mediaDefinitions.find(f => f.format === 'hls' && (f.quality === 480 || f.quality === 720));

      if (!resolution) {
        return conn.reply(m.chat, '⚠️ No se encontró una resolución válida.', m);
      }
        let cap = `
≡─⌈◜Pornhub - Download◞⌋─≡

≡ 🌴 \`Title :\` ${dl.title}
≡ 🌿 \`Duration :\` ${dl.durationFormatted}
≡ 🌾 \`Uploader :\` ${dl.provider.username}
≡ ☑️ \`Rating :\` ${dl.vote.rating}
≡ 🗃️ \`Tags :\` ${dl.tags.slice(0, 4).join(', ')}
≡ 🍄 \`Category :\` ${dl.categories.slice(0, 4).join(', ')}
≡ 🌷 \`Link :\` ${text}
`;

m.reply(cap)
      const m3u8Url = resolution.videoUrl;
      const fileName = crypto.randomBytes(2).toString('hex') + '.mp4';
      const outputPath = `./downloads/${fileName}`;
      
      if (!fs.existsSync('./downloads')) {
        fs.mkdirSync('./downloads');
      }

      const ffmpegCommand = `ffmpeg -i "${m3u8Url}" -c copy -bsf:a aac_adtstoasc "${outputPath}"`;

      exec(ffmpegCommand, async (error, stdout, stderr) => {
        if (error) {
          console.error(`FFmpeg Error: ${error.message}`);
          return conn.reply(m.chat, '❌ Error al descargar el video.', m);
        }
        await conn.sendFile(m.chat, outputPath, `${dl.title}.mp4`, '', m, null, {
          asDocument: true, mimetype: "video/mp4"
        });

        fs.unlinkSync(outputPath); 
        m.react('☑️');
      });

    } else {
      const info = await bkp.searchVideo(text);
      if (!info.data || info.data.length === 0) {
        return conn.reply(m.chat, 'No se encontraron resultados.', m);
      }

      const shuffledResults = info.data.sort(() => Math.random() - 0.5);
      let cap = `◜ Pornhub - Search ◞\n`;

      shuffledResults.slice(0, 15).forEach((res, index) => {
        cap += `\n\`${index + 1}\`\n≡ 🌴 \`Title :\` ${res.title}\n≡ 👁️ \`Views :\` ${res.views}\n≡ 🌿 \`Duration :\` ${res.duration} m\n≡ 🌱 \`Link :\` ${res.url}\n`;
      });
m.reply(cap)
      m.react("🔞");
    }
  } catch (err) {
    return conn.reply(m.chat, 'Error en la ejecución.\n\n' + err, m);
  }
};

handler.help = ['pornhub'];
handler.command = ['pornhub', 'phub'];
handler.tags = ["download"];

export default handler;