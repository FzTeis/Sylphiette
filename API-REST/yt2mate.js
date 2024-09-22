const { ytmp4, ytmp3 } = require('ruhend-scraper')

const yts = require('yt-search')

async function DOWNLOAD_YT(input) {

    let ytSearch = await yts(input)

    let { title, url, thumbnail, description, views, ago, duration } = ytSearch.videos[0]

    let { video, quality, size } = await ytmp4(url)

    let { audio } = await ytmp3(url)

    let resultados = {

        title: title,

        description: description,

        views: views,

        ago: ago,

        duration: duration,

        url: url,

        video: {

            dl_link: video,

            size: size,

            quality: quality

        },

        audio: {

            dl_link: audio

        }

    }

    return resultados

}

module.exports = { DOWNLOAD_YT }