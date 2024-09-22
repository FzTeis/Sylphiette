const getBuffer = async (url) => {
	const res = await fetch(url, {
        headers: {  
            'User-Agent': 'PostmanRuntime/7.32.2',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        }, 
        method: 'GET' 
    })
	const buff = await res.buffer()
	return buff
}

const fetch = require('node-fetch').default;

const getClientToken = async (clientId) => {
    const request = await fetch("https://clienttoken.spotify.com/v1/clienttoken", {
        "headers": {
            "accept": "application/json",
            "accept-language": "pt-BR,pt;q=0.9",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "https://open.spotify.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{\"client_data\":{\"client_version\":\"1.2.12.474.g112898ec\",\"client_id\":\"${clientId}\",\"js_sdk_data\":{\"device_brand\":\"unknown\",\"device_model\":\"unknown\",\"os\":\"windows\",\"os_version\":\"NT 10.0\",\"device_id\":\"75070bf3-896c-4155-aced-ca52eb01d378\",\"device_type\":\"computer\"}}}`,
        "method": "POST"
    })
    return request.json()
}

const getLyricsArray = async (trackId, clientToken, accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const request = await fetch(`https://spclient.wg.spotify.com/color-lyrics/v2/seo/track/${trackId}?market=from_token`, {
                "headers": {
                    "accept": "application/json",
                    "authorization": `Bearer ${accessToken}`,
                    "client-token": clientToken
                }
            })
            const requestJson = await request.json()
            var lyricsArray = []
            var lyricsStr = ''
            for(let i in requestJson.lyrics.lines) {
                lyricsArray.push([requestJson.lyrics.lines[i].words, parseInt(i)])
                lyricsStr += '_*' + requestJson.lyrics.lines[i].words + '*_'
                if(i != requestJson.lyrics.lines.length - 1) lyricsStr += '\n'
            }

            resolve({
                lyricsArray,
                lyricsStr
            })
            return
        } catch(e) {
            resolve({
                lyricsArray: [],
                lyricsStr: ''
            })
            return
        }
    })
} 

const getDownloadMultiLink = async (playlistId, isAlbum) => {
    return new Promise( async (resolve, reject) => {
        fetch('https://api.spotify-downloader.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'PostmanRuntime/7.32.2',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            },
            body: `link=https://open.spotify.com/${isAlbum ? 'album' : 'playlist'}/${playlistId}`
        }).then(async res => {
            const resJson = await res.json()
            const responseArray = []
            var totalSize = 0
            for(let obj of resJson.tracks) {
                responseArray.push({
                    audioUrl: obj.audio.url,
                    size: obj.audio.size
                })
                totalSize += obj.audio.size
            }
            resolve({ totalSize: totalSize, tracks: responseArray })
            return
        }).catch(async err => {
            reject(err)
            return
        })
    })
}
const getDownloadSingleLink = async (trackId) => {
    return new Promise( async (resolve, reject) => {
        fetch('https://api.spotify-downloader.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'PostmanRuntime/7.32.2',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            },
            body: `link=https://open.spotify.com/track/${trackId}`
        }).then(async res => {
            const resJson = await res.json()
          const resultado = {
            audioUrl: resJson.audio.url, 
            size: resJson.audio.size
        }
            resolve(resultado)
            return
        }).catch(async err => {
            reject(err)
            return
        })
    })
}


