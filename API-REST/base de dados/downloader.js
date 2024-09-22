const axios = require('axios')
const cheerio = require('cheerio')
const { JSDOM } = require('jsdom')
const linkfy = require('linkifyjs')
const encodeUrl = require('encodeurl')
const fetch = require('node-fetch')
const qs = require("qs")
const yt = require("ytdl-core")
const yts = require("yt-search")

	function FacebookMp4(link){
	return new Promise((resolve,reject) => {
	let config = {
		'url': link
		}
	axios('https://www.getfvid.com/downloader',{
			method: 'POST',
			data: new URLSearchParams(Object.entries(config)),
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"user-agent":  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				"cookie": "_ga=GA1.2.1310699039.1624884412; _pbjs_userid_consent_data=3524755945110770; cto_bidid=rQH5Tl9NNm5IWFZsem00SVVuZGpEd21sWnp0WmhUeTZpRXdkWlRUOSUyQkYlMkJQQnJRSHVPZ3Fhb1R2UUFiTWJuVGlhVkN1TGM2anhDT1M1Qk0ydHlBb21LJTJGNkdCOWtZalRtZFlxJTJGa3FVTG1TaHlzdDRvJTNE; cto_bundle=g1Ka319NaThuSmh6UklyWm5vV2pkb3NYaUZMeWlHVUtDbVBmeldhNm5qVGVwWnJzSUElMkJXVDdORmU5VElvV2pXUTJhQ3owVWI5enE1WjJ4ZHR5NDZqd1hCZnVHVGZmOEd0eURzcSUyQkNDcHZsR0xJcTZaRFZEMDkzUk1xSmhYMlY0TTdUY0hpZm9NTk5GYXVxWjBJZTR0dE9rQmZ3JTNEJTNE; _gid=GA1.2.908874955.1625126838; __gads=ID=5be9d413ff899546-22e04a9e18ca0046:T=1625126836:RT=1625126836:S=ALNI_Ma0axY94aSdwMIg95hxZVZ-JGNT2w; cookieconsent_status=dismiss"
			}
		})
	.then(async({ data }) => {
		const $ = cheerio.load(data);	
		const resultado = [];
		resultado.push({
			videoOriginal: $('div.col-md-4.btns-download > p:nth-child(2) > a').attr('href'),
			video_HD: $('div.col-md-4.btns-download > p:nth-child(1) > a').attr('href'),
			audio: $('div.col-md-4.btns-download > p:nth-child(3) > a').attr('href')
			})
			resolve(resultado)
		})
	.catch(reject)
	})
}

//facebook("https://fb.watch/i8zYCf73gU/").then(console.log)

function pinterest(querry){
	return new Promise(async(resolve,reject) => {
		 axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
			headers: {
			"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
		}
			}).then(({ data }) => {
		const $ = cheerio.load(data)
		const result = [];
		const hasil = [];
   		 $('div > a').get().map(b => {
        const link = $(b).find('img').attr('src')
            result.push(link)
		});
   		result.forEach(v => {
		 if(v == undefined) return
		 hasil.push(v.replace(/236/g,'736'))
			})
			hasil.shift();
		resolve(hasil)
		})
	})
}

function wallpaper(title, page = '1') {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('div.grid-item').each(function (a, b) {
                hasil.push({
                    title: $(b).find('div.info > a > h3').text(),
                    type: $(b).find('div.info > a:nth-child(2)').text(),
                    source: 'https://www.besthdwallpaper.com/'+$(b).find('div > a:nth-child(3)').attr('href'),
                    image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]
                })
            })
            resolve(hasil)
        })
    })
}

async function mediafire(url) {
return new Promise((resolve, reject) => {
		axios.get(url)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const judul = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').text();
				const size = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(1) > span').text();
				const upload_date = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text();
				const link = $('#downloadButton').attr('href')
				const hsil = {
					arquivo: link.split('/')[5],
					DataDeUpload: upload_date,
					tipo: size,
					pesoArquivo: link.split('/')[5].split('.')[1],
					linkDownload: link
				}
				resolve(hsil)
			})
			.catch(reject)
	})
}

