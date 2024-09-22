bla = process.cwd()
__path = process.cwd()

//=======[ PORTA DE ACESSO ]======\\
const PORT = process.env.PORT || 3041 || 2022 || 443

//=======[ REQUISIÇÕES ]======\\
const ffmpeg = require('fluent-ffmpeg');
const uuid = require('uuid').v4
const fs = require('fs')
const hx = require('hxz-api');
const axios = require('axios')
const zrapi = require('zrapi')
const jpeg = require('jpeg-js')
const { GOOGLE_IMG_SCRAP , GOOGLE_QUERY } = require('google-img-scrap');
const yts = require('yt-search')
const translate = require('translate-google-api')
const multer = require('multer')
const Ddos = require('ddos')
const express = require('express')
const request = require('request');
const cheerio = require('cheerio');
const fetch = require('node-fetch')
const FormData = require('form-data')
const canvacord = require("canvacord")
const lyricsFinder2 = require('lyrics-finder');
const uber = require('uberduck-api')
var { igstory} = require('./base de dados/scrape.js');
const { Youtube } = require('ytdownloader.js')
var canvasx = require('discord-canvas')
var { fromBuffer } = require('file-type')
const BrainlySearch = require('./base de dados/brainly.js')
const {fetchJson} = require('./base de dados/myfunc')
const isUrl = require("is-url")
//var aexm = require('@lolikillers/aexm-api');
var gerarnick = require('./base de dados/gerarnick.js')
var { mediafireDl } = require('./base de dados/mediafire.js');
const twtdl = require('./base de dados/twtdl.js')
const yt = require("@ernestoyoofi/yt.loader-to");
var buffer = require('./base de dados/upload.js')
var exec = require('child_process').exec;
var { Maker } = require('imagemaker.js')
var TikTokScraper = require('tiktok-scraper');
var download = require('@phaticusthiccy/open-apis')
const Correios = require('cep-address-finder')
const { EmojiAPI } = require("emoji-api");
const emoji = new EmojiAPI();
var thiccysapi = require('textmaker-thiccy');
var { pinterest } = require('./base de dados/funções.js')
const { download_Url } = require("./base de dados/function.js");
//const mintake = require(bla + '/base de dados/modules/mintake');
//const mumaker = require(bla + '/base de dados/modules/mumaker');
var wiki = require("@dada513/wikipedia-search")
const ytdl = require("ytdl-core")
var { searchSpotify, getTrackSpotify, getAlbumSpotify, getPlaylistSpotify, getArtistSpotify, getDownloadMultiLink, getDownloadSingleLink } = require('./base de dados/spotify.js')
const NASA = require('@killovsky/nasa');
var trans = require('@vitalets/google-translate-api')
const SANIME = require('selfietoanime');
var Deezer = require("deezer-web-api");
var DeezerClient = new Deezer();
const {savefrom} = require('./base de dados/savefrom.js')
const Pokemon = require('pokemon.js');
const cors = require('cors')
const gabriell = require("./base de dados/listdl.js")
const testing = require("./base de dados/listdl2.js")
const BitlyClient = require('bitly').BitlyClient
const TinyURL = require('tinyurl');
const unfetch = require('isomorphic-unfetch');
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(unfetch)
const { wikimedia } = require("./base de dados/scraper/wikimedia.js")
const { wall } = require("./base de dados/scraper/scraper.js")

var { color } = require('./base de dados/color.js')
var { ytMp3, ytMp4, ytPlay, ytPlayMp4, ytSearch, ytVideosSearch} = require('./base de dados/yt.js')
const { fbdown } = require("./base de dados/facebook.js")
const { ytDonlodMp3_3, ytDonlodMp4_3, ytPlayMp3_3, ytPlayMp4_3, ytSearch_3 } = require("./base de dados/youtubev3");
const {  facebook } = require('./base de dados/downloader.js')
const { gis } = require('./base de dados/gimage.js')
var { ytMp3_2, ytMp4_2, ytPlay_2 } = require('./base de dados/youtubev2.js')
var { nerding, gpwhatsapp, apkmody, pornhubsrc, uptodown, igstalk, soundl, playstore, manga, anime, hentaistube, pornogratis, filme, wattpad } = require('./base de dados/scraper2.js')
var { pensadorSearch, wallpaper2 } = require('./base de dados/scrapper-api.js')
var { tiktok2, FacebookMp4 } = require('./base de dados/downloader.js')
var { PlayStoreSearch, MercadoLivreSearch, AmazonSearch, AmericanasSearch, SubmarinoSearch, Horoscopo } = require('./base de dados/scraper/pesquisas.js')
var { pinterestVideoV2 } = require('./base de dados/pinterest.js')
var { kwai } = require('./base de dados/kwai.js')
var { InArtificial, CorretorOpenAi } = require('./base de dados/scrapper-vip.js')
var { getVideosPlaylist } = require('./base de dados/playlist.js')

