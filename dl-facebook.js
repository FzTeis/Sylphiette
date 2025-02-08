let handler = async (m, { conn, args, usedPrefix, command }) => {
    
    if (!args[0]) throw `\`\`\`[ 🌺 ] Ingresa un link de Facebook. Ejemplo:\n${usedPrefix + command} https://fb.watch/ujmoNe9vfM/?mibextid=rS40aB7S9Ucbxw6v\`\`\``;
m.react(rwait)
    try {
        let res = await scrapers.facebookdlv2(args[0]);

        if (res && Array.isArray(res.result)) {
            const video = res.result.find(video => video.quality === '720p') || 
                          res.result.find(video => video.quality === '360p');

            if (video) {
                const enlace = video.url;
                await conn.sendFile(m.chat, enlace, 'Video.mp4', '*🌴 Resultado.*', m);
                m.react(done)
            } else {
                throw 'No se encontró ningún video con las calidades 720p ni 360p';
                m.react('✖️')
            }
        } else {
            throw 'Ocurrió un error al obtener el video';
        }
    } catch (err) {
        console.error(err);
        m.reply('Ocurrió un error.');
        m.react('✖️')
    }
}
handler.help = ['facebook']
handler.tags = ['dl']
handler.command = ['fb', 'fbdl', 'facebook']
handler.diamond = true
export default handler