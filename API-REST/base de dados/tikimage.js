const axios = require('axios')
const cheerio = require('cheerio')

function TiktokImagem(url) {
     return new Promise((resolve, reject) => {
          axios.get(`https://dlpanda.com/?url=${url}&token=G7eRpMaa`,{
          headers: {
               "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
               "cookie": "current_locale=en; __cf_bm=FexJkV3ubqAoQE73vbC4aQFEsxQ1bsuLl.qS_P4E5GM-1678040666-0-AWZ8EfPa3Dywaq6G5mh5ki1t7Lhxbz9NA2lxQekR2Xhjlh4YYbVV9vmS/MxtGvDdtN4kmcr3AHjkvz9yTKcJ0lSqJGUikbnflMCHFrrzYB22fdO+x0HIkNxwhlLBU7CmBbVyKXtU9vS2KikYJ0iy7xs=; XSRF-TOKEN=eyJpdiI6ImxGbjdXemFxQ1pLV2swbEoza1U1bEE9PSIsInZhbHVlIjoibWFEaXZUaHFyTW14UzdxcVlPMXMwMTJtOWF2T0NmU2dUSUdmUmVFekpoRDhUbDZaNS9sZ2NRMTMvMVVrQnVDY1l3ZVpybFd0T202dGNIWURjZThBT3FBMGgwYTdjdlo3ZVFEemRUQ3F0dnJTYXRHb0VFc21yd25EM3E3NFA2bjkiLCJtYWMiOiJjN2VlYzc0MGYxNmMzMjJkZjQ5NWYwY2RlMWJjYTBkMzQ5MzNkZjQwOWFmMDE4ZGQyMzY4MTdhOTA5MTUyNzZmIiwidGFnIjoiIn0%3D; dlpanda_session=eyJpdiI6IjFpamxVTklhK292YU9ab2V5R05KSGc9PSIsInZhbHVlIjoiWFJad0ZkZHV2Y2pkRGwvYWNuaDdPcmFuRmdQamE5ejJnUDEvcGNqRks1d3pBMnU1aUtXMDJzWDZMdXpscUg1Rld5TU9BdXNUc2JEM2JHajBwZ0ZDVUg3YjZLdmZCK2h5NkRQc2dYYm9HWkNwbWwvWHpjVUFOdnpHdlVRWU1zMjUiLCJtYWMiOiI0OWU1NzZmZjI3MDdlZTU0MjUzMTg4ZjZkNzcxNGJjOTRhNzE5YjM1Y2Q2ZDJmM2Q0ODFhMjc5ODI4YWU0YWIzIiwidGFnIjoiIn0%3D"
          }
               
          })
               .then(({ data }) => {
                    const $ = cheerio.load(data)
                    let resultado = []
                    $('div.card-body.row > div').get().map(rest => {
                         var imagensCheck = $(rest).find('img').attr('src')
                   resultado.push({link: url, fotos: imagensCheck})
                    })
                    resolve(resultado)
               })
               .catch(e => {
                    reject(e)
               })
     })
}

module.exports = { TiktokImagem }