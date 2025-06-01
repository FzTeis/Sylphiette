import { readdirSync, unlinkSync, existsSync, promises as fs, statSync } from 'fs';
import path from 'path';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const handler = async (m, { conn, usedPrefix }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, { text: '🌱 Utiliza este comando directamente en el número principal del Bot.' }, { quoted: m });
  }
  
  await conn.sendMessage(m.chat, { text: '🌷 Iniciando proceso de eliminación de todos los archivos de sesión, excepto el archivo creds.json...' }, { quoted: m });

  const sessionPath = './Data/Sesiones/Principal/';
  try {
    if (!existsSync(sessionPath)) {
      return await conn.sendMessage(m.chat, { text: `🌳 La carpeta ${sessionPath} no existe o está vacía.` }, { quoted: m });
    }

    const files = await fs.readdir(sessionPath);
    let filesDeleted = 0;
    let totalSize = 0;

    for (const file of files) {
      if (file !== 'creds.json') {
        const filePath = path.join(sessionPath, file);
        const stats = statSync(filePath);
        totalSize += stats.size;

        await fs.unlink(filePath);
        filesDeleted++;
      }
    }

    if (filesDeleted === 0) {
      await conn.sendMessage(m.chat, { text: `🌴 No se encontró ningún archivo para eliminar en la carpeta ${sessionPath}.` }, { quoted: m });
    } else {
      const sizeFormatted = formatSize(totalSize);
      await conn.sendMessage(m.chat, { text: `🌿 Se eliminaron ${filesDeleted} archivos de sesión, liberando ${sizeFormatted}.\n\n📌 No se eliminó el archivo creds.json.` }, { quoted: m });
    }
  } catch (err) {
    console.error('Error al leer la carpeta o los archivos de sesión:', err);
    await conn.sendMessage(m.chat, { text: '🌄 Ocurrió un error al eliminar los archivos de sesión.' }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { text: `🌾 Si no se ven los mensajes, haga un pequeño spam de comandos desde el número del bot.` }, { quoted: m });
};

handler.help = ['dsowner'];
handler.tags = ['owner'];
handler.command = /^(del_reg_in_session_owner|dsowner|clearallsession)$/i;
handler.rowner = true;

export default handler;