var { G1, Poder360, JovemPan, Uol, CNNBrasil, Estadao } = require('./base de dados/scraper/noticias.js')

const path = require("path");

const { dirname } = require('path');

var __dirname = dirname(__filename);

var { memesDroid } = require('./base de dados/scraper/aleacrapper.js')
var { ringtone } = require('./base de dados/scraper/ringtone.js')
var { lirik } = require('./base de dados/sab_scraper.js')

const { AnimeWallpaper } = require("anime-wallpaper");
const BuscaWallpaper = new AnimeWallpaper();
const { snapsave } = require("@bochilteam/scraper")

var { facebookDownloader, instaVideoV1 } = require('./base de dados/scraper/downloaders.js')
var { LetradaMusica } = require('./base de dados/letraMusic.js')

//const { musicard, comunismo, bolsonaro, bnw, blurr, affect, beautiful,circle, del, gay, invert, facepalm, dither, jail, magik, pixelate, rip, sepia, rotate, trash, wanted, wasted, bobross, mms } = require('./base de dados/canvas.js')

const { happymodr } = require('./base de dados/happymod.js')
const { wikiSearch } = require('./base de dados/wikipediaBr.js');
const { aiovideodl, umma, ytPlay_3} = require('./base de dados/scraper-2.js');
const { randomGrupos } = require('./base de dados/groups-random.js');

async function getBuffer(url) {
he = await fetch(url).then(c => c.buffer())
 return he
}
async function Kibar(url) {
he = await fetch(url).then(c => c.json())
 return he
}

const getRandom = (ext) => {
return `${Math.floor(Math.random() * 10000)}${ext}`;
};

async function getBuffer(url) {
he = await fetch(url)
.then(c => c.buffer())
return he
}



//var ddos = new Ddos({burst:4, limit:30, testmode:true, whitelist:['187.21.11.237']});
var ddos = new Ddos({
  burst: 10,       // Permite hasta 10 solicitudes rápidas seguidas
  limit: 50,       // Límite de 50 solicitudes antes de aplicar las restricciones
  testmode: false, // Modo de prueba desactivado, bloquea de forma real
  errormessage: 'Solicitud bloqueada por DDOS', 
  responseStatus: 429,
  includeUserAgent: true, // Esto no está relacionado con la IP, pero puede ayudarte a monitorear las solicitudes
  log: true              // Para ver en los logs cuándo ocurre un bloqueo
});
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-\\
// ============[ APIKEYS ]============ \\

var key = JSON.parse(fs.readFileSync("./database/apikeys.json"));
const usus_r = JSON.parse(fs.readFileSync("./database/usuarios.json"));

async function RG_US(apikey, req) {
var i4 = key.map(i => i?.apikey)?.indexOf(apikey)
if(i4 >= 0) {
key[i4].request -= 1;
fs.writeFileSync("./database/apikeys.json", JSON.stringify(key, null, 2));
var IP = req.headers['x-real-ip'] || req.connection.remoteAddress || 0;
var i3 = usus_r.map(i => i.key).indexOf(apikey);
if(i3 < 0 && !usus_r.map(i => i.IP).includes(IP?.split(":")[3])){
usus_r.push({key: apikey, IP: [IP?.split(":")[3]]})
fs.writeFileSync("./database/usuarios.json", JSON.stringify(usus_r, null, 2));
} else if(i3 >= 0 && !usus_r[i3]?.IP.includes(IP?.split(":")[3])) {
usus_r[i3].IP.push(IP?.split(":")[3])
fs.writeFileSync("./database/usuarios.json", JSON.stringify(usus_r, null, 2));
}}}

