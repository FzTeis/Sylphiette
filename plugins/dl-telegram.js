let handler = async (m, { conn, usedPrefix, args, command }) => {
async function DescargarArchivo(url) {
    const respuesta = await fetch(url);
    const buffer = await respuesta.buffer();
    const tipoArchivo = respuesta.headers.get('content-type').split('/')[1]; // Obtiene la extensión del archivo
    return { data: buffer, mimetype: respuesta.headers.get('content-type'), type: tipoArchivo };
}
if (!args[0]) throw `*🌴 Ingresa un link de telegram, Ejemplo: ${usedPrefix + command} https://t.me/c/1557352904/1871`;
let TLFile = await DescargarArchivo(args[0]);
m.react(rwait);
await conn.sendFile(m.chat, TLFile, 'telegramDL' + TLFile.type, 'Aquí tienes', m);
}
handler.command = ['telegram'];
handler.help = ['telegram'];
handler.tags = ['dl'];
export default handler