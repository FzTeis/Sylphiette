import fetch from 'node-fetch'
var handler = async (m, { text,  usedPrefix, command }) => {
if (!text) throw `*🌴Ingresa un texto o petición. Ejemplo: \n❏ ${usedPrefix + command} Codigo en JS para un juego de cartas`
try {
conn.sendPresenceUpdate('composing', m.chat);
let apii = await fetch(`https://aemt.me/gemini?text=${text}`)
let res = await apii.json()
let fk = res.result
m.reply(fk)
} catch (e) {
await conn.reply(m.chat, `> Ocurrió un error, intentalo nuevamente.\n\n${wm}`, fkontak, m)
console.log(`❗❗ Error en el plugin; ${usedPrefix + command} ❗❗`)
console.log(e)
}}
handler.command = ['bard', 'gemini']
handler.help = ['bard', 'gemini']
handler.tags = ['tools']
export default handler