//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-\\

// ===[INÍCIO - KEYS ENCURTAR LINK]===== \\
apicuttly = ['4786cc6a0f19de9c67ea6a4282c494323c932','2038c1a7754b408aa8f9055282638c00e668e','89d73b3a07209177d0251e30d49d66bd669ac','e841147455d0fdfbf50f74aefe63b6728adc0','27f3aa3f45cb4460bcbac69b782ca470a4570','31a8df09d5a9d8d009790df0b5642e3d76919','09b4e764ff07b10eac1682e71aaf95a78f358','75fe576ce040b619176af22f5a718b2f574f5','e24ee36f9c1519c0a779667a5182a31fb7ccf','903869065d29e23455ddca922071f4bbeb133']

//Get Api Bittly From https://bitly.com/a/sign_in?rd=/settings/api/    \\
apibitly = ['6cfc18e9bfa554714fadc10a1f6aff7555642348','2243940c230ad0d748059aee58ddf126b65fd8e7','c71b6658a1d271ddaf2a5077de3dcb9d67f68025','cddbceccdc2f1c9d11e4cdd0d2b1d1078e447c43','7915c671fbd90eca96310e5c9442d761225a1080','e5dee46eb2d69fc9f4b0057266226a52a3555356','f09ab8db9cf778b37a1cf8bc406eee5063816dec','964080579f959c0cc3226b4b2053cd6520bb60ad','a4f429289bf8bf6291be4b1661df57dde5066525','3d48e2601f25800f375ba388c30266aad54544ae','4854cb9fbad67724a2ef9c27a9d1a4e9ded62faa','d375cf1fafb3dc17e711870524ef4589995c4f69','43f58e789d57247b2cf285d7d24ab755ba383a28','971f6c6c2efe6cb5d278b4164acef11c5f21b637','ae128b3094c96bf5fd1a349e7ac03113e21d82c9','e65f2948f584ffd4c568bf248705eee2714abdd2','08425cf957368db9136484145aa6771e1171e232','dc4bec42a64749b0f23f1a8f525a69184227e301','0f9eb729a7a08ff5e73fe1860c6dc587cc523035','037c5017712c8f5f154ebbe6f91db1f82793c375']

// ===[FIM - KEYS ENCURTAR LINK]===== \\

const headers = {
'accept': '*/*',
'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53',
'Accept-Language': 'en-US,en;q=0.9,it;q=0.8,es;q=0.7',
'referer': 'https://www.google.com/',
'cookie': 'DSID=AAO-7r4OSkS76zbHUkiOpnI0kk-X19BLDFF53G8gbnd21VZV2iehu-w_2v14cxvRvrkd_NjIdBWX7wUiQ66f-D8kOkTKD1BhLVlqrFAaqDP3LodRK2I0NfrObmhV9HsedGE7-mQeJpwJifSxdchqf524IMh9piBflGqP0Lg0_xjGmLKEQ0F4Na6THgC06VhtUG5infEdqMQ9otlJENe3PmOQTC_UeTH5DnENYwWC8KXs-M4fWmDADmG414V0_X0TfjrYu01nDH2Dcf3TIOFbRDb993g8nOCswLMi92LwjoqhYnFdf1jzgK0'};

const router = express.Router();

var upload = multer()

var app = express()
 
app.use(cors())
app.set("json spaces",2)
app.use(express.static("public"))

var blacklist = require('express-blacklist');
app.use(blacklist.blockRequests('blacklist.txt'));

function delFile(file) {
try { fs.unlinkSync(file) } catch (error) {}
}

const { UltimateTextToImage, registerFont } = require("ultimate-text-to-image");

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

ffmpeg.setFfmpegPath(ffmpegPath);

registerFont((__dirname + '/base de dados/fontes/NotoEmoji.ttf'), { family: 'Noto Emoji' });
registerFont(__dirname + '/base de dados/fontes/NotoSansMono.ttf', { family: 'Noto Sans Mono' });

let randomName = (ext) => uuid().split('-')[0] + (ext ? ext : '');

var cores = ['red','lime','yellow','magenta','cyan'];

