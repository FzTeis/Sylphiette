import { tmpdir } from 'os';
import { join } from 'path';
import fs from 'fs';
import { readdirSync, unlinkSync, statSync, rmdirSync } from 'fs';

let handler = async (m, { conn, __dirname, args }) => {
  let totalFreedSpace = 0;
  const calculateSize = (filePath) => {
    try {
      const stats = statSync(filePath);
      if (stats.isFile()) {
        return stats.size;
      } else if (stats.isDirectory()) {
        return readdirSync(filePath)
          .map((subFile) => calculateSize(join(filePath, subFile)))
          .reduce((acc, size) => acc + size, 0);
      }
      return 0;
    } catch (e) {
      console.error(`Error al calcular el tamaño de ${filePath}:`, e.message);
      return 0;
    }
  };
  const deleteRecursively = (filePath) => {
    try {
      const stats = statSync(filePath);
      if (stats.isFile()) {
        totalFreedSpace += stats.size;
        unlinkSync(filePath);
      } else if (stats.isDirectory()) {
        readdirSync(filePath).forEach((subFile) =>
          deleteRecursively(join(filePath, subFile))
        );
        rmdirSync(filePath);
      }
    } catch (e) {
      console.error(`Error al eliminar ${filePath}:`, e.message);
    }
  };
  const tmpDirs = [tmpdir(), join(__dirname, '../tmp')];
  tmpDirs.forEach((dir) =>
    readdirSync(dir).forEach((file) => deleteRecursively(join(dir, file)))
  );

  const Sessions = './Sesion Principal';
  readdirSync(Sessions).forEach((file) => {
    const filePath = join(Sessions, file);
    if (file !== 'creds.json') {
      deleteRecursively(filePath);
    }
  });
  const formatSize = (size) => {
    if (size >= 1e9) return `${(size / 1e9).toFixed(2)} GB`;
    if (size >= 1e6) return `${(size / 1e6).toFixed(2)} MB`;
    if (size >= 1e3) return `${(size / 1e3).toFixed(2)} KB`;
    return `${size} bytes`;
  };

  m.reply(`✅ Se limpiaron las carpetas *tmp + sessions* y se liberaron ${formatSize(totalFreedSpace)} de almacenamiento.`);
  m.react(done);
};

handler.help = ['cleartmp'];
handler.tags = ['owner'];
handler.command = /^(cleartmp)$/i;
handler.rowner = true;

export default handler;