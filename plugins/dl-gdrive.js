import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, setting }) => {
    try {
        if (!text) {
            return conn.reply(m.chat, `🌱 *Ejemplo de uso:* .gdrive <link>`, m);
        }

        m.react("⌛");
        const result = await gdriveScraper(text);
        if (!result.status) return conn.reply(m.chat, `Error al obtener el archivo de Google Drive`, m);

        let cap = `\`\`\`◜ Google Drive - Download ◞\`\`\`\n\n`
            + `≡ 🌿 \`Nombre :\` ${result.data.fileName}\n`
            + `≡ 📏 \`Tamaño :\` ${result.data.fileSize}\n`
            + `≡ 📄 \`Tipo :\` ${result.data.mimetype}\n`
            + `≡ 🔗 \`URL :\` ${text}`;
m.reply(cap)
        await conn.sendFile(m.chat, result.data.downloadUrl, result.data.fileName, '', m, { document: true });

        m.react("☑️");
    } catch (e) {
        return conn.reply(m.chat, `Error : ${e.message}`, m);
    }
};

handler.help = ["gdrive"];
handler.command = ["gdrive", "drive"];
handler.tags = ["download"];
export default handler;

async function gdriveScraper(url) {
    try {
        let id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1];
        if (!id) throw new Error('No se encontró ID de descarga');

        let res = await fetch(
            `https://drive.google.com/uc?id=${id}&authuser=0&export=download`,
            {
                method: 'post',
                headers: {
                    'accept-encoding': 'gzip, deflate, br',
                    'content-length': 0,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    origin: 'https://drive.google.com',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                    'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
                    'x-drive-first-party': 'DriveWebUi',
                    'x-json-requested': 'true',
                },
            }
        );

        let { fileName, sizeBytes, downloadUrl } = JSON.parse((await res.text()).slice(4));
        if (!downloadUrl) throw new Error('Se excedió el número de descargas del link');

        let data = await fetch(downloadUrl);
        if (data.status !== 200) throw new Error(data.statusText);

        return {
            status: true,
            data: {
                downloadUrl,
                fileName,
                fileSize: `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`,
                mimetype: data.headers.get('content-type')
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}