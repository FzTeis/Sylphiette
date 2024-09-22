const axios = require('axios')
const cheerio = require('cheerio')

const wikiSearch = async (query) => {
const res = await axios.get(`https://pt.m.wikipedia.org/w/index.php?search=${query}`)
const $ = cheerio.load(res.data)
const hasil = []
let pesquisaText = $('#mf-section-0').find('p').text()
let imagem = $('#mf-section-0').find('div > div > a > img').attr('src')
imagem = imagem ? imagem : '//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png'
imagem = 'https:' + imagem
hasil.push({imagem, pesquisaText})
return hasil
}

module.exports = { wikiSearch }