const getTrackSpotify = async (trackId) => {
    return new Promise( async (resolve, reject) => {
        fetch(`https://open.spotify.com/track/${trackId}`).then(async res => {
            const html = await res.text();
            const accessToken = html.split('"accessToken":"')[1].split('\"')[0]
            const clientId = html.split('"clientId":"')[1].split('\"')[0]
            const variables = decodeURI(JSON.stringify({"uri":`spotify:track:${trackId}`}))
            const extensions = decodeURI(JSON.stringify({"persistedQuery": {"version":1,"sha256Hash":"d208301e63ccb8504831114cb8db1201636a016187d7c832c8c00933e2cd64c6"}}))
            const clientToken = (await getClientToken(clientId)).granted_token.token;
            const trackInfo = await fetch(`https://api-partner.spotify.com/pathfinder/v1/query?operationName=getTrack&variables=${variables}&extensions=${extensions}`, {
                "headers": {
                "authorization": `Bearer ${accessToken}`,
                "client-token": clientToken,
                "content-type": "application/json;charset=UTF-8",
                }
            })
            const trackInfoJson = (await trackInfo.json()).data.trackUnion
            const downloadInfoJson = await getDownloadSingleLink(trackId)
            const artistsArray = []

            var lyrics = await getLyricsArray(trackId, clientToken, accessToken)

            for(let i in trackInfoJson.artistsWithRoles.items[0].artist.discography.topTracks.items[0].track.artists.items) {
                let obj = trackInfoJson.artistsWithRoles.items[0].artist.discography.topTracks.items[0].track.artists.items[i]
                artistsArray.push({
                    name: obj.profile.name,
                    img: trackInfoJson.artistsWithRoles.items[0].artist.visuals.avatarImage.sources[0].url
                })
            }

            const responseJson = {               
                id: trackId,
                audioUrl: downloadInfoJson.audioUrl,
                size: downloadInfoJson.size,
                lyricsStr: lyrics.lyricsStr,
                lyricsArray: lyrics.lyricsArray
            }
            resolve(responseJson)
            return
        }).catch(async err => {
            reject(err)
            return
        })
    })
}
const getAlbumSpotify = async (albumId) => {
    return new Promise( async (resolve, reject) => {
        fetch(`https://open.spotify.com/album/${albumId}`).then(async res => {
            const html = await res.text();
            const accessToken = html.split('"accessToken":"')[1].split('\"')[0]
            const clientId = html.split('"clientId":"')[1].split('\"')[0]
            const variables = decodeURI(JSON.stringify({"uri":`spotify:album:${albumId}`, "locale":"","offset":0,"limit":12}))
            const extensions = decodeURI(JSON.stringify({"persistedQuery": {"version":1,"sha256Hash":"46ae954ef2d2fe7732b4b2b4022157b2e18b7ea84f70591ceb164e4de1b5d5d3"}}))
            const clientToken = (await getClientToken(clientId)).granted_token.token;
            const albumInfo = await fetch(`https://api-partner.spotify.com/pathfinder/v1/query?operationName=getAlbum&variables=${variables}&extensions=${extensions}`, {
                "headers": {
                "authorization": `Bearer ${accessToken}`,
                "client-token": clientToken,
                "content-type": "application/json;charset=UTF-8",
                }
            })

            const albumInfoJson = (await albumInfo.json()).data.albumUnion
            const tracksInfoArray = albumInfoJson.tracks.items
            const albumDownload = (await getDownloadMultiLink(albumId, true))
            const tracksArray = []
            const artistsArray = []
            var totalDuration = 0

            for(let obj of albumInfoJson.artists.items) {
                artistsArray.push({
                    name: obj.profile.name,
                    img: obj.visuals.avatarImage.sources[0].url
                })
            }
            
            for(let i in tracksInfoArray) {
                obj = tracksInfoArray[i]

                const artistsArrayTrack = []
                for(let obj2 of obj.track.artists.items) {
                    artistsArrayTrack.push({
                        name: obj2.profile.name
                    })
                }
                const lyrics = await getLyricsArray(obj.track.uri.split(':')[2], clientToken, accessToken)

                const trackInfo = {
                    title: obj.track.name,
                    thumb: albumInfoJson.coverArt.sources[2].url,
                    artists: artistsArrayTrack,
                    duration: obj.track.duration.totalMilliseconds,
                    id: obj.track.uri.split(':')[2],
                    year: parseInt(albumInfoJson.date.isoString.split('-')[0]),
                    audioUrl: albumDownload.tracks[i].audioUrl,
                    size: albumDownload.tracks[i].size,
                    lyricsStr: lyrics.lyricsStr,
                    lyricsArray: lyrics.lyricsArray
                }
                totalDuration += obj.track.duration.totalMilliseconds
                tracksArray.push(trackInfo)
            }
            const responseJson = {
                title: albumInfoJson.name,
                id: albumId,
                duration: totalDuration,
                date: albumInfoJson.date.isoString.split('T')[0],
                year: albumInfoJson.date.isoString.split('-')[0],
                artists: artistsArray,
                thumb: albumInfoJson.coverArt.sources[2].url,
                size: albumDownload.totalSize,
                tracks: tracksArray,
            }
            resolve(responseJson)
            return
        }).catch(async err => {
            reject(err)
            return
        })
    })
}

