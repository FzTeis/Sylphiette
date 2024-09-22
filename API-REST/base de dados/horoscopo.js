const axios = require('axios').default
const cheerio = require('cheerio').default

const horoshoje = (signo) => {
return new Promise((resolve, reject) => { 
        axios(`https://www.somostodosum.com.br/horoscopo/signo/${signo}.html`)
        .then(async ({data}) => {
            var $ = cheerio.load(data)
            var profissional = $('.all-browsers > br')[0].prev.data
            var pessoal = $('.all-browsers > br')[2].prev.data
            var saude = $('.all-browsers > br')[4].prev.data
            var total = profissional+'\n'+pessoal+'\n'+saude
            var horosdata = $('center > h2').text()
            var thumb = $('center > img')[0].attribs.src
            var fail = {body: 'Falha!'}
            if(!profissional) reject(fail)
            if(!pessoal) reject(fail)
            if(!saude) reject(fail)
            if(!total) reject(fail)
            if(!horosdata) reject(fail)
            if(!thumb) reject(fail)
            var json = {
                imagem: 'https://www.somostodosum.com.br/horoscopo' + thumb.slice(2),
                título: horosdata,
                inform: total
            }
            resolve(json)
        })
    })
}

module.exports = {horoshoje}