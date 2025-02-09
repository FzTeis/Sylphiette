import { watchFile, unwatchFile } from 'fs'
import * as cheerio from 'cheerio'
import { getDevice } from '@whiskeysockets/baileys'
import yts from 'yt-search'
//import Scraper from '@SumiFX/Scraper'
import * as Scraper from 'ruhend-scraper'
import axios from 'axios'
import https from 'https'
import chalk from 'chalk'
import { ytmp4, ytmp3 } from 'ruhend-scraper'
import fg from 'api-dylux'
import fs from 'fs'
import yt from 'ytdl-core'
import ytdl from 'ytdl-core'
import fetch from 'node-fetch'
import * as fileType from 'file-type'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import * as scrapers from '@bochilteam/scraper'
import { es } from "./lib/total-idiomas.js"
global.botnumber = "+52 243 108 5732";
global.confirmCode = "SYLPHUWU";
global.owner = [
  ['5212431085732', '>\`\` I\'m Sylph ~', true],
  ['5212431268546', '>\` I\'m Fz ~', true],
  ['50242783087', '>\`\`\` I\'m Danny ~ 卐', true],
] //Numeros de owner 
global.colabs = [
  ['50242783087', '>\`\`\` I\'m Danny ~ 卐', true]
] //Colaboradores 

global.mods = [''] 
global.prems = ['50489079501', '573143917092']
global.APIs = { // API Prefix
  // name: 'https://website' 
  nrtm: 'https://fg-nrtm.ddns.net',
  fgmods: 'https://api.fgmods.xyz',
  fzteis: 'https://api--fzteis.repl.co',
  fz: 'https://fz-api.fzteis.repl.co'
}
global.fgapis = ['ELhI4IG6', 'Ys3CfFTU', '6IbiVq6V', 'dEBWvxCY']
global.fgkey = fgapis[Math.floor(fgapis.length * Math.random())];
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.fgmods.xyz': `${fgkey}` //--- 100 de límite diario --- Regístrese en https://api.fgmods.xyz/
}
// Sticker WM
global.packname = 'Sylph | Bot - Multi Device' 
global.author = `FzKl.fcv`
global.wm = '┊ꦿ🎄⿻ Sylph | Wa Bot❜ೃ'

global.insta = 'https://www.instagram.com/'
	
//imágenes
global.imagen0 = fs.readFileSync('./src/Sylph_logo.jpg');
global.imagen = fs.readFileSync('./src/Sylph.jpg');
global.imagen3 = 'https://telegra.ph/file/62fa3e30dc861a3fde73b.jpg';
//--info
global.botName = 'Sylph Bot - The best'
global.fglog = 'https://i.ibb.co/1zdz2j3/logo.jpgs' 
global.link_ = 'https://chat.whatsapp.com/CN3YieShy2S3LnVRJ7aPPm'

global.getDevice = getDevice
global.axios = axios 
global.fs = fs
global.cheerio = cheerio
global.fg = fg
global.path = path
global.yts = yts
global.fetch = fetch
global.fileType = fileType
global.Scraper = Scraper
global.scrapers = scrapers

global.ytdl = ytdl
global.yt = yt
global.wait = '⌛ _Espera un momento . . ._'
global.rwait = '⌛'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥' 

global.multiplier = 69 
global.maxwarn = '2' // máxima advertencias

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})