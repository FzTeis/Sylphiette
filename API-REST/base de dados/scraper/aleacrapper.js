// Visite nosso site: https://nezsab-apis.xyz/
// Scrapper desenvolvida por @nezsab-team.exe
// Team: Vitinho⧽Daniel⧽Dayane⧽Yoshi⧽Anônimo 

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
          criadorScrapper: `@nezsab-team.exe`,
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

module.exports = { memesDroid }