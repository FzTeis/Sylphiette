import { watchFile, unwatchFile } from 'fs';
import * as cheerio from 'cheerio';
import { getDevice } from '@whiskeysockets/baileys';
import yts from 'yt-search';
import axios from 'axios';
import fg from 'api-dylux';
import fs from 'fs';
import fetch from 'node-fetch';
import * as type from 'file-type';
import { fileURLToPath } from 'url';
import path from 'path';
import { es } from "./lib/total-idiomas.js";

global.botnumber = "";
global.confirmCode = "";
global.owner = [
  ['5212431085732', '>\`\` I\'m Sylph ~', true],
  ['5212431268546', '>\` I\'m Fz ~', true]
];
global.colabs = [
  ['50242783087', '>\`\`\` I\'m Danny ~ 卐', true]
];
global.mods = [''];
global.prems = [''];

global.APIs = {
  nrtm: 'https://fg-nrtm.ddns.net',
  fgmods: 'https://api.fgmods.xyz'
};

global.fgapis = ['ELhI4IG6', 'Ys3CfFTU', '6IbiVq6V', 'dEBWvxCY'];
global.fgkey = fgapis[Math.floor(fgapis.length * Math.random())];

global.APIKeys = {
  'https://api.fgmods.xyz': `${fgkey}`
};

// Sticker WM
global.packname = 'Sylph | Bot - Multi Device';
global.footer = "тнe вeѕт wнaтѕapp вy ι'м ғz";
global.author = `I'm Fz ~`;
global.wm = '┊ꦿ🎄⿻ Sylph | Wa Bot❜ೃ';

global.insta = 'https://www.instagram.com/';

// Imágenes
global.imagen0 = fs.readFileSync('./src/Sylph_logo.jpg');
global.imagen = fs.readFileSync('./src/Sylph.jpg');
global.imagen3 = 'https://telegra.ph/file/62fa3e30dc861a3fde73b.jpg';

// Info
global.botName = 'Sylph Bot - The best';
global.menu = "https://cdnmega.vercel.app/media/AxZ0gAIT@NQSMq0WtM7ZIJgW9e1ExwfQyJk6mb468ZhqN78X1_hY";
global.fglog = 'https://i.ibb.co/1zdz2j3/logo.jpgs';
global.link_ = 'https://chat.whatsapp.com/CN3YieShy2S3LnVRJ7aPPm';

// Subbots & Sesiones
global.jadi = "Sesiones/Subbots";
global.syl = "Sesiones/Principal";

// Otros
global.axios = axios;
global.fs = fs;
global.cheerio = cheerio;
global.fg = fg;
global.path = path;
global.yts = yts;
global.fetch = fetch;
global.fileType = type;

global.wait = '⌛ _Espera un momento . . ._';
global.rwait = '⌛';
global.dmoji = '🤭';
global.done = '✅';
global.error = '❌';
global.xmoji = '🔥';

global.multiplier = 69;
global.maxwarn = '2';

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log("Update 'config.js'");
  import(`${file}?update=${Date.now()}`);
});