async function ttp(text, color = '#ffffff', name = randomName('.png')) {
new UltimateTextToImage(text, {
width: 500,
height: 500,
fontFamily: "Noto Emoji, Noto Sans Mono",
fontColor: color,
fontSize: 300,
minFontSize: 10,
lineHeight: 50,
autoWrapLineHeightMultiplier: 1.2,
margin: 15,
//marginBottom: 40,
align: "center",
valign: "middle",
}).render().toFile(`./assets/attp-logs/${name}`);
return `./assets/attp-logs/${name}`;
}

async function attp(text) {
let nome = randomName('');
let lista = [
ttp(text, '#ff0000', `${nome}0.png`),
ttp(text, '#ffa600', `${nome}1.png`),
ttp(text, '#ffee00', `${nome}2.png`),
ttp(text, '#2bff00', `${nome}3.png`),
ttp(text, '#00ffea', `${nome}4.png`),
ttp(text, '#3700ff', `${nome}5.png`),
ttp(text, '#ff00ea', `${nome}6.png`),
];

return new Promise(function (resolve, reject) {
// gerar webp
ffmpeg().addInput((`./assets/attp-logs/${nome}`+"%d.png"))
.addOutputOptions(['-vcodec', 'libwebp', '-vf','scale=500:500:force_original_aspect_ratio=decrease,setsar=1, pad=500:500:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse', '-loop', '50', '-preset', 'default'])
//.outputFPS(15)
.toFormat('webp')
.on('end', () => {
for (let img = 0; img < lista.length; img++) {
delFile("*png");
}
resolve('./assets/attp-logs/'+nome+'.webp')}).on('error', (err) => {
for (let img = 0; img < lista.length; img++) {
delFile("*webp");
}
reject(('erro ffmpeg ' + err));
}).save(('./assets/attp-logs/'+nome+'.webp'));
});
}

const input = require("input");
const chalk = require('chalk');
/*
app.use(cors());
app.set('trust proxy', 1);
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");

const Grupos = [
{ chat: "noxbuscas2", bot: "Noxbuscabot" },
];

//COLOCA SEUS BAGULHO AQ

const apiId = `21844566`; //https://my.telegram.org/auth

const apiHash = `ff82e94bfed22534a083c3aee236761a`; //https://my.telegram.org/auth

const stringSession = new StringSession(`1AQAOMTQ5LjE1NC4xNzUuNTUBuw4J/rSTftH3OTaxSk1p1gAnLWmZmvq/XpIaTKKWvrMOc83qkVTpeBG+G95w06sqMd+9195g1UqxAQhgztVUb9rVIQKbIe9RffU4DtIYAFDy/aU6RgU2UQ0g4YN10FZQdCCBqbXgQm2719vMjOP8QRRZG3DC1xLuOH7ysEYQUDZ5Wk6RjMVF2msaRVFPJpi+N3bfLqB3bPU6y/TKV5RRtG8SP+N57PzPqrQSo9XBvhuhTZd3j8h7cZVGeft9cgFn7FLFEVYpaP4w2e7RL03lB+mZixyt7oJWYgWBKnr1Yd9EikyALfCTe97EWnO4H5YXwcjMy/SopU0l3aUTSE7SWeA=`)
//FIM

const telegram = new TelegramClient(stringSession, apiId, apiHash, {
	connectionRetries: 5
});

(async () => {
	await telegram.start({
		phoneNumber: "522431268546", // ¡AQUÍ TU NÚMERO DE TELÉFONO DE LA CUENTA DE TELEGRAM QUE QUIERES UTILIZAR!
		password: async () => await input.text("insira sua senha: "),
		phoneCode: async () =>
			await input.text("Insira o codigo recebido no seu telegram: "),
		onError: (err) => console.log(err)
	});
	console.log("TELEGRAM: Conectado com sucesso!");
	console.log(telegram.session.save());
	await telegram.sendMessage("me", { message: "To Online!" });
})();*/


////PAGINA INICIAL Q IRA REDIRECIONAR PRA /DOC
 /*const enforceHTTPS = (req, res, next) => {

  if (req.headers['x-forwarded-proto'] !== 'http') {

    return res.redirect('http://' + req.headers.host + req.url);

  }

  next();

};

app.use(enforceHTTPS);
*/
// Aquí van tus rutas