async function tiktok2(query) {
  let response = await axios("https://lovetik.com/api/ajax/search", {
    method: "POST",
    data: new URLSearchParams(Object.entries({ query })),
  });
  
  const clean = (data) => {
  let regex = /(<([^>]+)>)/gi;
  data = data.replace(/(<br?\s?\/>)/gi, " \n");
  return data.replace(regex, "");};

async function shortener(url) {
  return url;}
  result = {};
  result.legenda = clean(response.data.desc);
  result.author = clean(response.data.author);
  result.videoSemWt = await shortener(
    (response.data.links[0].a || "").replace("https", "http")
  );
  result.videoOriginal = await shortener(
    (response.data.links[1].a || "").replace("https", "http")
  );
  result.audio = await shortener(
    (response.data.links[2].a || "").replace("https", "http")
  );
  result.thumb = await shortener(response.data.cover);
  return result;
}

function twitter(link){
	return new Promise((resolve, reject) => {
		let config = {
			'URL': link
		}
		axios.post('https://twdown.net/download.php',qs.stringify(config),{
			headers: {
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				"cookie": "_ga=GA1.2.1388798541.1625064838; _gid=GA1.2.1351476739.1625064838; __gads=ID=7a60905ab10b2596-229566750eca0064:T=1625064837:RT=1625064837:S=ALNI_Mbg3GGC2b3oBVCUJt9UImup-j20Iw; _gat=1"
			}
		})
		.then(({ data }) => {
		const $ = cheerio.load(data)
		resolve({
				descrição: $('div:nth-child(1) > div:nth-child(2) > p').text().trim(),
				imagem: $('div:nth-child(1) > img').attr('src'),
				videoEmHD: $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href'),
				videoEmSD: $('tr:nth-child(2) > td:nth-child(4) > a').attr('href'),
				audio: 'https://twdown.net/' + $('tr:nth-child(4) > td:nth-child(4) > a').attr('href')
			})
		})
	.catch(reject)
	})
}

async function Mp3Link(url) {
  return new Promise((resolve, reject) => {
    try {
      const id = yt.getVideoID(url)
      const yutub = yt.getInfo(`https://www.youtube.com/watch?v=${id}`)
      .then((data) => {
        let pormat = data.formats
        let audio = []
        for (let i = 0; i < pormat.length; i++) {
          if (pormat[i].mimeType == 'audio/webm; codecs=\"opus\"') {
            let aud = pormat[i]
            audio.push(aud.url)
          } 
        }
        const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
        const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
        const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
        const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
        const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
        
        const result = {
          título: title,
          thumb: thumb,
          canal: channel,
          publicado: published,
          visualizações: views,
          link: audio[0]
        }
        return(result)
      })
      resolve(yutub)
    } catch (error) {
        reject(error);
      }
      console.log(error)
  })
}

async function Mp4Link(url) {
  return new Promise((resolve, reject) => {
    try {
      const id = yt.getVideoID(url)
      const yutub = yt.getInfo(`https://www.youtube.com/watch?v=${id}`)
      .then((data) => {
        let pormat = data.formats
        let video = []
        for (let i = 0; i < pormat.length; i++) {
          if (pormat[i].container == 'mp4' && pormat[i].hasVideo == true && pormat[i].hasAudio == true) {
            let vid = pormat[i]
            video.push(vid.url)
          }
        }
        const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
        const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
        const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
        const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
        const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
        
        const result = {
          título: title,
          thumb: thumb,
          canal: channel,
          publicado: published,
          visualizações: views,
          link: video[0]
        }
        return(result)
      })
      resolve(yutub)
    } catch (error) {
        reject(error);
      }
      console.log(error)
  })
}

async function ytPlayMp3(query) {
    return new Promise((resolve, reject) => {
        try {
            const search = yts(query)
            .then((data) => {
                const url = []
                const pormat = data.all
                for (let i = 0; i < pormat.length; i++) {
                    if (pormat[i].type == 'video') {
                        let dapet = pormat[i]
                        url.push(dapet.url)
                    }
                }
                const id = yt.getVideoID(url[0])
                const yutub = yt.getInfo(`https://www.youtube.com/watch?v=${id}`)
                .then((data) => {
                    let pormat = data.formats
                    let audio = []
                    let video = []
                    for (let i = 0; i < pormat.length; i++) {
                    if (pormat[i].mimeType == 'audio/webm; codecs=\"opus\"') {
                        let aud = pormat[i]
                        audio.push(aud.url)
                    }
                    }
                    const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
                    const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
                    const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
                    const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
                    const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
                    const result = {
                    título: title,
                    thumb: thumb,
                    canal: channel,
                    publicado: published,
                    visualizações: views,
                    link: audio[0]
                    }
                    return(result)
                })
                return(yutub)
            })
            resolve(search)
        } catch (error) {
            reject(error)
        }
        console.log(error)
    })
}

