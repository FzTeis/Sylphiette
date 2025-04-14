import fs from 'fs';
import path from 'path';

const sbDir = './Sesiones/Principal/';
const ssDir = './Sesiones/Subbots/';

const ok = (msg) => console.log(`\x1b[44m\x1b[37m%s\x1b[0m`, msg);
const err = (msg) => console.log(`\x1b[100m\x1b[31m%s\x1b[0m`, msg); 
async function clearSB() {
  fs.readdir(sbDir, (e, dirs) => {
    if (e) return err('Cannot read SB dir: ' + e);

    dirs.forEach((d) => {
      const dPath = path.join(sbDir, d);
      fs.readdir(dPath, (e, files) => {
        if (e) return err('Cannot read subdir: ' + e);

        files.forEach((f) => {
          if (f !== 'creds.json') {
            const fPath = path.join(dPath, f);
            fs.unlink(fPath, (e) => {
              if (e && e.code !== 'ENOENT') {
                err(`Error deleting SB file ${f}: ${e}`);
              } else {
                ok(`SB file deleted: ${f}`);
              }
            });
          }
        });
      });
    });
  });
}

async function clearSS() {
  fs.readdir(ssDir, (e, files) => {
    if (e) return err('Cannot read SS dir: ' + e);
    files.forEach((f) => {
      if (f !== 'creds.json') {
        const fPath = path.join(ssDir, f);
        fs.unlink(fPath, (e) => {
          if (e && e.code !== 'ENOENT') {
            err(`Error deleting SS file ${f}: ${e}`);
          } else {
            ok(`SS file deleted: ${f}`);
          }
        });
      }
    });
  });
}

setInterval(clearSB, 60 * 60 * 1000);
setInterval(clearSS, 60 * 60 * 1000);

clearSB();
clearSS();