app.get('/111', (req, res) => {

  res.send('Hola Mundo!');

});
router.use(ddos.express);
app.get("/", (req,res,next) => {
console.log("Beep");
res.end("Boop");
})
app.use(router);
 
app.get('/moderador',(req, res) => {
res.sendFile(path.join(__dirname, "./public/", "moderador.html"))})

app.get('/docs',(req, res) => {
res.sendFile(path.join(__dirname, "./public/", "docs.html"))})

app.get('/planos',(req, res) => {
res.sendFile(path.join(__dirname, "./public/", "planos.html"))})

app.get('/api/add-key-sodono',(req, res) => {
a = req.query.a
if(!a.includes("&")) return res.json({message: "falta el &"})
var [apikey, senha, rq] = a.split("&")
var senhaofc = "F_Z"
if(senha != senhaofc) return res.json({message: "Contraseña invalida.."})
if(!apikey) return res.json({message: "¿Dónde está la llave?"})
if(key.map(i => i.apikey).includes(apikey)) {
return res.json({message: "Esta clave ya está incluida dentro del sistema..."})
} else {
key.push({apikey: apikey, request: rq})
fs.writeFileSync("./database/apikeys.json", JSON.stringify(key))
return res.json({message: `Apikey ${apikey} registrada con éxito.`})
}
})

app.get('/api/tirar-key-sodono',(req, res) => {
a = req.query.a
if(!a.includes("&")) return res.json({message: "Falta el &"})
var [apikey, senha] = a.split("&")
var senhaofc = "F_Z"
if(senha != senhaofc) return res.json({message: "Contraseña invalida..."})
if(!apikey) return res.json({message: "¿Y la apikey?"})
if(!key.map(i => i.apikey).includes(apikey)) {
return res.json({message: "La apikey no existe..."})
} else {
var i2 = key.map(i => i.apikey).indexOf(apikey)
key.splice(i2, 1)
fs.writeFileSync("./database/apikeys.json", JSON.stringify(key))
return res.json({message: `Apikey ${apikey} borrada con éxito.`})
}
})

app.get('/api/keyerrada',(req, res) => {
apikey = req.query.apikey;
var ITC = key.map(i => i?.apikey)?.indexOf(apikey);
if(ITC < 0) {
return res.json({message:'Apikey inválida o alcanzó su límite!!'})
} else {return res.json({message:`Apikey Funcionando perfectamente ✔️ - Limite: ${key[ITC]?.request}`})}})

app.get('/welcome', async (req, res, next) => {
if (!req.query.titulo) return res.json({ status: 404, error: 'Insira o parametro: titulo'})
if (!req.query.nome) return res.json({ status: 404, error: 'Insira o parametro: nome'})
if (!req.query.perfil) return res.json({ status: 404, error: 'Insira o parametro: perfil'})
if (!req.query.fundo) return res.json({ status: 404, error: 'Insira o parametro: fundo'})
if (!req.query.grupo) return res.json({ status: 404, error: 'Insira o parametro: grupo'})

let welcomer = await new canvasx.Welcome()
.setUsername(req.query.nome)
.setDiscriminator("2022")
.setText("title", req.query.titulo)
.setText("message", req.query.grupo)
.setAvatar(req.query.perfil)
.setColor('border', '#00100C')
.setColor('username-box', '#00100C')
.setColor('discriminator-box', '#00100C')
.setColor('message-box', '#00100C')
.setColor('title', '#00FFFF')
.setBackground(req.query.fundo)
.toAttachment()
let base64 = `${welcomer.toBuffer().toString('base64')}`
require('fs').writeFileSync(bla+'/assets/welkom.png', base64, 'base64')
res.sendFile(bla+'/assets/welkom.png')
})

app.get('/api/playstore', async(req, res, next) => {
apikey = req.query.apikey;
nome = req.query.nome
 if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
 if (!nome) return res.json({ status : false,  message: "Por favor, ingresa el parámetro: nome"})
 RG_US(apikey, req);
PlayStoreSearch(nome).then(data => {
res.json({
pesquisa: data
})}).catch(e => {
res.json({
message: `Ocurrió un error.`
})})})

