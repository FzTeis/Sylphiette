import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';
const teks = '*0 - Sí*\n*1 - No*\n*2 - No sé*\n*3 - Probablemente sí*\n*4 - Probablemente no*\n*5 - Volver a la pregunta anterior*';
export async function before(m) {
  if (global.db.data.users[m.sender].banned) return;
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text) return !0;
  const aki = global.db.data.users[m.sender].akinator;
  if (!aki.sesi || m.quoted.id != aki.soal.key.id) return;
  if (!somematch(['0', '1', '2', '3', '4', '5'], m.text)) return this.sendMessage(m.chat, {text: `*[❗] Responde con los números; 0, 1, 2, 3 , 4, 5*\n\n${teks}`}, {quoted: aki.soal});
  const {server, frontaddr, session, signature, question, progression, step} = aki;
  if (step == '0' && m.text == '5') return m.reply('*[❗] ya no hay más preguntas anteriores, está es la primera*');
  let res; let anu; let soal;
  try {
    if (m.text == '5') res = await fetch(`https://api.lolhuman.xyz/api/akinator/back?apikey=GataDios&server=${server}&session=${session}&signature=${signature}&step=${step}`);
    else res = await fetch(`https://api.lolhuman.xyz/api/akinator/answer?apikey=GataDios&server=${server}&frontaddr=${frontaddr}&session=${session}&signature=${signature}&step=${step}&answer=${m.text}`);
    anu = await res.json();
    if (anu.status != '200') {
      aki.sesi = false;
      aki.soal = null;
      return m.reply('*[❗] La sesión con Akinator ha terminado por lo que se cancela el juego*');
    }
    anu = anu.result;
    if (anu.name) {
      await this.sendMessage(m.chat, {image: {url: anu.image}, caption: `🎮 *A K I N A T O R* 🎮\n\n*Akinator cree que tu personaje es:  ${anu.name}*\n_${anu.description}_`, mentions: [m.sender]}, {quoted: m});
      aki.sesi = false;
      aki.soal = null;
    } else {
      const resultes = await translate(`${anu.question}`, {to: 'es', autoCorrect: true});
      soal = await this.sendMessage(m.chat, {text: `🎮 *A K I N A T O R* 🎮\n*Progreso: ${anu.step} (${anu.progression.toFixed(2)} %)*\n\n*Jugador: @${m.sender.split('@')[0]}*\n*Pregunta: ${resultes.text}*\n\n${teks}`, mentions: [m.sender]}, {quoted: m});
      aki.soal = soal;
      aki.step = anu.step;
      aki.progression = anu.progression;
    }
  } catch (e) {
    aki.sesi = false;
    aki.soal = null;
    m.reply('*[❗] Error, intentelo después*');
  }
  return !0;
}
function somematch( data, id ) {
  const res = data.find((el) => el === id );
  return res ? true : false;
}