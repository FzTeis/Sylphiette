import path from "path";
import { File } from "megajs";

const handler = async (m, { conn, args, usedPrefix, command, text }) => {
    try {
        if (!text) {
            return conn.reply(m.chat, `🌴 Uso correcto :\n${command} https://mega.nz/file/ovJTHaQZ#yAbkrvQgykcH_NDKQ8eIc0zvsN7jonBbHZ_HTQL6lZ8`, m);
        }
m.react('🕒');
        const file = File.fromURL(text);
        await file.loadAttributes();

        let maxSize = 300 * 1024 * 1024;
        if (file.size >= maxSize) {
            return conn.reply(m.chat, `⚠️ \`Error :\` El archivo es demasiado pesado.\n\n📦 *Peso máximo permitido:* 300MB\n👑 *Usuarios premium:* 800MB`, m);
        }
let cap = `
  乂 \`MEGA - DOWNLOADER\`

≡ Nombre : ${file.name}
≡ Tamaño : ${formatBytes(file.size)}

≡ URL: ${text}
`
m.reply(cap)
        const data = await file.downloadBuffer();

        const fileExtension = path.extname(file.name).toLowerCase();
        const mimeTypes = {
            ".mp4": "video/mp4",
            ".pdf": "application/pdf",
            ".zip": "application/zip",
            ".rar": "application/x-rar-compressed",
            ".7z": "application/x-7z-compressed",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
        };

        let mimetype = mimeTypes[fileExtension] || "application/octet-stream";

        await conn.sendFile(m.chat, data, file.name, "", m, null, { mimetype, asDocument: true });

        m.react('✅');
    } catch (e) {
        return conn.reply(m.chat, `❌ *Error:* ${e.message}`, m);
    }
};

handler.help = ["mega"];
handler.tags = ["download"];
handler.command = ["mega"];
export default handler;

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}