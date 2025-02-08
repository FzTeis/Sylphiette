import axios from 'axios';
import { fetch } from 'undici';
import * as cheerio from 'cheerio';
import { lookup } from "mime-types";

const handler = async (m, {conn, args, usedPrefix, command}) => {
    if (!args[0]) throw `\`\`\`[🌺] Ingresa un link de mediafire junto al comando. Ejemplo: \n${usedPrefix + command} https://www.mediafire.com/file/r0lrc9ir5j3e2fs/DOOM_v13_UNCLONE\`\`\``;
m.react(rwait)
      const res = await mediafire(args[0]);
      const { filename, size, type, ext, mimetype, download } = res;
      let text2 = `╭━━━⊜ ⌊ \`\`\`Mediafire Downloader - 2\`\`\` ⌉⊜━━━\n`
    text2 += `│  ≡ Nombre: ${filename}\n`
    text2 += `│  ≡ Peso: ${size}\n`
    text2 += `│  ≡ Tipo: ${type} | ${ext}\n`
    text2 += `╰━━━━━━━━━━━━━━⊜\n`
    text2 += `  _• Enviando archivo . . . ._`
      await conn.reply(m.chat, text2, m, {
contextInfo: { externalAdReply :{ showAdAttribution: true,
                        sourceUrl: 'https://whatsapp.com/channel/0029Va6InNBFCCoM9xzKFG3G',
                        mediaType: 2,
                        description: `🍁 This bot is still in development.`,
                        title: `🌺 Thank you for using Sylphiette, the best WhatsApp bot.`,
                        body: `⚘ Developed by I\`m Fz ~`,          previewType: 0,
                        thumbnail: imagen,
                        mediaUrl: "https://whatsapp.com/channel/0029Va6InNBFCCoM9xzKFG3G"
                      }}
})
      await conn.sendFile(m.chat, download, filename, '', m, null, {mimetype: mimetype, asDocument: true});
  }
handler.help = ['mediafire'].map((v) => v + ' <url>');
handler.tags = ['dl'];
handler.command = /^(mediafire|mediafiredl|dlmediafire)$/i;
export default handler;

async function mediafire(url) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const type = $(".dl-btn-cont").find(".icon").attr("class").split("archive")[1].trim();
        const filename = $(".dl-btn-label").attr("title");
        const size = $('.download_link .input').text().trim().match(/\((.*?)\)/)[1];
        const ext = filename.split(".").pop();
        const mimetype =
            lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();
        const download = $(".input").attr("href");
        resolve({
            filename,
            type,
            size,
            ext,
            mimetype,
            download,
        });
    }).catch((e) =>
        reject({
            msg: "No se pudieron obtener los datos del enlace",
        }),
    );
}