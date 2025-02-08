import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import cp, { exec as _exec } from 'child_process';

const exec = promisify(_exec).bind(cp);

let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
  if (!text) {
    throw `
✳️ Uso: ${usedPrefix + command} <prefijo>

📌 Ejemplo:
${usedPrefix + command} owner
`.trim();
  }
  const pluginDir = './plugins';
  let files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));

  
  let matchedFiles = files.filter(file => file.startsWith(text));

  if (matchedFiles.length === 0) {
    return m.reply(`❌ No se encontraron archivos que comiencen con: *${text}*`);
  }

  let responseText = `📂 *Archivos encontrados con el prefijo:* ${text}\n\n` +
    matchedFiles.map(file => `- ${file.replace('.js', '')}`).join('\n');

  let msg = await conn.sendMessage(m.chat, { text: responseText }, { quoted: m });

 
  for (let file of matchedFiles) {
    let filePath = path.join(pluginDir, file);
    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(filePath),
      mimetype: 'application/javascript',
      fileName: file
    }, { quoted: msg });
  }
};

handler.help = ['getplugins'];
handler.tags = ['owner'];
handler.command = ['gets', 'gps'];
handler.rowner = true;

export default handler;