const getPlaylistSpotify = async (playlistId) => {
    return new Promise( async (resolve, reject) => {
        fetch(`https://open.spotify.com/playlist/${playlistId}`).then(async res => {
            const html = await res.text();
            const accessToken = html.split('"accessToken":"')[1].split('\"')[0]
            const clientId = html.split('"clientId":"')[1].split('\"')[0]
            const variables = decodeURI(JSON.stringify({"uri":`spotify:playlist:${playlistId}`, "locale":"","offset":0,"limit":20}))
            const extensions = decodeURI(JSON.stringify({"persistedQuery": {"version":1,"sha256Hash":"5534e86cc2181b9e70be86ae26d514abd8d828be2ee56e5f8b7882dd70204c62"}}))
            const clientToken = (await getClientToken(clientId)).granted_token.token;
            const playlistInfo = await fetch(`https://api-partner.spotify.com/pathfinder/v1/query?operationName=fetchPlaylist&variables=${variables}&extensions=${extensions}`, {
                "headers": {
                "authorization": `Bearer ${accessToken}`,
                "client-token": clientToken,
                "content-type": "application/json;charset=UTF-8",
                }
            })

            const playlistInfoJson = (await playlistInfo.json()).data.playlistV2
            const trackInfoArray = playlistInfoJson.content.items
            const playlistDownload = (await getDownloadMultiLink(playlistId, false))
            const tracksArray = []
            var totalDuration = 0

            for(let i in trackInfoArray) {
                var obj = trackInfoArray[i].itemV2.data

                const artistsArrayTrack = []
                for(let obj2 of obj.artists.items) {
                    artistsArrayTrack.push({
                        name: obj2.profile.name
                    })
                }

                const lyrics = await getLyricsArray(obj.uri.split(':')[2], clientToken, accessToken)

                totalDuration += obj.trackDuration.totalMilliseconds
                tracksArray.push({
                    title: obj.name,
                    thumb: obj.albumOfTrack.coverArt.sources[2].url,
                    artists: artistsArrayTrack,
                    duration: obj.trackDuration.totalMilliseconds,
                    id: obj.uri.split(':')[2],
                    audioUrl: playlistDownload.tracks[i].audioUrl,
                    size: playlistDownload.tracks[i].size,
                    lyricsStr: lyrics.lyricsStr,
                    lyricsArray: lyrics.lyricsArray
                })
            }
            const responseJson = {
                title: playlistInfoJson.name,
                id: playlistId,
                duration: totalDuration,
                thumb: playlistInfoJson.images.items[0].sources[0].url,
                size: playlistDownload.totalSize,
                tracks: tracksArray,
                owner: playlistInfoJson.ownerV2.data.name,
                description: playlistInfoJson.description
            }
            resolve(responseJson)
            return
        }).catch(async err => {
            reject(err)
            return
        })
    })
}

