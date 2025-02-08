import * as XD2L from 'twitter-downloader' 
let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args[0]) throw `📌 ${mssg.example} :\n*${usedPrefix + command}* https://twitter.com/fernandavasro/status/1569741835555291139?t=ADxk8P3Z3prq8USIZUqXCg&s=19`
          m.react(rwait)
          
          let medias = await XDL.TwitterDL(args[0])
          let te = ` 
┌─( *TWITTER DL* )
│ *${mssg.desc}:* ${medias.result.description}
└───────────`
conn.sendFile(m.chat, medias.result.media, 'twitter.mp4', te, m)
m.react(done)
  
}
handler.help = ['twitter'].map(v => v + ' <url>')
handler.tags = ['dl']
handler.command = ['twitter', 'tw', 'x']
handler.diamond = 4

export default handler