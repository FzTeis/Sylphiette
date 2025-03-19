
import { join, dirname } from 'path'
import { createRequire } from 'module';
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts';
import { createInterface } from 'readline'
import yargs from 'yargs'
import express from 'express'
import chalk from 'chalk'
import path from 'path'
import os from 'os'
import { promises as fsPromises } from 'fs'

// https://stackoverflow.com/a/50052194
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname) // Bring in the ability to create the 'require' method
const { name, author } = require(join(__dirname, './package.json')) // https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

const app = express()
const port = process.env.PORT || 8080;


app.listen(port, () => {
  console.log(chalk.green(`🌐 Puerto ${port} esta abierto`));
});

var isRunning = false

async function ensureTmpFolder() {
  const tmpDir = path.join(__dirname, 'tmp');
  try {
    const folderExists = await fsPromises.access(tmpDir).then(() => true).catch(() => false);
    if (!folderExists) {
      await fsPromises.mkdir(tmpDir);
        console.log(chalk.yellow(`La carpeta tmp ha sido creada con éxito.`));
    } else {
      console.log(chalk.cyan('La carpeta tmp ya existe.'));
    }
  } catch (error) {
    console.error('Ocurrió un error al verificar o crear la carpeta "tmp":', error);
  }
}

async function start(file) {
  if (isRunning) return
  isRunning = true
  const currentFilePath = new URL(import.meta.url).pathname
  let args = [join(__dirname, file), ...process.argv.slice(2)]
  say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  })
  await ensureTmpFolder();

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  })
  let p = fork()
  p.on('message', data => {
    console.log('[RECEIVED]', data)
    switch (data) {
      case 'reset':
        p.process.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }
  })
  //---
  p.on('exit', (_, code) => {
    isRunning = false
    console.error('Ocurrió un error inesperado:', code)
    start('main.js'); //

    if (code === 0) return
    watchFile(args[0], () => {
      unwatchFile(args[0])
      start(file)
    })
  })
console.clear();
console.log(chalk.bold("SYLPHIETTE'S | THE BEST"));
console.log(chalk.gray("Version 1.0.1 ( Beta Version )\n"));

console.log(chalk.bold("System Information :"));
console.log(chalk.gray("──────────────────"))
  console.log(chalk.yellow(`${os.type()}, ${os.release()} - ${os.arch()}`));
  const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
  console.log(chalk.yellow(`Total RAM: ${ramInGB.toFixed(2)} GB`));
  const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
  console.log(chalk.yellow(`Free RAM: ${freeRamInGB.toFixed(2)} GB`));

  const packageJsonPath = path.join(path.dirname(currentFilePath), './package.json');
  try {
    const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8');
    const packageJsonObj = JSON.parse(packageJsonData);
    console.log(chalk.blue.bold(`\nInformación del paquete :`));
    console.log(chalk.gray("──────────────────"))
    console.log(chalk.cyan(`Nombre: ${packageJsonObj.name}`));
    console.log(chalk.cyan(`Versión: ${packageJsonObj.version}`));
    console.log(chalk.cyan(`Descripción: ${packageJsonObj.description}`));
    console.log(chalk.cyan(`Autor: ${packageJsonObj.author.name}`));
   console.log(chalk.gray("──────────────────"))
  } catch (err) {
    console.error(chalk.red(`No se pudo leer el archivo package.json: ${err}`));
  }
console.log(chalk.bold("\nInformation on the development of the bot"))
console.log(chalk.gray("──────────────────"))
console.log(chalk.blue.bold(`Hora Actual`));
  const currentTime = new Date().toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' });
  console.log(chalk.cyan(`${currentTime}`));
console.log(chalk.cyanBright("Developer : I'm Fz ~"))
console.log(chalk.cyanBright("Bot name : Sylphiette"))

console.log(chalk.gray("Starting bot in 1 second...\n"))
  //setInterval(() => {}, 1000);

  //----
  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
  if (!opts['test'])
    if (!rl.listenerCount()) rl.on('line', line => {
      p.emit('message', line.trim())
    })
  // console.log(p)
}
setTimeout(() => {
      start('main.js');
    }, 100);
//start('main.js')

