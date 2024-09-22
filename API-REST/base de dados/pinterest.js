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
const useragent_1 = {
  "user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
};

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
      const $ = cheerio.load(data)
      resolve({
        status: 200,
        code_by: `@Vitinho & @NezSab-API'ร`,
        download_vid:  $('a[style="background-color: green;"]').attr('href'),
      })
    })
    .catch(e => {
      reject(e)
    });
  });
}

module.exports = { pinterestVideoV2 }