app.get('/api/pinterest', (req, res) => {
(async() => {
apikey = req.query.apikey
text = req.query.text
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
if (!text) return res.json({ status : false,  message : "Cade o parametro text?"})
RG_US(apikey, req);
pin = await pinterest(text)
ac = pin[Math.floor(Math.random() * pin.length)]
res.type('jpg')
res.send(await getBuffer(ac))
})()
})

app.get('/api/spotifysearch', async(req, res, next) => {
 apikey = req.query.apikey;
 query = req.query.query
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
if (!query) return res.json({ status : false,  message: "Por favor, ingresa el parámetro: query"})
RG_US(apikey, req);
searchSpotify(query).then((resolve) => { 
res.json(resolve)
}).catch(e => {
res.json({
message: `Ocurrió un error.`
})})})

app.get('/api/spotifydl', async(req, res, next) => {
 apikey = req.query.apikey;
 id = req.query.id
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
if (!id) return res.json({ status : false,  message: "Por favor, ingresa el parámetro: id"})
RG_US(apikey, req);
getDownloadSingleLink(id).then((resultado) => { 
res.json(resultado)
console.log(resultado)
}).catch(e => {
console.log(e)
res.json({
message: `Ocurrió un error.`
})})})

app.get('/api/instagram', async(req, res, next) => {
apikey = req.query.apikey;
url = req.query.url
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
if (!url) return res.json({ status : false,  message: "cade o parametro url?"})
RG_US(apikey, req);
mumaker.instagram(url).then(data => {
res.json({status: true, código: 200, resultado: data})
}).catch(e => {
res.json({status: false, código: 404, message: `Ocurrió un error.`})
})
})

app.get('/api/twitter', async(req, res, next) => {
apikey = req.query.apikey;
url = req.query.url
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
if (!url) return res.json({ status : false,  message: "cade o parametro url?"})
RG_US(apikey, req);
twtdl(url).then(data => {
res.json({status: true, código: 200, resultado: { images: data.images, videos: data.videos, gifs: data.gifs}})
}).catch(e => {
res.json({status: false, código: 404, message: `Ocurrió un error.`})
})
})

app.get('/api/pornhub-search', async(req, res, next) => {
apikey = req.query.apikey;
q = req.query.q
 if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
 if (!q) return res.json({ status : false,  message: "Por favor, ingresa el parámetro: q"})
 RG_US(apikey, req);
 pornhubsrc(q).then(resultado => {
res.json({
status: true,
código: 200,
Creator: `I\'m Fz`,
resultado: resultado
})}).catch(e => {
res.json({
message: `Ocurrió un error.`
})})})

router.get('/api/linkshort/bitly', async (req, res, next) => {
link = req.query.link
apikey = req.query.apikey;
if (link === undefined || apikey === undefined) return res.status(404).send({status: 404,message: `insira o parâmetro link & apikey`});
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
var islink = isUrl(link)
if (!islink) return res.json({ status : false, message : "[!] insira uma url válido"})  
let randomapibitly = apibitly[Math.floor(Math.random() * apibitly.length)]
const bitly = new BitlyClient(randomapibitly)
RG_US(apikey, req);
bitly.shorten(link).then(function(result) {
res.json({status: true, Creator: `I\'m Fz`, result : result.link})
}).catch(function(error) {
 res.json({erro: "Ocurrió un error."})
});
})

router.get('/api/linkshort/tinyurlwithalias', async (req, res, next) => {
var link = req.query.link
var alias = req.query.alias
var apikey = req.query.apikey;
if (link === undefined || alias === undefined || apikey === undefined) return res.status(404).send({status: 404,message: `insira o parâmetro link & alias & apikey`});
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
if (!islink) return res.json({ status : false, message : "[!] insira parâmetros de URL"})  
const data = { 'url': link, 'alias': shortText(alias, 30) }
TinyURL.shortenWithAlias(data).then(function(link)  {	
if (link == "Error") return res.json({erro: "Ocurrió un error."})
RG_US(apikey, req);
res.json({status: true, Creator: `I\'m Fz`, result: link})
})
})