async function ytPlayMp4(query) {
    return new Promise((resolve, reject) => {
        try {
            const search = yts(query)
            .then((data) => {
                const url = []
                const pormat = data.all
                for (let i = 0; i < pormat.length; i++) {
                    if (pormat[i].type == 'video') {
                        let dapet = pormat[i]
                        url.push(dapet.url)
                    }
                }
                const id = yt.getVideoID(url[0])
                const yutub = yt.getInfo(`https://www.youtube.com/watch?v=${id}`)
                .then((data) => {
                    let pormat = data.formats
                    let video = []
                    for (let i = 0; i < pormat.length; i++) {
                    if (pormat[i].container == 'mp4' && pormat[i].hasVideo == true && pormat[i].hasAudio == true) {
                        let vid = pormat[i]
                        video.push(vid.url)
                    }
                   }
                    const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
                    const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
                    const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
                    const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
                    const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
                    const result = {
                    título: title,
                    thumb: thumb,
                    canal: channel,
                    publicado: published,
                    visualizações: views,
                    url: video[0]
                    }
                    return(result)
                })
                return(yutub)
            })
            resolve(search)
        } catch (error) {
            reject(error)
        }
        console.log(error)
    })
}


const letraMusica = async (query) => {
const res = await axios.get(`https://www.musixmatch.com/search/${query}`)
const sup = cheerio.load(res.data)
const hasil = []
const b = sup('#site').find('div > div > div > div > ul > li:nth-child(1) > div > div > div')
let link = `https://www.musixmatch.com` + sup(b).find('h2 > a').attr('href')
const des = await axios.get(link)
const soup = cheerio.load(des.data)
const LetradaMusica = soup('#site').find('.mxm-lyrics__content > .lyrics__content__ok').text()
hasil.push({LetradaMusica})
return hasil
}

const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

