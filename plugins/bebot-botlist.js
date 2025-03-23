import ws from 'ws';
let handler = async(m, { usedPrefix, conn, text }) => {
const limit = 20
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];

function dhms(ms) {
  var segundos = Math.floor(ms / 1000);
  var minutos = Math.floor(segundos / 60);
  var horas = Math.floor(minutos / 60);
  var días = Math.floor(horas / 24);

  segundos %= 60;
  minutos %= 60;
  horas %= 24;

  var resultado = "";
  if (días !== 0) {
    resultado += días + 'd '
  }
  if (horas !== 0) {
    resultado += horas + 'h '
  }
  if (minutos !== 0) {
    resultado += minutos + 'm '
  }
  if (segundos !== 0) {
    resultado += segundos + 's'
  }

  return resultado;
}

  const message = users.map((v, index) => `
    乂 \`Sylph | Subbot : ${index + 1}\`

≡ 🌿 \`Tag :\` @${v.user.jid.replace(/[^0-9]/g, '')}
≡ 🌳 \`Nombre: ${v.user.name || 'Desconocido'}\`
≡ 🌷 \`Uptime: ${v.uptime ? dhms(Date.now() - v.uptime) : "Desconocido"}\`
`).join('\n┈──────────────── ꒰ 🍂 ꒱\n');
let warn = `
    乂 INFO :
    
🌄 El número de subbots activos supera el límite de ${limit} por lo que no se mostrará la lista con los tags.
`
const totalUsers = users.length;
const replyMessage = totalUsers > limit ? warn : (message || 'No hay w');
const cap = `
≡ 🍁 \`Hello @${m.sender.split('@')[0]}! Below is the list of active subbots on Sylphiette :\`

≡ 🌱 Sesiones guardadas : ${await info("./Sesiones/Subbots")}
≡ 🌺 Sesiones Activas : ${totalUsers || '0'}

${replyMessage.trim()}
 
${footer}`.trim();

conn.relayMessage(m.chat, {
extendedTextMessage:{
                text: cap, 
                contextInfo: {
mentionedJid: conn.parseMention(cap),
                     externalAdReply: {
                        title: wm,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnail: await (await fetch(menu)).buffer(),
                        sourceUrl: ''
                    }
                }
}}, { quoted: m })
}
handler.help = ['botlist']
handler.tags = ['bebot']
handler.command = ['listbot', 'listbots', 'bots', 'bebots', 'botlist'] 

export default handler

import fs from "fs/promises";
async function info(path) {
    try {
        const items = await fs.readdir(path);
        return items.length;
    } catch (err) {
        console.error("Error:", err);
        return 0;
    }
}