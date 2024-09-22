const cheerio = require("cheerio")
const axios = require("axios")
const qs = require("qs")
const request = require("request")

function ringtone(title) {
    return new Promise((resolve, reject) => {
        axios.get('https://meloboom.com/en/search/'+title)
        .then((get) => {
            let $ = cheerio.load(get.data)
            let hasil = []
            $('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (a, b) {
                hasil.push({ titulo: $(b).find('h4').text(), audio: $(b).find('audio').attr('src') })
            })
            resolve({status: 200, criadorScrapper: `@nezsab-team.exe`, resultado: hasil})
		})
		.catch(reject)
		})
}

module.exports = { ringtone }