const getArtistSpotify = async (artistId) => {
    return new Promise( async (resolve, reject) => {
        fetch(`https://open.spotify.com/artist/${artistId}`).then(async res => {
            const html = await res.text();
            const accessToken = html.split('"accessToken":"')[1].split('\"')[0]
            const clientId = html.split('"clientId":"')[1].split('\"')[0]
            const variables = decodeURI(JSON.stringify({"uri":`spotify:artist:${artistId}`, "locale":""}))
            const extensions = decodeURI(JSON.stringify({"persistedQuery": {"version":1,"sha256Hash":"b82fd661d09d47afff0d0239b165e01c7b21926923064ecc7e63f0cde2b12f4e"}}))
            const clientToken = (await getClientToken(clientId)).granted_token.token;
            const artistInfo = await fetch(`https://api-partner.spotify.com/pathfinder/v1/query?operationName=queryArtistOverview&variables=${variables}&extensions=${extensions}`, {
                "headers": {
                "authorization": `Bearer ${accessToken}`,
                "client-token": clientToken,
                "content-type": "application/json;charset=UTF-8",
                }
            })

            const artistInfoJson = (await artistInfo.json()).data.artistUnion
            const trackInfoArray = artistInfoJson.discography.topTracks.items
            const trackArray = []
            var totalDuration = 0
            for(let obj of trackInfoArray) {
                const audioDownload = await getDownloadSingleLink(obj.track.uri.split(':')[2])
                const lyrics = await getLyricsArray(obj.track.uri.split(':')[2], clientToken, accessToken)
                const artistsArray = []
                for(let obj2 of obj.track.artists.items) {
                    artistsArray.push({name: obj2.profile.name})
                } 
                trackArray.push({
                    title: obj.track.name,
                    thumb: obj.track.albumOfTrack.coverArt.sources[2].url,
                    artists: artistsArray,
                    duration: obj.track.duration.totalMilliseconds,
                    id: obj.track.uri.split(':')[2],
                    audioUrl: audioDownload.audioUrl,
                    size: audioDownload.size,
                    views: obj.track.playcount,
                    lyricsStr: lyrics.lyricsStr,
                    lyricsArray: lyrics.lyricsArray
                })
                totalDuration += obj.track.duration.totalMilliseconds
            }
            resolve({
                title: artistInfoJson.profile.name,
                followers: artistInfoJson.stats.followers,
                listenersMonth: artistInfoJson.stats.monthlyListeners,
                duration: totalDuration,
                thumb: artistInfoJson.visuals.avatarImage.sources[2].url,
                tracks: trackArray
            })
            return
        }).catch(async err => {
            reject(err)
            return
        })
    })
}

