import { readdirSync, unlinkSync, existsSync, promises as fs, statSync } from 'fs';
import path from 'path';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const handler = async (m, { conn }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, { text: '🌱 Utiliza este comando directamente en el número principal del Bot.' }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { text: '🌷 Iniciando limpieza de sesiones de subbots (solo archivos innecesarios)...' }, { quoted: m });

  const basePath = './Sesiones/Subbots/';
  let totalDeleted = 0;
  let totalSize = 0;

  try {
    if (!existsSync(basePath)) {
      return await conn.sendMessage(m.chat, { text: `🌳 La carpeta ${basePath} no existe.` }, { quoted: m });
    }

    const folders = readdirSync(basePath).filter(name => {
      const fullPath = path.join(basePath, name);
      return existsSync(fullPath) && statSync(fullPath).isDirectory();
    });

    for (const folder of folders) {
      const folderPath = path.join(basePath, folder);
      const files = await fs.readdir(folderPath);

      for (const file of files) {
        if (file !== 'creds.json') {
          const filePath = path.join(folderPath, file);
          const stats = statSync(filePath);
          totalSize += stats.size;

          await fs.unlink(filePath);
          totalDeleted++;
        }
      }
    }

    const sizeFormatted = formatSize(totalSize);
    const msg = totalDeleted > 0
      ? `🌿 Se eliminaron ${totalDeleted} archivos innecesarios en Subbots, liberando ${sizeFormatted}.\n\n📌 Se conservaron todos los archivos creds.json.`
      : '🌴 No se encontraron archivos innecesarios en las sesiones de los subbots.';

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m });

  } catch (err) {
    console.error('Error durante la limpieza de subbots:', err);
    await conn.sendMessage(m.chat, { text: '🌄 Ocurrió un error durante la limpieza de sesiones de subbots.' }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { text: `🌾 Si no se ven los mensajes, haga un pequeño spam de comandos desde el número del bot.` }, { quoted: m });
};

handler.help = ['ds'];
handler.tags = ['owner'];
handler.command = /^ds$/i;
handler.rowner = true;

export default handler;