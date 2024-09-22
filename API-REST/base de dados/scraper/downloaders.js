const {
  axios,
  cheerio,
  unescapeHtml,
  default_criador,
  useragent_1,
  removerAcentos,
  qs
} = require('./defaults.js');

//========== Pinterest Video ============\\

const pinterestVideoDownloader = (url) => new Promise((resolve, reject) => {
  axios.get(link, {
      headers: {
        ...useragent_1
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const json = JSON.parse($('script[data-test-id="video-snippet"]').text());
      resolve({
        status: res.status,
        criador: default_criador,
        titulo: json.name,
        thumb: json.thumbnailUrl,
        video: json.contentUrl
      });
    })
    .catch((e) => {
      reject(e)
    });
});

const instaVideoV1 = (url) => new Promise((resolve, reject) => {
  axios.post(`https://vidinsta.app/web/home/fetch`, qs.stringify({
      url: url
    }), {
      headers: {
        ...useragent_1,
        "connection": "keep-alive",
        "origin": "https://vidinsta.app",
        "referer": "https://vidinsta.app/",
        "x-csrf-token": "IrIYkEXAyfiUcEZgQuW9jVVIwJkandxVddfZcPulCOZB4nDGNvCejPYGCiQovdPSbCDt9SypjWY555UEge06kQ==",
        "x-requested-with": "XMLHttpRequest",
        "cookie": "_csrf=608d48854ec29384d72c245d07f0b104cab4642bc2a6639def2a78956fd2784ea%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22cPhVs0WtbvLDjXn_9h-l64Q3L0LtzH2w%22%3B%7D;"
      }
    })
    .then((res) => {
      const $ = cheerio.load(res.data);
      const dados = [];
      $('div.row').each((i, e) => {
        if ($(e).find('.item-download > div > a').attr('href')) dados.push({
          peso: $(e).find('.item-download > .text-center').eq(1).text(),
          link_dl: 'https://vidinsta.app' + $(e).find('.item-download > div > a').attr('href')
        });
      });
      resolve({
        status: res.status,
        criador: default_criador,
        resultado: dados
      });
    })
    .catch((e) => {
      reject(e)
    });
});

const facebookDownloader = (url) => new Promise((resolve, reject) => {
  axios.post('https://fbdownloader.net/query', qs.stringify({
      query: url
    }), {
      headers: {
        ...useragent_1,
        "x-requested-with": "XMLHttpRequest",
        "cookie": "PHPSESSID=s06na5io7fe67tac65hd3ukmk8"
      }
    })
    .then((res) => {
      if (res.data.error) return reject(res.data)
      const $ = cheerio.load(res.data.html)
      const json = {
        status: res.status,
        criador: default_criador,
        titulo: unescapeHtml($('li.mb-4 > strong').text()).replace('Title:', ''),
        thumbnail: unescapeHtml($('#video-clip').find('img').attr('src')),
        video_sd: unescapeHtml($('.btn-blue').eq(0).attr('href')),
        video_hd: unescapeHtml($('.btn-blue').eq(1).attr('href'))
      }
      resolve(json)
    })
    .catch((e) => {
      reject(e)
    });
});

module.exports = {}
module.exports.pinterestVideoDownloader = pinterestVideoDownloader
module.exports.facebookDownloader = facebookDownloader