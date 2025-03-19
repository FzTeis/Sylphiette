import { fetch } from "undici";
import { lookup } from "mime-types";

let handler = async (m, { conn, usedPrefix, command, args, users, setting }) => {
    try {
        if (!args || !args[0]) {
            return conn.reply(m.chat, `🌱 Ejemplo de uso: ${usedPrefix}${command} https://www.mediafire.com/file/c2fyjyrfckwgkum/ZETSv1%25282%2529.zip/file`, m);
        }

        if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) {
            return conn.reply(m.chat, `Enlace inválido.`, m);
        }

        m.react('🕒');
        const json = await mediafire(args[0]);

        if (!json.filename) {
            return conn.reply(m.chat, "No se pudo obtener la información del archivo.", m);
        }
        let info = `
🌿 \`Nombre :\` ${json.filename}
🌲 \`Peso :\` ${json.size}
🌴 \`Link :\` ${args[0]}
🌾 \`Mime :\` ${json.mimetype}

${footer}
`;
m.reply(info)
        await conn.sendFile(m.chat, json.download, json.filename, "", m, null, { asDocument: true, mimetype: json.mimetype });
        m.react("☑️")
    } catch (e) {
        return conn.reply(m.chat, `Error: ${e.message}`, m);
    }
};

handler.command = handler.help = ['mediafire'];
handler.tags = ['dl'];
handler.diamond = true;

export default handler;

function sizeToKB(size) {
    const sizeMatch = size.match(/(\d+\.?\d*)\s*(MB|GB|KB)/i);
    if (!sizeMatch) return 0;

    const value = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2].toUpperCase();

    switch (unit) {
        case 'GB':
            return value * 1024 * 1024;
        case 'MB':
            return value * 1024;
        case 'KB':
            return value;
        default:
            return 0;
    }
}
async function mediafire(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al acceder a la URL');

            const html = await response.text();
            const $ = cheerio.load(html);

            const typeClass = $(".dl-btn-cont").find(".icon").attr("class");
            const type = typeClass ? typeClass.split("archive")[1]?.trim() : 'desconocido';

            const filename = $(".dl-btn-label").attr("title") || 'archivo desconocido';

            const sizeMatch = $('.download_link .input').text().trim().match(/\((.*?)\)/);
            const size = sizeMatch ? sizeMatch[1] : 'desconocido';

            const ext = filename.split(".").pop();
            const mimetype = lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();

            const download = $(".input").attr("href");
            if (!download) throw new Error('No se pudo encontrar el enlace de descarga');

            resolve({
                filename,
                type,
                size,
                ext,
                mimetype,
                download,
            });
        } catch (error) {
            reject({
                msg: "Error al obtener datos del enlace: " + error.message,
            });
        }
    });
}