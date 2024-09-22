const axios = require('axios')
const cheerio = require('cheerio')

function esporte_noticias() {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.bronxyshost.com.br/api-bronxys/esporte_noticias?apikey=sigma22`)
        .then((res) => {
            let hasil = []
                hasil.push(res.data)
            resolve(hasil)
        })
    })
}

module.exports = { esporte_noticias } 