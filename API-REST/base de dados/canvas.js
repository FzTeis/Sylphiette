__path = process.cwd()

const fs = require('fs')
const canvafy = require("canvafy");
const path = require("path");
const { dirname } = require('path');
__dirname = dirname(__filename);

const Caxinha = require(__path+'/base de dados/modules/backend/canvas');
const Caxinha2 = require(__path+'/base de dados/modules/backend/canvas-2');
var key = JSON.parse(fs.readFileSync(__path+"/database/apikeys.json"));
const usus_r = JSON.parse(fs.readFileSync(__path+"/database/usuarios.json"));

async function RG_US(apikey, req) {
var i4 = key.map(i => i?.apikey)?.indexOf(apikey)
if(i4 >= 0) {
key[i4].request -= 1;
fs.writeFileSync(__path+"/database/apikeys.json", JSON.stringify(key, null, 2));
var IP = req.headers['x-real-ip'] || req.connection.remoteAddress || 0;
var i3 = usus_r.map(i => i.key).indexOf(apikey);
if(i3 < 0 && !usus_r.map(i => i.IP).includes(IP?.split(":")[3])){
usus_r.push({key: apikey, IP: [IP?.split(":")[3]]})
fs.writeFileSync(__path+"/database/usuarios.json", JSON.stringify(usus_r, null, 2));
} else if(i3 >= 0 && !usus_r[i3]?.IP.includes(IP?.split(":")[3])) {
usus_r[i3].IP.push(IP?.split(":")[3])
fs.writeFileSync(__path+"/database/usuarios.json", JSON.stringify(usus_r, null, 2));
}}}

async function comunismo(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.comunism(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function bolsonaro(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.bolsonaro(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function affect(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.affect(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function beautiful(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.beautiful(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function blurr(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.blur(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function bnw(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.bnw(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function circle(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.circle(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function del(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.del(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function dither(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.dither(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function facepalm(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.facepalm(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function gay(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.gay(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function invert(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.invert(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function jail(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.jail(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function magik(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.magik(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function pixelate(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.pixelate(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function rip(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.rip(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function sepia(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.sepia(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function rotate(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.rotate(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function trash(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.trash(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function wanted(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.wanted(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function wasted(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
  img = await Caxinha.canvas.wasted(`${image}`);
  await fs.writeFileSync(__path+'/assets/canvasimg.png', img)
  res.sendFile(__path+'/assets/canvasimg.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function bobross(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
imgr = await new Caxinha2.Bobross().getImage(`${image}`)
await fs.writeFileSync(__path +'/assets/bobross.png', imgr)
res.sendFile(__path +'/assets/bobross.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function mms(req, res) {
try {
const apikey = req.query.apikey;
const image = req.query.link;
if(!image) return res.json({message: "faltando o parâmetro image"})
if(!apikey)return res.json({status:false,message:'cade o parametro apikey'})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
RG_US(apikey, req)
imgr = await new Caxinha2.Mms().getImage(`${image}`)
await fs.writeFileSync(__path +'/assets/mms.png', imgr)
res.sendFile(__path +'/assets/mms.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

async function musicard(req, res) {
try {
 const apikey = req.query.apikey;
 const autor = req.query.autor; 
 const nomealbum = req.query.nomealbum; 
 const fundo = req.query.fundo;
 const fotomusic = req.query.fotomusic;
 const titulo = req.query.titulo;  
  if(!apikey) return res.json({message: "faltando o parâmetro apikey"})
  if(!autor) return res.json({message: "faltando o parâmetro autor"})
  if(!nomealbum) return res.json({message: "faltando o parâmetro nomealbum"})
  if(!titulo) return res.json({message: "faltando o parâmetro titulo"})
  if(!fundo) return res.json({message: "faltando o parâmetro fundo"})
  if(!fotomusic) return res.json({message: "faltando o parâmetro fotomusic"})
if(!key.map(i => i.apikey)?.includes(apikey))return res.sendFile(path.join(__dirname, "../public/", "apikey_invalida.html"))
if(key[key.map(i => i?.apikey)?.indexOf(apikey)]?.request <= 0) return res.json({message: "Apikey inválida ou requests esgotados!"})
var sabrinaBot = await new canvafy.Spotify()
    .setAuthor(autor)
    .setAlbum(nomealbum)
    .setBackground("image", fundo)
    .setImage(fotomusic)
    .setTimestamp(40000, 179000)
    .setTitle(titulo)
    .build();
  data = sabrinaBot.toBuffer();
  await fs.writeFileSync(__path+'/assets/music.png', data)
  res.sendFile(__path+'/tmp/music.png')
	} catch(err) {
		console.log(err)
		res.status(500).send({
			status: 500, info: 'Ops, aconteceu um erro no servidor interno.', resultado: 'error'
		})
	}
}

module.exports = { musicard, comunismo, bolsonaro, bnw, blurr, affect, beautiful, circle, del, gay, invert, facepalm, dither, jail, magik, pixelate, rip, sepia, rotate, trash, wanted, wasted, bobross, mms }