function post(url, formdata) {
console.log(Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&'))
return fetch(url, {
method: 'POST',
headers: {
accept: "*/*",
'accept-language': "en-US,en;q=0.9",
'content-type': "application/x-www-form-urlencoded; charset=UTF-8"},
body: Object.keys(formdata).map(key => `${key}=${encodeURIComponent(formdata[key])}`).join('&')})}

function DownMp4(url, quality) {
return new Promise((resolve, reject) => {

if (ytIdRegex.test(url)) {
let ytId = ytIdRegex.exec(url)
url = 'https://youtu.be/' + ytId[1]
post('https://www.y2mate.com/mates/en60/analyze/ajax', {
url,
q_auto: 0,
ajax: 1
})
.then(res => res.json())
.then(res => {
document = (new JSDOM(res.result)).window.document
yaha = document.querySelectorAll('td')
filesize = yaha[yaha.length - 23].innerHTML
id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
thumb = document.querySelector('img').src
title = document.querySelector('b').innerHTML

post('https://www.y2mate.com/mates/en60/convert', {
type: 'youtube',
_id: id[1],
v_id: ytId[1],
ajax: '1',
token: '',
ftype: 'mp4',
fquality: quality
})
.then(res => res.json())
.then(res => {
let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
hasil = []
video = /<a.+?href="(.+?)"/.exec(res.result)[1],
hasil.push({video, thumb, title, filesize})
resolve(hasil)
console.log(hasil)
}).catch(reject)
}).catch(reject)
} else reject('URL INVALID')
})
} 

const videoIfunny = async t=>new Promise(((e,r)=>{
    axios.get(t,{headers:{"user-agent":"Mozilla/5.0 (Android; Linux armv7l; rv:10.0.1) Gecko/20100101 Firefox/10.0.1 Fennec/10.0.1"}}).then((t=>{
      const $=cheerio.load(t.data);e({status:t.status,criador:"@Victor 😏",resultado:{
        thumb:$('meta[property="og:image"]').attr("content"),
        video:$('meta[property="og:video:url"]').attr("content"),
        autor:$('meta[name="author"]').attr("content"),
        width:$('meta[property="og:video:width"]').attr("content"),
        height:$('meta[property="og:video:height"]').attr("content"),
        legenda:$("h1.HGgf").text()?.trim()||"",
        mimetype:$('meta[property="og:video:type"]').attr("content")}})})).catch(r)}))
  
async function mercadoLivreSearch(q) {
  return new Promise((resolve, reject) => {
    axios.get(`https://lista.mercadolivre.com.br/${encodeUrl(q.replace(/[À-ü]/g, '').trim())}`, {
    headers: {
       "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="andes-card andes-card--flat andes-card--default andes-card--padding-default"]').each((i, e) => {
        json = {
          produto: $(e).find('h2:first').text(),
          id: $(e).find('input[name="itemId"]').attr('value'),
          imagem: $(e).find('img:first').attr('data-src') || $(e).find('img:first').attr('src'),
          preco: 'R$ '+ $(e).find('.price-tag-fraction:first').text(),
          link: $(e).find('a:first').attr('href')
        }
        if(json.preco && json.imagem && json.link) dados.push(json);
      });
      resolve({status: res.status, criador: '🔥 @Victor 🔥', resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

const playStoreSearch = (query) => new Promise((resolve, reject) => {

  axios.get(`https://play.google.com/store/search?q=${query}&c=apps`, {

    headers: {
      "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    }
  })
  .then((res) => {
    const $ = cheerio.load(res.data);
    const dados = [];
    $('.VfPpkd-aGsRMb').each((i, e) => {
      dados.push({
        aplicativo: $(e).find('.DdYX5:first').text(),
        thumbApp: ($(e).find('img:first').attr('srcset') ? (linkfy.find($(e).find('img:first').attr('srcset'))?.pop()?.href || $(e).find('img:first').attr('src')) : $(e).find('img:first').attr('srcset')) || $(e).find('img:last').attr('srcset') ? (linkfy.find($(e).find('img:last').attr('srcset'))?.pop()?.href || $(e).find('img:last').attr('src')) : $(e).find('img:last').attr('srcset'),
        desenvolvedor: $(e).find('.wMUdtb:first').text(),
        estrelas: $(e).find('.w2kbF:first').text(),
        linkApp: 'https://play.google.com' + $(e).find('a:first').attr('href')
      })
    })
    resolve({status: res.status, criador: '@vitinho.exe', resultado: dados})
  })
  .catch(e => reject(e))
})

async function amazonSearch(query) {

  return new Promise((resolve, reject) => {

    axios.get(`https://www.amazon.com.br/s?k=${encodeUrl(query)}&ref=nb_sb_noss`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then((res) => {
      const dados = [];
      const $ = cheerio.load(res.data)
      $('div[data-component-type="s-search-result"]').each((i, e) => {
        dados.push({
          titulo: $(e).find('span[class="a-size-small a-color-base a-text-normal"]').text(),
          preco: $(e).find('span[class="a-offscreen"]:first').text(),
          imagem: $(e).find('img.s-image').attr('srcset') ? (linkfy.find($(e).find('img.s-image').attr('srcset'))?.pop()?.href || $(e).find('img.s-image').attr('src')) : $(e).find('img.s-image').attr('src'),
          link: 'https://www.amazon.com.br' + $(e).find('a:first').attr('href')
        });
      });
      resolve({status: res.status, autor: '@Victor', resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function randomGrupos(categoria) {

  return new Promise( (resolve, reject) => {

    const categorias = [
    "amizade",
    "amor-e-romance",
    "desenhos-e-animes",
    "figurinhas-e-stickers",
    "memes-engracados",
    "filmes-e-series",
    "links",
    "namoro"
    ]
    if(!categoria) categoria = categorias[Math.floor(Math.random() * categorias.length)]
    axios.get(`https://gruposwhats.app/category/${categoria}`)
    .then( async ({data}) => {
      const $ = cheerio.load(data)
      let dados
      dados = []
      $('div[class="col-12 col-md-6 col-lg-4 mb-4 col-group"]').each(function (i, e) {
        dados.push({
          nome: $(e).find('h5').text(),
          desc: $(e).find('p').text().trim(),
          imagem: $(e).find('img').attr('data-src'),
          link: $(e).find('a').attr('href').replace('/group/', '/join-group/')
        })
      })
      dados2 = []
      dados = dados.filter(a => a.link.includes(`gruposwhats.app`) && !a.link.includes(`email`))
      for(var i=0; i < dados.length; i++) {
      try {
          teks = await axios.get(dados[i].link)
          const S = cheerio.load(teks.data)
          result = S('#main_block').find('a').attr('href')
          dados2.push({
          nome: dados[i].nome,
          desc: dados[i].desc,
          imagem: dados[i].imagem,
          link: result
          })
      } catch {}
      }
      
      resolve({status: 200, criador: '@Victor', resultado: dados2})
    })
    .catch(e => {
      reject(e)
    })
  })}

async function iFunny() {
  return new Promise((resolve, reject) => {
    axios.get('https://br.ifunny.co/page'+Math.floor(Math.random() * 99), {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      const dados = [];
      const dados2 = [];
      $('._0ZvA').each((i,e) => {
        var json = {
          titulo: $(e).find('a[class="WiQc mVpV HGgf"]').text() || $(e).find('img:first').attr('alt') || $(e).find('a:first').attr('aria-label') || 'Sem Titulo',
          imagem: $(e).find('img:first').attr('data-src'),
          link: $(e).find('a:first').attr('href')
        }
        var json2 = {
          titulo: $(e).find('a[class="WiQc mVpV HGgf"]').text() || $(e).find('img:first').attr('alt') || $(e).find('a:first').attr('aria-label') || 'Sem Titulo',
          thumb: $(e).find('video:first').attr('data-poster'),
          video: $(e).find('video:first').attr('data-src'),
          link: $(e).find('a:first').attr('href')
        }
        json.imagem && dados.push(json);
        json2.video && json2.video.toLowerCase().includes("mp4") && dados2.push(json2);
      });
      resolve({status: res.status, autor: '@Victor', imagens: dados, videos: dados2})
    })
    .catch(e => {
      reject(e)
    });
  }) }
  
  async function gruposZap(url = `https://www.gruposdewhatss.com.br/grupos-de-whatsapp-figurinhas/page/${Math.floor(Math.random() * 9)}`) {

  return new Promise((resolve, reject) => {

    axios.get(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(async (res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('.cardGroupInt').each((i,e) => {
        dados.push({
          titulo: $(e).find('.imgGroup').attr('title'),
          imagem: 'https://www.gruposdewhatss.com.br' + $(e).find('.imgGroup').attr('src'),
          link: 'https://www.gruposdewhatss.com.br' + $(e).find('a:first').attr('href')
        });
      });
      const dados2 = [];
      for (var i = 0; i < dados.length; i++) {
        try {
          ras = await axios.get(dados[i].link)
          const $$ = cheerio.load(ras.data)
          dados2.push({titulo: dados[i].titulo, imagem: dados[i].imagem, link: $$('a[class="btn btn-success w-100 mt-4 mb-4"]').attr('href')})
        } catch (e) { console.log(e) }
      }
      resolve({status: res.status, autor: '@Victor', resultado: dados2})
    })
    .catch(e => {
      reject(e)
    });
  });
}
module.exports = {
iFunny,
tiktok2,
DownMp4,
Mp4Link,
twitter,
FacebookMp4, 
ytPlayMp3,
pinterest,
wallpaper,
gruposZap,
videoIfunny,
letraMusica,
randomGrupos,
amazonSearch,
playStoreSearch,
mercadoLivreSearch,
  
}

//playStoreSearch("Tinder").then(console.log)
//mediafire("https://www.mediafire.com/file/228qao7tddrw6cy/AQUABOTV3.4%255Bcrip%255D.zip/file").then(console.log)

//videoIfunny().then(console.log)

// tiktok2("https://vm.tiktok.com/ZMYXNMSyc/").then(console.log)