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
      
      resolve({status: 200, criador: '@nezsab-team.exe', resultado: dados2})
    })
    .catch(e => {
      reject(e)
    })
  })
}


module.exports = { randomGrupos }