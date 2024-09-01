import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';
const handler = async (m, {conn, usedPrefix, command, text}) => {
const akinator = global.db.data.users[m.sender].akinator;
		    if (typeof akinator !== 'object') {
        global.db.data.users[m.sender].akinator = {};
      }
		    if (akinator) {
        if (!('sesi' in akinator)) akinator.sesi = false;
        if (!('server' in akinator)) akinator.server = null;
        if (!('frontaddr' in akinator)) akinator.frontaddr = null;
        if (!('session' in akinator)) akinator.session = null;
        if (!('signature' in akinator)) akinator.signature = null;
        if (!('question' in akinator)) akinator.question = null;
        if (!('progression' in akinator)) akinator.progression = null;
        if (!('step' in akinator)) akinator.step = null;
        if (!('soal' in akinator)) akinator.soal = null;
	            } else {
        global.db.data.users[m.sender].akinator = {
          sesi: false,
          server: null,
          frontaddr: null,
          session: null,
          signature: null,
          question: null,
          progression: null,
          step: null,
          soal: null,
        };
      }
      
  if (m.isGroup) return;
  const aki = global.db.data.users[m.sender].akinator;
  if (text == 'end') {
    if (!aki.sesi) return m.reply('*[❗] Actualmente no estas en una partida de akinator*');
    aki.sesi = false;
    aki.soal = null;
    m.reply('*[❗] se elimino la sesión con éxito!*');
  } else {
    if (aki.sesi) return conn.reply(m.chat, '*[❗] todavía estas en una partida de akinator*', aki.soal);
    try {
      const res = await fetch(`https://api.lolhuman.xyz/api/akinator/start?apikey=GataDios`);
      const anu = await res.json();
      if (anu.status !== 200) throw '*[❗] Error, inténtelo de nuevo*';
      const {server, frontaddr, session, signature, question, progression, step} = anu.result;
      aki.sesi = true;
      aki.server = server;
      aki.frontaddr = frontaddr;
      aki.session = session;
      aki.signature = signature;
      aki.question = question;
      aki.progression = progression;
      aki.step = step;
      const resultes2 = await translate(question, {to: 'es', autoCorrect: false});
      let txt = `🎮 *ＡＫＩＮＡＴＯＲ* 🎮\n\n*• Jugador: @${m.sender.split('@')[0]}*\n*• Pregunta: ${resultes2.text}*\n\n`;
      txt += '*0 - Sí*\n';
      txt += '*1 - No*\n';
      txt += '*2 - No sé*\n';
      txt += '*3 - Probablemente sí*\n';
      txt += '*4 - Probablemente no*\n\n';
      txt += `*Usa el comando; "${usedPrefix + command} end" para terminar la partida (sesión)*`;
      const soal = await conn.sendMessage(m.chat, {text: txt, mentions: [m.sender]}, {quoted: m});
      aki.soal = soal;
    } catch {
      m.reply('*[❗] ocurrió un error, reportalo al creador*');
    }
  }
};
handler.help = ['akinator'];
handler.tags = ['game'];
handler.command = /^(akinator)$/i;
export default handler;