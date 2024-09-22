const axios = require('axios')
const fetch = require('node-fetch') 
const cheerio = require('cheerio')

function LetradaMusica(musica){
	return new Promise(async(resolve, reject) => {
   		axios.get('https://www.musixmatch.com/search/' + musica)
   		.then(async({ data }) => {
   		const $ = cheerio.load(data)
   		const resultado = {};
   		let limk = 'https://www.musixmatch.com'
   		const link = limk + $('div.media-card-body > div > h2').find('a').attr('href')
	   		await axios.get(link)
	   		.then(({ data }) => {
		   		const $$ = cheerio.load(data)
		   		resultado.ImagemMusic = 'https:' + $$('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div').find('img').attr('src')
		  		$$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').each(function(a,b) {
		   resultado.LetraDaMusica = $$(b).find('span > p > span').text() +'\n' + $$(b).find('span > div > p > span').text()
		   })
	   })
	   resolve(resultado)
   })
   .catch(reject)
   })
}

module.exports = { LetradaMusica }