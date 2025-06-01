let handler = async (m, { conn, usedPrefix, command, args, users, setting }) => {
    try {
        if (!args || !args[0]) {
            return conn.reply(m.chat, `🌱 Ejemplo de uso: ${usedPrefix}${command} https://www.mediafire.com/file/c2fyjyrfckwgkum/ZETSv1%25282%2529.zip/file`, m);
        }

        if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) {
            return conn.reply(m.chat, `Enlace inválido.`, m);
        }

        m.react('🕒');
        const json = await (await fetch(`https://api.sylphy.xyz/download/mediafire?url=${args[0]}&apikey=sylph-96ccb836bc`)).json()

        if (!json.data.download) {
            return conn.reply(m.chat, "No se pudo obtener la información del archivo.", m);
        }
        let info = `
🌿 \`Nombre :\` ${json.data.filename}
🌲 \`Peso :\` ${json.data.size}
🌴 \`Link :\` ${args[0]}
🌾 \`Mime :\` ${json.data.mimetype}
`;
m.reply(info)
await conn.sendFile(m.chat, json.data.download, json.data.filename, "", m);
    } catch (e) {
        return conn.reply(m.chat, `Error: ${e.message}`, m);
    }
};

handler.command = handler.help = ['mediafire'];
handler.tags = ["download"];;
export default handler;