router.get('/api/info/translate', async (req, res, next) => {
text = req.query.texto
ling = req.query.ling
apikey = req.query.apikey;
if (apikey === undefined) return res.status(404).send({status: 404, message: `insira o parâmetro apikey`});
	if (!text ) return res.json({ status : false, message : "digite o parâmetro de texto."})  
	if (!ling ) return res.json({ status : false, message : "parâmetro de entrada: ling. Você pode ver a lista de idiomas em https://cloud.google.com/translate/docs/languages"})  
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡La apikey es inválida o ha alcanzado su límite!"})
RG_US(apikey, req);
defaultLang = 'en'
tld = 'pt'
let result
try {
result = await translate(`${text}`, {
tld,
to: ling,
})
} catch (e) {
result = await translate(`${text}`, {
tld,
to: defaultLang,
})
} finally {
res.json({
status: true,
result: result[0]
})}})

app.get('/api/mediafire', async (req, res, next) => {
apikey = req.query.apikey
url = req.query.url
if(!apikey)return res.json({status:false,message:'Apikey faltante.'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡Apikey inválida o ha alcanzado su límite!"})
if (!url) return res.json({ status : false,  message : "Ingresa el parámetro: url"})
RG_US(apikey, req);
mediafireDl(url)
.then(data => {
var resultado = data;
res.json({
resultado
})
}).catch(e => {
res.json({erro:'Ocurrió un error.'})
})
})

app.get('/api/facebook', async(req, res, next) => {

apikey = req.query.apikey;

url = req.query.url

 if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))

if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "¡Apikey invalida o ha alcanzado su límite!"})

 if (!url) return res.json({ status : false,  message: "Parámetro faltante: url"})

 RG_US(apikey, req);

fbdown(url).then(data => {

res.json({

status: true,

Creator: "I'm Fz",

resultado: data

})}).catch(e => {

res.json({

message: `Ocurrió un error.`

})})})

app.get('/api/gpt', async(req, res, next) => {
apikey = req.query.apikey
query = req.query.query
const syms = `Tu respuestas serán claras y concisas, que sean entendibles y siempre responde inteligentemente.`
if(!apikey)return res.json({status:false,message:'Parámetro faltante: apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida o ha alcanzado su límite."})
if (!query) return res.json({ status : false,  message : "Parámetro faltante: query"}) 
RG_US(apikey, req);
  if(key.map(i => i.apikey)?.includes(apikey)){
    fetch(encodeURI(`https://api.cafirexos.com/api/chatgpt?text=${query}&name=Fz&prompt=syms`))
    .then(response => response.json())
        .then(hasil => {
        var resultado = hasil.resultado;
             res.json({
                 status: true,
                 Creator: "I'm Fz",
                 resultado
             })
         })
         .catch(e => {
         	res.json({erro:'Erro no Servidor Interno'})
})
} else {
  res.json({erro:'Erro no Servidor Interno'})
}
})

app.get('/api/ytdl', async (req, res, next) => {
    const apikey = req.query.apikey;
    const q = req.query.q;

    // Verificar si la API key es válida
    const apiKeyData = key.find(i => i.apikey === apikey);
    if (!apiKeyData) {
        return res.sendFile(path.join(__dirname, "./public/", "apikey_invalida.html"));
    }

    // Verificar si la API key ha alcanzado su límite de solicitudes
    if (apiKeyData.request <= 0) {
        return res.json({ message: "¡La apikey es inválida o ha alcanzado su límite!" });
    }

    // Verificar si el parámetro 'url' ha sido proporcionado
    if (!q) {
        return res.json({ status: false, message: "Por favor, ingresa el parámetro: q" });
    }

    // Actualizar el número de solicitudes restantes
    RG_US(apikey, req);

    try {
        // Llamar a la función DOWNLOAD_YT con la URL proporcionada
        var { DOWNLOAD_YT } = require('./yt2mate.js');
        const RESULTADO = await DOWNLOAD_YT(q);

        // Responder con el resultado de la descarga
        return res.json({
            status: true,
            Creator: "I'm Fz",
            resultado: RESULTADO
        });
    } catch (error) {
        console.log(error);
        return res.json({ message: `Ocurrió un error: ${error.message}` });
    }
});

app.listen(PORT, () => {
console.log('La API se abrió en el puerto: ' + PORT)
})


module.exports = router;