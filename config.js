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
global.botnumber = "";
global.confirmCode = "";
global.owner = [
  ['17146121800', '>\`\` I\'m Sylph ~', true],
  ['5212431268546', '>\` I\'m Fz ~', true],
  ['50242783087', '>\`\`\` I\'m Danny ~ 卐', true],
  ['5215534215245', 'lancillo el pendejo', true]
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

////// SCRAPERS BY FZ /////
//Facebook:
global.facebookDl = async function facebookDl(t) {
  return new Promise(async (e, a) => {
    const i = await fetch("https://www.getfvid.com/downloader", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://www.getfvid.com/",
        },
        body: new URLSearchParams(Object.entries({ url: t })),
      }),
      o = cheerio.load(await i.text());
    e({
      result: {
        url: t,
        title: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-5.no-padd > div > h5 > a"
        ).text(),
        time: o("#time").text(),
        hd: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a"
        ).attr("href"),
        sd: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a"
        ).attr("href"),
        audio: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(3) > a"
        ).attr("href"),
      },
    });
  });
}
//////////// YOUTUBE
global.DOWNLOAD_YT = async function DOWNLOAD_YT(input) {
    let ytSearch = await yts(input)
    let { title, url, thumbnail, description, views, ago, duration } = ytSearch.videos[0]

    let { video, quality, size } = await ytmp4(url)

    let { audio } = await ytmp3(url)

    let resultados = {
        Status: true,
        Creator: "i'm Fz",
        title: title,
        description: description,
        views: views,
        ago: ago,
        duration: duration,
        url: url,
        video: {
            dl_link: video,
            size: size,
            quality: quality
        },
        audio: {
            dl_link: audio
        }

    }

    return resultados

}
/////////// INSTAGRAM:
 global.igDown = async function igDown(url) {
  return new Promise(async (resolve, reject) => {
    const payload = new URLSearchParams(
      Object.entries({
        url: url,
        host: "instagram"
      })
    )
    await axios.request({
      method: "POST",
      baseURL: "https://saveinsta.io/core/ajax.php",
      data: payload,
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: "PHPSESSID=rmer1p00mtkqv64ai0pa429d4o",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
      }
    })
    .then(( response ) => {      
      const $ = cheerio.load(response.data)
      const mediaURL = $("div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom").map((_, el) => {
        return "https://saveinsta.io/" + $(el).find("div.col-md-8.mx-auto > a").attr("href")
      }).get()
      const res = {
        status: 200,
        creator: 'Fz',
        media_link: mediaURL
      }
      
      resolve(res)
    })
    .catch((e) => {
      console.log(e)
      throw {
        status: 400,
        message: "error",
      }
    })
  })
}
///////////////
global.multiplier = 69 
global.maxwarn = '2' // máxima advertencias

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})