const searchSpotify = async (query) => {
    return new Promise(async (resolve, reject) => {
        fetch(`https://open.spotify.com/search/${query}`).then(async res => {
            const html = await res.text();
            const accessToken = html.split('"accessToken":"')[1].split('\"')[0]
            const clientId = html.split('"clientId":"')[1].split('\"')[0]
            const variables = encodeURI(JSON.stringify({"searchTerm": query,"offset": 0,"limit": 10,"numberOfTopResults": 5,"includeAudiobooks": false}))
            const extensions = encodeURI(JSON.stringify({"persistedQuery": {"version":1,"sha256Hash":"60efc08b8017f382e73ba2e02ac03d3c3b209610de99da618f36252e457665dd"}}))
            const clientToken = (await getClientToken(clientId)).granted_token.token;
            const searchRequest = await fetch(`https://api-partner.spotify.com/pathfinder/v1/query?operationName=searchDesktop&variables=${variables}&extensions=${extensions}`, {
                "headers": {
                    "authorization": `Bearer ${accessToken}`,
                    "client-token": clientToken,
                    "content-type": "application/json;charset=UTF-8",
                }
            })
            var searchInfoJson = (await searchRequest.json()).data.searchV2

            const response = {
                tracksArray: [],
                artistsArray: []
            }

            for(let obj of searchInfoJson.topResults.itemsV2) {
                var bestJson = {}
                var searchInfo = obj.item.data
                if(searchInfo.__typename == 'Track') {
                    bestJson.type = 'track'
                    bestJson.title = searchInfo.name
                    bestJson.duration = searchInfo.duration.totalMilliseconds
                    bestJson.id = searchInfo.id
                    bestJson.url = 'https://open.spotify.com/track/' + searchInfo.id
                    if(searchInfo.albumOfTra?.coverArt?.sources[2]?.url) bestJson.thumb = searchInfo.albumOfTrack.coverArt.sources[2].url
                    var artistsArray = []
                    for(let obj of searchInfo.artists.items) {
                        artistsArray.push({
                            name: obj.profile.name
                        })
                    }
                    bestJson.artists = artistsArray
                } else if(searchInfo.__typename == 'Artist') {
                    bestJson.type = 'artist'
                    bestJson.title = searchInfo.profile.name,
                    bestJson.id = searchInfo.uri.split(':')[2]
                    bestJson.url = 'https://open.spotify.com/artist/' + searchInfo.uri.split(':')[2]
                    if(searchInfo.visuals?.avatarImage?.sources[2]?.url) bestJson.thumb = searchInfo.visuals.avatarImage.sources[2].url
                } else if(searchInfo.__typename == 'Album') {
                    bestJson.type = 'album'
                    bestJson.title = searchInfo.name,
                    bestJson.id = searchInfo.uri.split(':')[2]
                    bestJson.url = 'https://open.spotify.com/album/' + searchInfo.uri.split(':')[2]
                    if(searchInfo.coverArt?.sources[2]?.url) bestJson.thumb = searchInfo.coverArt.sources[2].url

                    var artistsArray = []
                    for(let obj of searchInfo.artists.items) {
                        artistsArray.push({
                            name: obj.profile.name
                        })
                    }

                    bestJson.artists = artistsArray
                } else if(searchInfo.__typename == 'Playlist') {
                    bestJson.type = 'playlist'
                    bestJson.title = searchInfo.name
                    bestJson.description = searchInfo.description
                    bestJson.owner = searchInfo.ownerV2.data.name
                    bestJson.id = searchInfo.uri.split(':')[2]
                    bestJson.url = 'https://open.spotify.com/playlist/' + searchInfo.uri.split(':')[2]
                    if(searchInfo.images?.items[0]?.sources[0]?.url) bestJson.thumb = searchInfo.images.items[0].sources[0].url
                }              
            }

            for(let obj of searchInfoJson.albums.items) {
                var albumsJson = {}
                var searchInfo = obj.data
                albumsJson.title = searchInfo.name,
                albumsJson.id = searchInfo.uri.split(':')[2]
                albumsJson.url = 'https://open.spotify.com/album/' + searchInfo.uri.split(':')[2]
                albumsJson.thumb = searchInfo.coverArt.sources[2].url
                albumsJson.year = searchInfo.date.year
                var artistsArray = []
                for(let obj of searchInfo.artists.items) {
                    artistsArray.push({
                        name: obj.profile.name
                    })
                }
                albumsJson.artists = artistsArray               
            }

            for(let obj of searchInfoJson.artists.items) {
                var artistJson = {}
                var searchInfo = obj.data
                artistJson.title = searchInfo.profile.name,
                artistJson.id = searchInfo.uri.split(':')[2]
                artistJson.url = 'https://open.spotify.com/artist/' + searchInfo.uri.split(':')[2]
                if(searchInfo.visuals?.avatarImage) artistJson.thumb = searchInfo.visuals.avatarImage.sources[2].url
                response.artistsArray.push(artistJson)
            }

            for(let obj of searchInfoJson.tracksV2.items) {
                var trackJson = {}
                var searchInfo = obj.item.data
                trackJson.title = searchInfo.name
                trackJson.duration = searchInfo.duration.totalMilliseconds
                trackJson.id = searchInfo.id
                trackJson.url = 'https://open.spotify.com/track/' + searchInfo.id
                if(searchInfo.albumOfTrack?.coverArt?.sources[2]?.url) trackJson.thumb = searchInfo.albumOfTrack.coverArt.sources[2].url
                var artistsArray = []
                for(let obj of searchInfo.artists.items) {
                    artistsArray.push({
                        name: obj.profile.name
                    })
                }
                trackJson.artists = artistsArray
                response.tracksArray.push(trackJson)
            }

            for(let obj of searchInfoJson.playlists.items) {
                var playlistJson = {}
                var searchInfo = obj.data
                playlistJson.type = 'playlist'
                playlistJson.title = searchInfo.name
                playlistJson.description = searchInfo.description
                playlistJson.owner = searchInfo.ownerV2.data.name
                playlistJson.id = searchInfo.uri.split(':')[2]
                playlistJson.url = 'https://open.spotify.com/playlist/' + searchInfo.uri.split(':')[2]
                if(searchInfo.images?.items[0]?.sources[0]?.url) playlistJson.thumb = searchInfo.images.items[0].sources[0].url              
            }

            resolve(response)
            return
        }).catch(async err => {
            reject(err)
            return
        })
    })
}

module.exports = {
    searchSpotify,
    getTrackSpotify,
    getAlbumSpotify,
    getPlaylistSpotify,
    getArtistSpotify,
    getDownloadMultiLink,
    getDownloadSingleLink
}