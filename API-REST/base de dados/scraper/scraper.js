const axios = require('axios')
const cheerio = require('cheerio')
const qs = require("qs")
const fs = require('fs-extra')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const encodeUrl = require('encodeurl');
const linkfy = require('linkifyjs')
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
async function pinterest(querry){
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

async function wallpaper(title, page = '1') {
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

async function wikimedia(title) {
    return new Promise((resolve, reject) => {
        axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`)
        .then((res) => {
            let $ = cheerio.load(res.data)
            let hasil = []
            $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
                hasil.push({
                    title: $(b).find('img').attr('alt'),
                    source: $(b).attr('href'),
                    image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src')
                })
            })
            resolve(hasil)
        })
    })
}

async function styletext(teks) {
    return new Promise((resolve, reject) => {
        axios.get('http://qaz.wtf/u/convert.cgi?text='+teks)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('table > tbody > tr').each(function (a, b) {
                hasil.push({ name: $(b).find('td:nth-child(1) > span').text(), result: $(b).find('td:nth-child(2)').text().trim() })
            })
            resolve(hasil)
        })
    })
}

async function porno() {
    return new Promise((resolve, reject) => {
        axios.get('https://tikporntok.com/?random=1')
        .then((res) => {
            const $ = cheerio.load(res.data)
            const hasil = {}
            hasil.title = $('article > h1').text()
            hasil.source = $('article > div.video-wrapper.vxplayer').attr('data-post') || 'Web Not Response'
            hasil.thumb = $('article > div.video-wrapper.vxplayer > div.vx_el').attr('data-poster') || 'https://4.bp.blogspot.com/-hyMqjmQQq4o/W6al-Rk4IpI/AAAAAAAADJ4/m-lVBA_GC9Q5d4BIQg8ZO3fYmQQC3LqSACLcBGAs/s1600/404_not_found.png'
            hasil.desc = $('article > div.intro').text()
            hasil.upload = $('article > div.single-pre-meta.ws.clearfix > time').text()
            hasil.like = $('article > div.single-pre-meta.ws.clearfix > div > span:nth-child(1) > span').text()
            hasil.dislike = $('article > div.single-pre-meta.ws.clearfix > div > span:nth-child(2) > span').text()
            hasil.favorite = $('article > div.single-pre-meta.ws.clearfix > div > span:nth-child(3) > span').text()
            hasil.views = $('article > div.single-pre-meta.ws.clearfix > div > span:nth-child(4) > span').text()
            hasil.tags = $('article > div.post-tags').text()
            hasil.video = $('article > div.video-wrapper.vxplayer > div.vx_el').attr('src') || $('article > div.video-wrapper.vxplayer > div.vx_el').attr('data-src') || 'https://4.bp.blogspot.com/-hyMqjmQQq4o/W6al-Rk4IpI/AAAAAAAADJ4/m-lVBA_GC9Q5d4BIQg8ZO3fYmQQC3LqSACLcBGAs/s1600/404_not_found.png'
            resolve(hasil)
        })
    })
}

async function hentai() {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 1153)
        axios.get('https://sfmcompile.club/page/'+page)
        .then((data) => {
            const $ = cheerio.load(data.data)
            const hasil = []
            $('#primary > div > div > ul > li > article').each(function (a, b) {
                hasil.push({
                    title: $(b).find('header > h2').text(),
                    link: $(b).find('header > h2 > a').attr('href'),
                    category: $(b).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
                    share_count: $(b).find('header > div.entry-after-title > p > span.entry-shares').text(),
                    views_count: $(b).find('header > div.entry-after-title > p > span.entry-views').text(),
                    type: $(b).find('source').attr('type') || 'image/jpeg',
                    video_1: $(b).find('source').attr('src') || $(b).find('img').attr('data-src'),
                    video_2: $(b).find('video > a').attr('href') || ''
                })
            })
            resolve(hasil)
        })
    })
}

async function twitter(link){
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
				desc: $('div:nth-child(1) > div:nth-child(2) > p').text().trim(),
				thumb: $('div:nth-child(1) > img').attr('src'),
				HD: $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href'),
				SD: $('tr:nth-child(2) > td:nth-child(4) > a').attr('href'),
				audio: 'https://twdown.net/' + $('tr:nth-child(4) > td:nth-child(4) > a').attr('href')
			})
		})
	.catch(reject)
	})
}

async function quotesAnime() {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 184)
        axios.get('https://otakotaku.com/quote/feed/'+page)
        .then(({ data }) => {
            const $ = cheerio.load(data)
            const hasil = []
            $('div.kotodama-list').each(function(l, h) {
                hasil.push({
                    link: $(h).find('a').attr('href'),
                    gambar: $(h).find('img').attr('data-src'),
                    karakter: $(h).find('div.char-name').text().trim(),
                    anime: $(h).find('div.anime-title').text().trim(),
                    episode: $(h).find('div.meta').text(),
                    up_at: $(h).find('small.meta').text(),
                    quotes: $(h).find('div.quote').text().trim()
                })
            })
            resolve(hasil)
        }).catch(reject)
    })
}

async function wall(query) {
	return new Promise((resolve, reject) => {
		axios.get('https://www.wallpaperflare.com/search?wallpaper='+ query,{
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				"cookie": "_ga=GA1.2.863074474.1624987429; _gid=GA1.2.857771494.1624987429; __gads=ID=84d12a6ae82d0a63-2242b0820eca0058:T=1624987427:RT=1624987427:S=ALNI_MaJYaH0-_xRbokdDkQ0B49vSYgYcQ"
			}
		})
		.then(({ data }) => {
			const $ = cheerio.load(data)
			const result = [];
			$('#gallery > li > figure > a').each(function(a, b) {
			const images = $(b).find('img').attr('data-src')
				result.push({images})
			})
			resolve(result)
		})
	.catch({status: 'err'})
	})
}

async function hentaihome(nome) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.hentaihome.net/?s=${nome}`).then( ({data}) => {
      const $ = cheerio.load(data)
      var postagem = [];
      $('.video-conteudo').each((i, e) => {
       if($(e)?.text()?.trim() != '') {
        postagem.push({
          nome: $(e).text().trim(),
          link: $(e)?.find('a')?.attr('href')?.trim(),
          imagem: $(e)?.find('img')?.attr('src')?.trim()
        })
        }
      });
      resolve({status: 200, autor: '+55 94 9147-2796', resultado: postagem})
    })
    .catch(e => {
      reject({status: 500, msg: `Erro no módulo`})
    });
  });
}

async function lojadomecanico(nome) {
  return new Promise((resolve, reject) => {
    axios.get(`https://busca.lojadomecanico.com.br/busca?q=${nome}`).then( ({data}) => {
      const dados = [];
      const $ = cheerio.load(data);
      $(`li[class="nm-product-item col-xs-6 col-sm-3 product-box"]`).each((i, e) => {
        dados.push({
          nome: $(e).attr('data-name'),
          preco: "R$ " + $(e).attr('data-price'),
          marca: $(e).attr('data-brand'),
          categoria: $(e).attr('data-category'),
          imagem: "https:" + $(e).find('div > div > a > img').attr('src'),
          link: "https:" + $(e).find('div > div > a').attr('href'),
        });
      });
      resolve({status: 200, autor: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => {
      reject({status: 500, msg: `Erro no módulo`})
    });
  });
}

async function animesFireSearch(nome) {
  return new Promise( (resolve, reject) => {
    axios.get(`https://animefire.net/pesquisar/${encodeURI(nome.toLowerCase().replaceAll(' ', '-'))}`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36",
        "cookie": "a=JvTevu353yc2390gXtq7FVvF7TfRZfos; sid=3bFGrp0wysJs82nHdQTevzpY8Xl-bSKaFx9B-Ez1AlV%2CXuoQsG9hEJ4N8-oSzG7n;"
    }
  }).then( ({data}) => {
      const dados = []
      const $ = cheerio.load(data)
      $('article[class="card cardUltimosEps"]').each( (i, e) => {
        dados.push({
          titulo: $(e).find('h3').text(),
          imagem: $(e).find('img').attr('data-src'),
          link: $(e).find('a').attr('href')
        });
      });
      resolve({status: 200, autor: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => {
      console.log(e)
    });
  });
}

async function animesFireEps(link) {
  return new Promise( (resolve, reject) => {
  if(!link.includes('animefire.net')) throw new Error('Esse não é um link válido')
    axios.get(link, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36",
        "cookie": "a=JvTevu353yc2390gXtq7FVvF7TfRZfos; sid=3bFGrp0wysJs82nHdQTevzpY8Xl-bSKaFx9B-Ez1AlV%2CXuoQsG9hEJ4N8-oSzG7n;"
    }
  }).then( ({data}) => {
      const eps = []
      const generos = []
      const $ = cheerio.load(data)
      const imagem = $('.sub_animepage_img').find('img').attr('data-src')
      const titulo = $('h6[class="text-gray mb-0"]').text()
      const desc = $('div[class="divSinopse mb-3 mt-3 ml-2 ml-sm-1 ml-md-2 mr-2"]').text()?.trim()
      $('a[class="mr-1 spanAnimeInfo spanGeneros spanGenerosLink"]').each( (i, e) => {
        generos.push($(e).text())
      })
      $('a[class="lEp epT divNumEp smallbox px-2 mx-1 text-left d-flex"]').each( (i, e) => {
        eps.push({
        titulo: $(e).text(),
        link: $(e).attr('href')
        })
      })
      json = {
      status: 200,
      autor: '+55 94 9147-2796',
      imagem: imagem,
      titulo: titulo,
      sinopse: `${desc.startsWith('Sinopse: ') ? desc.slice(9)?.trim() : desc?.trim()}`,
      generos: generos,
      episodios: eps
      }
      resolve(json)
    })
    .catch(e => {
      console.log(e)
    });
  });
}

async function fetchJson(url, options) {
  return new Promise(async (resolve, reject) => {
    fetch(url, options)
    .then(response => response.json())
    .then(json => {
      resolve(json)
     })
    .catch((err) => {
     reject(err)
    })
})
}

async function animeFireDownload(link) {
 return new Promise((resolve, reject) => {
  if(!link.includes('animefire.net')) throw new Error('Esse não é um link válido')
   axios.get(`${link}`, {
    headers: {
     "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36",
     "cookie": "a=JvTevu353yc2390gXtq7FVvF7TfRZfos; sid=3bFGrp0wysJs82nHdQTevzpY8Xl-bSKaFx9B-Ez1AlV%2CXuoQsG9hEJ4N8-oSzG7n;"
    }
   }).then( async ({data}) => {
    const $ = cheerio.load(data)
    const nome = $('h1[class="sectionVideoEpTitle text-white"]').text()
    const desc = $('#video_sinopse').text()?.trim()
    const linkVdo = $('#my-video')?.attr('data-video-src') || {data: [{label: '', src: $('iframe[style="position: absolute;width: 100%; height: 100%;top: 0;right: 0;left: 0;"]').attr('src')}]}
    const link_videoJson = $('#my-video')?.attr('data-video-src') ? await fetchJson(linkVdo) : linkVdo
    const link_video = link_videoJson.data
    const thumb = $('meta[itemprop="thumbnailUrl"]').attr('content')
    json = {
      status: 200,
      autor: '+55 94 9147-2796',
      nome: nome,
      sinopse: `${desc.startsWith('Sinopse:') ? desc.slice(9)?.trim() : desc?.trim()}`,
      thumb: thumb,
      link_video: link_video
   }
   resolve(json)
  })
  .catch(e => {
  console.log(e)
  })
 })
}

async function mediafireDl(link) {
  return new Promise((resolve, reject) => {
    if(!link.includes('mediafire')) throw new Error('Apenas links do mediafire são suportados')
    axios.get(`${link.split('?dkey')[0]}`).then(({data}) => {
      const $ = cheerio.load(data)
      nome = decodeURI($('a#downloadButton').attr('href').split('/')[5]).replaceAll("+", " ").replaceAll("%2B", "+").replaceAll("%26", "&").trim(),
      link = $('a#downloadButton').attr('href').trim(),
      tipo = nome.split('.').pop().trim()
      peso = $('a#downloadButton').text().replaceAll('Download', '').replaceAll('(', '').replaceAll(')', '').replaceAll('\n', '').replaceAll('\n', '').trim(),
      json = {nome, link, tipo, peso}
      resolve(json)
    }).catch(e => {
      reject(e)
    });
  });
}

async function hentaitube(nome) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.hentaistube.com/buscar/?s=${nome}`).then( ({data}) => {
      const $ = cheerio.load(data)
      var dados = []
      $('.epiItem').each((i, e) => {
        dados.push({
        nome: $(e).find('a').attr('title').trim(),
        imagem: $(e).find('img').attr('src').trim(),
        link: $(e).find('a').attr('href').trim()
        })
      });
      resolve({status: 200, autor: '+55 94 9147-2796', resultado: dados})

    })
    .catch(e => {
      console.log(e)
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
      
      resolve({status: 200, criador: '+55 94 9147-2796', resultado: dados2})
    })
    .catch(e => {
      reject(e)
    })
  })
}

async function topFlix(query) {
  return new Promise((resolve, reject) => {
    axios.get(`https://topflix.one/list/filmes/${query}/`)
    .then( ({data}) => {
      const $ = cheerio.load(data)
      const dados = []
      $('div[class="movie-item-style-1"]').each( function (i, e) {
        dados.push({
          nome: $(e).find('h6 > a').text(),
          imagem: $(e).find('img').attr('data-src'),
          link: 'https://topflix.one'+$(e).find('h6 > a').attr('href')
        })
      })
      resolve({status: 200, criador: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function topFlixDL(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
    .then( ({data}) => {
      const $ = cheerio.load(data)
      fs.writeFileSync('topflixdl.html', $.html())
      return
      const dados = []
      $('div[class="movie-item-style-1"]').each( function (i, e) {
        dados.push({
          nome: $(e).find('h6 > a').text(),
          imagem: $(e).find('img').attr('data-src'),
          link: 'https://topflix.one'+$(e).find('h6 > a').attr('href')
        })
      })
      resolve({status: 200, criador: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function pinterestVideo(link) {
  return new Promise(async(resolve, reject) => {
    axios.get(link)
    .then(async res => {
      const $ = cheerio.load(res.data)
      const json = JSON.parse($('script[data-test-id="video-snippet"]').text())
      resolve({
        status: 200,
        autor: '+55 94 9147-2796',
        titulo: json.name,
        thumb: json.thumbnailUrl,
        video: json.contentUrl
      })
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function pinterestVideoV2(url) {
  return new Promise(async(resolve, reject) => {
    let payload = {
      url: url
    }
    axios.post('https://pinterestvideodownloader.com/', qs.stringify(payload), {
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Mobile Safari/537.36'
      },
    })
    .then(async ({data}) => {
      const $ = cheerio.load(req.data)
      resolve({
        status: 200,
        autor: '+55 94 9147-2796',
        video:  $('a[style="background-color: green;"]').attr('href'),
        thumb: $('a[style="background-color: blue;"]').attr('href')
      })
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function ultimasNoticias() {
 return new Promise((resolve, reject) => {
   axios.get(`https://news.google.com/topstories?hl=pt-BR&gl=BR&ceid=BR:pt-419`).then(async ({data}) => {
    const $ = cheerio.load(data)
    const dados = []
    const dados2 = []
    $('h4[class="ipQwMb ekueJc RD0gLb"]').each((i, e) => {
     dados.push({
       titulo: $(e).find('a').text(),
        link: 'https://news.google.com' + $(e).find('a').attr('href').slice(1)
     })
   })
   for(i=0; i < dados.length; i++) {
     const aXio = await axios.get(dados[i].link)
     const $$ = cheerio.load(aXio.data)
     dados2.push({
       titulo: dados[i].titulo,
       link: $$('div[class="m2L3rb eLNT1d"]').find('a').attr('href')
     })
   }
   resolve({status: 200, autor: '+55 94 9147-2796', resultado: dados2})
  })
   .catch(e => {
     reject(e)
   })
 })
}

async function uptodownsrc(query) {
  return new Promise(async(resolve, reject) => {
    axios.get(`https://br.uptodown.com/android/search/${query}`)
    .then(async ({data}) => {
      const $ = cheerio.load(data);
      const dados = [];
      $('div[class="item"]').each(function(i, e) {
        dados.push({
          nome: $(e).find('a').text(),
          desc: $(e).find('.description').text(),
          imagem: $(e).find('img').attr('src'),
          link: $(e).find('a').attr('href').split("uptodown.com/")[0]+"uptodown.com/"
        });
      });
      resolve({status: 200, autor: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function uptodowndl(url) {
  return new Promise(async(resolve, reject) => {
    axios.get(url+'android/download')
    .then(async(res) => {
      const $ = cheerio.load(data)
      resolve({
        status: res.status,
        autor: '+55 94 9147-2796',
        nome: $('#detail-app-name').text().trim(),
        versao: $('div[class="version"]').text(),
        peso: $('p[class="size"]').text(),
        link: $('#detail-download-button').attr('data-url')
      })
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function teste(url) {
  return new Promise((resolve, reject) => {
    headers = {
  "Host": "y2mate.is",
  "Connection": "keep-alive",
  "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Yandex\";v=\"22\"",
  "Accept": "application/json, text/javascript, *//*; q=0.01",
  "User-Agent": "Mozilla/5.0 (Linux; arm_64; Android 11; M2004J19C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.124 YaBrowser/22.9.5.73.00 SA/3 Mobile Safari/537.36",
  "Origin": "https://en.y2mate.is",
  "Referer": "https://en.y2mate.is/",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
}
    axios.get(`https://y2mate.is/analyze?url=${url}`, {headers: headers})
    .then( (res) => {
      const video = []
      const audio = []
      for(a of res.data.video) {
        video.push({
        quality: a.quality,
        
        })
      }
    })
    .catch(e => {
      reject(e)
    });
  });
}
/*
https://y2mate.is/analyze?url=https%3A%2F%2Fyoutu.be%2FPeXduJQH7-Q

GET /analyze?url=https%3A%2F%2Fyoutu.be%2FPeXduJQH7-Q

Host: "y2mate.is",
Connection: "keep-alive",
sec-ch-ua: '"Chromium";v="104", " Not A;Brand";v="99", "Yandex";v="22"',
Accept: "application/json, text/javascript, *//*; q=0.01",
User-Agent: "Mozilla/5.0 (Linux; arm_64; Android 11; M2004J19C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.124 YaBrowser/22.9.5.73.00 SA/3 Mobile Safari/537.36",
Origin: "https://en.y2mate.is",
Referer: "https://en.y2mate.is/",
Accept-Language: "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"


*/

// https://youtu.be/PeXduJQH7-Q

// teste("https://youtu.be/bACrr5QMTW0").then(res => {console.log(res, JSON.stringify(res, null, 2))}).catch(console.log)

async function xvideosSearch(q) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.xvideos.com/?k=${encodeUrl(q.replaceAll(' ', '+'))}`, {
    headers: {
       "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="thumb-block  "]').each(function(i, e) {
        dados.push({
          titulo: $(e).find('.thumb-under > p > a').attr('title'),
          duracao: $(e).find('.thumb-under > p > a > span').text(),
          imagem: $(e).find('img').attr('data-src'),
          link: 'https://www.xvideos.com' + $(e).find('.thumb-under > p > a').attr('href')
        });
      });
      resolve({status: res.status, criador: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

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
      resolve({status: res.status, criador: '🔥 +55 94 9147-2796 🔥', resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function xvideosDownloader(url) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
    headers: {
       "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      const dados1 = $('script[type="application/ld+json"]').text()
      resolve({status: res.status, criador: '+55 94 9147-2796', resultado: {titulo: dados1.name, desc: dados1.description, thumb: dados1.thumbnailUrl, link: dados1.contentUrl}})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function hentaiimg(title) {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random * 10)
        axios.get(`https://rule34.world/${title}/page/${page}`)
        .then((res) => {
            const $ = cheerio.load(res.data)
            const hasil = []
            $('app-post-grid > app-grid > app-loading-block > div > div.box-grid.ng-star-inserted > app-post-preview').each(function (a, b) {
                hasil.push('https://rule34.world'+$(b).find('img').attr('src'))
            })
            resolve({ status: res.status, creator: 'Dika Ardnt.', hasil: hasil })
        })
    })
}

async function hentaivid() {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 1153)
        axios.get('https://sfmcompile.club/page/'+page)
        .then((data) => {
            const $ = cheerio.load(data.data)
            const hasil = []
            $('#primary > div > div > ul > li > article').each(function (a, b) {
                hasil.push({
                    title: $(b).find('header > h2').text(),
                    link: $(b).find('header > h2 > a').attr('href'),
                    category: $(b).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
                    share_count: $(b).find('header > div.entry-after-title > p > span.entry-shares').text(),
                    views_count: $(b).find('header > div.entry-after-title > p > span.entry-views').text(),
                    type: $(b).find('source').attr('type') || 'image/jpeg',
                    video_1: $(b).find('source').attr('src') || $(b).find('img').attr('data-src'),
                    video_2: $(b).find('video > a').attr('href') || ''
                })
            })
            const random = hasil[Math.floor(Math.random() * hasil.length)]
            resolve({
                status: data.status,
                creator: 'Dika Ardnt.',
                hasil: random
            })
        })
    })
}

async function fraseAmor() {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.pensador.com/frases_de_amor/${Math.floor(Math.random() * 10)}/`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('p[class="frase fr"]').each(function() {
        dados.push($(this).text())
      });
      resolve(dados)
    })
    .catch(e => reject(e))
  })
}
// frases_psicologia
async function frasesPensador(url = `https://www.pensador.com/frases_de_otimismo/${Math.floor(Math.random() * 100)}/`) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('p[class="frase fr"]').each(function() {
        dados.push($(this).text())
      });
      resolve(dados)
    })
    .catch(e => reject(e))
  })
}

async function animesBrSearch(q) {
  return new Promise((resolve, reject) => {
    axios.get(`https://animesbr.biz/search/${q.replaceAll(' ', '+')}`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('#archive-content').each((i, e) => {
        dados.push({
          titulo: $(e).find('img').attr('alt'),
          imagem: $(e).find('img').attr('src'),
          link: $(e).find('a').attr('href'),
          estrelas: $(e).find('.rating').text().trim()
        });
      });
      resolve({status: res.status, criador: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => reject(e))
  });
}
/*
async function animesBrSearchEps(url) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      const dados = [];
      fs.writeFileSync('a.html', $.html())
      $('#archive-content').each((i, e) => {
        dados.push({
          titulo: $(e).find('img').attr('alt'),
          imagem: $(e).find('img').attr('src'),
          link: $(e).find('a').attr('href'),
          estrelas: $(e).find('.rating').text().trim()
        });
      });
      const json = {
        titulo: 
        sinopse: $('meta[property="og:description"]').attr('content')
      }
      resolve({status: res.status, criador: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => reject(e))
  });
}

*/
async function ultimasNoticias() {
  return new Promise(async(resolve, reject) => {
    const dados1 = [];
    const dados2 = [];
    const dados3 = [];
    const dados4 = [];
    const dados5 = [];
    const shuffleArray = function (arr) {
        // Loop em todos os elementos
    for (let i = arr.length - 1; i > 0; i--) {
            // Escolhendo elemento aleatório
        const j = Math.floor(Math.random() * (i + 1));
        // Reposicionando elemento
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Retornando array com aleatoriedade
    return arr;
}
    const nt1 = await axios.get('https://g1.globo.com', {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    }).catch();
    if(nt1){
    var $ = cheerio.load(nt1.data);
    $('.bastian-feed-item').each(function(){
    json = {
        titulo: $(this).find('._evt > a').text(),
        imagem: $(this).find('img').attr('src'),
        link: $(this).find('._evt > a').attr('href')
      }
    if(json.titulo && json.imagem && json.link) dados1.push(json)
    })
    }
    const nt2 = await axios.get('https://www.cnnbrasil.com.br/', {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    }).catch();
    if(nt2) {
    var $ = cheerio.load(nt2.data)
    $('li[class=" home__list__item home__list__item--first"]').each((i,e)=>{
      json = {
        titulo: $(e).find('.home__title').text(),
        imagem: $(e).find('img').attr('src'),
        link: $(e).find('a').attr('href')
      }
      if(json.titulo && json.imagem && json.link) dados2.push(json)
    })
    }
    const nt3 = await axios.get('https://www.estadao.com.br/', {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    }).catch();
    if(nt3) {
    var $ = cheerio.load(nt3.data)
    $('div[class="col-xl-4 col-md-4 col-12"]').each((i,e)=>{
      json = {
        titulo: $(e).find('.image > a').attr('title'),
        imagem: 'https://www.estadao.com.br'+$(e).find('img').attr('src'),
        link: $(e).find('.image > a').attr('href')
      }
      if(json.titulo && json.imagem && json.link) dados3.push(json)
    })
    }
    const nt4 = await axios.get('https://noticias.uol.com.br/', {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    }).catch();
    if(nt4) {
    var $ = cheerio.load(nt4.data)
    $('.thumbnails-wrapper').each((i,e)=>{
      json = {
        titulo: $(e).find('h3').text(),
        imagem: $(e).find('img').attr('data-src') || $(e).find('img').attr('src'),
        link: $(e).find('a').attr('href')
      }
      if(json.titulo && json.imagem && json.link) dados4.push(json)
    })
    }
    const nt5 = await axios.get('https://www.metropoles.com/', {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    }).catch();
    if(nt5) {
    var $ = cheerio.load(nt5.data)
    $('article[class="m-feed m-feed-small "]').each((i,e)=>{
      json = {
        titulo: $(e).find('a').attr('data-title'),
        imagem: $(e).find('img').attr('data-src') || $(e).find('img').attr('src'),
        link: $(e).find('a').attr('href')
      }
      if(json.titulo && json.imagem && json.link) dados5.push(json)
    })
    }
    resolve(shuffleArray([...dados1, ...dados2, ...dados3, ...dados4, ...dados5]))
  });
}

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
      resolve({status: res.status, autor: '+55 94 9147-2796', imagens: dados, videos: dados2})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function memesDroid() {
  return new Promise((resolve, reject) => {
    axios.get('https://pt.memedroid.com/memes/latest?ts='+randomIntFromInterval(1567359809, 1667395806), {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('.gallery-item').each((i, e) => {
        var json = {
          titulo: $(e).find('a[class="item-header-title dyn-link"]').text()?.trim() || '',
          imagem: $(e).find('img:first').attr('src'),
          link: 'https://pt.memedroid.com' + $(e).find('a[class="item-header-title dyn-link"]').attr('href')
        }
        json.imagem && json.imagem.includes("memedroid") && dados.push(json);
      });
      resolve({status: res.status, resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function animesGoyabu(q) {
  return new Promise((resolve, reject) => {
    axios.get("https://goyabu.com/?s="+q.replace(/ /g, '+'), {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('.anime-episode').each((i, e) => {
        dados.push({
          titulo: $(e).find('h3').text(),
          imagem: $(e).find('img').attr('data-cfsrc'),
          link: $(e).find('a').attr('href')
        });
      });
      resolve({status: res.status, criador: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => reject(e))
  });
}

async function animesGoyabu2(url) {
  return new Promise((resolve,reject) => {
    axios.get(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div[class="row rowls"] > a').each((i,e) => {
        dados.push({
          episodio: $(e).find('div').eq(1).text().split($(e).find('.genre-tag').text())[0].trim(),
          link: $(e).attr('href')
        });
      });
      resolve({
        status: res.status,
        criador: '+55 94 9147-2796',
        titulo: $('.anime-title > h1').text(),
        imagem: $('.anime-bg2').find('img').attr('data-cfsrc'),
        sinopse: $('.anime-description').text().trim(),
        episodios: dados
      })
    })
    .catch(e => {
      reject(e)
    })
  })
}

async function lulaFlix() {
  return new Promise((resolve, reject) => {
    axios.get(`https://lulaflix.com.br/`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      const dados = [];
      const dados2 = [];
      $('div[class="post-inner post-hover"]').each((i, e) => {
        dados.push({
          titulo: $(e).find('.post-title > a:first').text(),
          foto: $(e).find('img').attr('src'),
          desc: $(e).find('div[class="entry excerpt"]').text().trim(),
          postado: $(e).find('ul[class="post-meta group"] > li').eq(1).text(),
          link: $(e).find('.post-title > a:first').attr('href')
        })
      })
      $('.featured-item').each((i,e) => {
        dados2.push({
          titulo: $(e).find('h3.featured-title').text(),
          foto: $(e).attr('style').replace('background-image:url(\'', '').replace('\');', ''),
          postado: $(e).find('.featured-date').text(),
          link: $(e).find('a').attr('href')
        })
      })
      resolve({status: res.status, resultado: dados, outro: dados2})
    })
    .catch(e => reject(e))
  })
}

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
      resolve({status: res.status, autor: '+55 94 9147-2706', resultado: dados2})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function partidoLiberal() {
  return new Promise((resolve, reject) => {
    axios.get("https://partidoliberal.org.br/", {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(async (res) => {
      const dados = [];
      const $ = cheerio.load(res.data)
      $('.noticia').each((i, e) => {
        dados.push({
          titulo: $(e).find('h3').text(),
          imagem: $(e).find('img').attr('data-src'),
          link: $(e).find('a:first').attr('href')
        });
      });
      resolve({status: res.status, autor: '+55 94 9147-2706', resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function partidoDosTrouxas() {
  return new Promise((resolve, reject) => {
    axios.get("https://pt.org.br/", {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then(async (res) => {
      const dados = [];
      const $ = cheerio.load(res.data)
      $('.noticia').each((i, e) => {
        dados.push({
          titulo: $(e).find('h3').text(),
          imagem: $(e).find('img').attr('data-src'),
          link: $(e).find('a:first').attr('href')
        });
      });
      resolve({status: res.status, resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

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
      resolve({status: res.status, autor: '+55 94 9147-2796', resultado: dados})
    })
    .catch(e => {
      reject(e)
    });
  });
}

async function letrasMusica() {
  return new Promise((resolve, reject) => {
    axios.get(`https://m.letras.mus.br/dj-cia/1210228/`, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data)
      const dados = []
      $('div[class="lyric-cnt g-1"] > *').each((i, e) => {
        dados.push($(e).text().trim())
      })
      resolve({status: res.status, letra: dados})
    })
    .catch(e => {
      reject(e)
    })
  })
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
        nome: $(e).find('.DdYX5:first').text(),
        imagem: ($(e).find('img:first').attr('srcset') ? (linkfy.find($(e).find('img:first').attr('srcset'))?.pop()?.href || $(e).find('img:first').attr('src')) : $(e).find('img:first').attr('srcset')) || $(e).find('img:last').attr('srcset') ? (linkfy.find($(e).find('img:last').attr('srcset'))?.pop()?.href || $(e).find('img:last').attr('src')) : $(e).find('img:last').attr('srcset'),
        desenvolvedor: $(e).find('.wMUdtb:first').text(),
        estrelas: $(e).find('.w2kbF:first').text(),
        link: 'https://play.google.com' + $(e).find('a:first').attr('href')
      })
    })
    resolve({status: res.status, autor: '+55 94 9147-2796', resultado: dados})
  })
  .catch(e => reject(e))
})

const sambaPornoSearch = (q) => new Promise((resolve, reject) => {
  axios.get(`https://www.sambaporno.com/search/${encodeUrl(q)}`, {
    headers: {
      "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
    }
  })
  .then((res) => {
    const $ = cheerio.load(res.data);
    const dados = [];
    $('div[class="card-container sub "]').each((i, e) => {
      dados.push({
        nome: $(e).find('.title:first').text().trim(),
        imagem: $(e).find('img:first').attr('src').trim(),
        gostei: $(e).find('span[class="badge rating-procent text-success"]').text().trim(),
        duracao: $(e).find('span[class="duration badge bg-dark"]').text(),
        link: 'https://www.sambaporno.com' + $(e).find('a:first').attr('href')
      })
    })
    resolve({status: res.status, autor: '+55 94 9147-2796', resultado: dados})
  })
  .catch(e => {
    reject(e)
  })
})

module.exports = {
sambaPornoSearch,
playStoreSearch,
memesDroid,
amazonSearch,
mercadoLivreSearch,
gruposZap,
lulaFlix,
pinterestVideoV2,
pinterestVideo,
animeFireDownload,
animesFireSearch,
animesFireEps,
hentaihome,
hentaitube,
lojadomecanico,
ultimasNoticias,
randomGrupos,
topFlix,
uptodownsrc,
uptodowndl,
xvideosDownloader,
xvideosSearch,
fraseAmor,
iFunny,
frasesPensador,
pinterest,
wallpaper,
wall,
porno,
hentai,
styletext,
twitter
}