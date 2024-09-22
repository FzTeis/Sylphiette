const fetch = require('node-fetch').default

const getVideosPlaylist = async (url) => {
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      headers: {
        cookie: "GPS=1; YSC=z-rlb6w9LtM; VISITOR_INFO1_LIVE=urTRm1PnL6s; DEVICE_INFO=ChxOekU0T0RZek9EazRNamt3TkRZNE16ZzFNQT09EJHajJ4GGJHajJ4G; PREF=tz=America.Sao_Paulo&f6=40000000&f7=100; CONSISTENCY=ACHmjUpL1kKMWiTl5Tpd-ppWfmOlUqXDajkUFGUD8N5g-iB6SBYUNdjIE_-MoNyEaU_NlkZk785qjEBOFCaxUXTLZSvmejM8xUOE4hais4U-bK_Q4lYyQh11wwawmgB-jKjdvlS-1SLSvRidXGDztxA"
      }
    }).then(async (res) => {
      try {
        if(!res.ok) throw new Error(res.status)
        const html = await res.text()
        if(url.includes('youtube.com/playlist')) {
          const playlistJson = JSON.parse(html.split('var ytInitialData = ')[1].split('</')[0].slice(0, -1))
          const videoId = playlistJson.sidebar?.playlistSidebarRenderer?.items[0]?.playlistSidebarPrimaryInfoRenderer?.navigationEndpoint?.watchEndpoint?.videoId
          const playlistId = playlistJson.sidebar?.playlistSidebarRenderer?.items[0]?.playlistSidebarPrimaryInfoRenderer?.navigationEndpoint?.watchEndpoint?.playlistId
          const urlPlaylist = `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`
          resolve(await getVideosPlaylist(urlPlaylist))
          return
        }
        const msgJson = JSON.parse(html.split('var ytInitialData = ')[1].split('</script>')[0].slice(0, -1))
        if(!msgJson) throw new Error('Playlist don\'t founded')
        const playListJson = (msgJson.contents?.twoColumnWatchNextResults?.playlist?.playlist?.contents
        || msgJson.contents?.twoColumnWatchNextResults?.secondaryResults?.secondaryResults?.results)
        if(!playListJson || playListJson.length < 1) throw new Error('Error: Playlist don\'t founded')
        const resJson = []
        var isOtherPlayList = false
        for(let obj of playListJson) {
          if(!isOtherPlayList) {
            var key = ''
            if(JSON.stringify(obj).includes('playlistPanelVideoRenderer')) key = 'playlistPanelVideoRenderer'
            else if(JSON.stringify(obj).includes('compactRadioRenderer')) key = 'compactRadioRenderer'
            
            if(JSON.stringify(obj).includes('playlistId') && key == 'compactRadioRenderer' ) {
              if(obj[key]?.shareUrl) {
                isOtherPlayList = true
                var arrayJson = await getVideosPlaylist(obj[key].shareUrl)
                resolve(arrayJson)
              }
            } else {
              var videoId = obj[key]?.videoId
              var title = obj[key]?.title?.simpleText
              var channelId = obj[key]?.longBylineText?.runs[0]?.navigationEndpoint?.browseEndpoint?.browseId
              var channelName = obj[key]?.longBylineText?.runs[0]?.text 
              var thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
              var duration = obj[key]?.lengthText?.simpleText

              resJson.push({
                url: `https://youtu.be/${videoId}`,
                title,
                channelId,
                channelName,
                thumb,
                duration
              })
            }
          }
        }
        resolve(resJson)
      } catch (e) {
        reject(e)
      }
    })
  })
}

module.exports = { 
  getVideosPlaylist
}

//getVideosPlaylist("https://youtube.com/playlist?list=PLC0AB8F3758FDFBE3").then(console.log)