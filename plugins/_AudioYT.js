5
let limit = 20 // Limite de 20 MB

let handler = async (m, { conn, text, isPrems, isOwner, usedPrefix, command }) => {
   if (!m.quoted) return m.reply('Etiqueta el mensaje que contenga el resultado de YouTube Play.')
   if (!m.quoted.text.includes("*⊜─⌈ 📻 ◜YouTube Play◞ 📻 ⌋─⊜*")) return m.reply('Etiqueta el mensaje que contenga el resultado de YouTube Play.')
   if (!m.quoted.isBaileys) return m.reply('Etiqueta un mensaje mio que contenga el resultado de YouTube Play.')
   let urls = m.quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
   if (!urls) return m.reply('×')
   if (urls.length < text) return m.reply('Resultado no Encontrado.')
   await m.react('🕓')
   //INICIANDO DESCARGAS
   const { status, resultados, error } = await ytmp33(urls);
   
   const docu = {
    audio: {
      url: resultados.descargar
    },
    mimetype: 'audio/mp4',
    fileName: resultados.titulo + '.mp3',
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 1,
        mediaUrl: 'https://whatsapp.com/channel/0029Va6InNBFCCoM9xzKFG3G',
        title: resultados.titulo,
        body: wm,
        sourceUrl: 'https://whatsapp.com/channel/0029Va6InNBFCCoM9xzKFG3G',
        thumbnail: imagen
      }
    }
  };
   conn.sendMessage(m.chat, docu, { quoted: fkontak });
  
   //await conn.sendMessage(m.chat, { audio: { url: resultados.descargar }, fileName: resultados.titulo + '.mp3', mimetype: 'audio/mp4' }, { quoted: m })
   await m.react('✅')
}

handler.help = ['Audio']
handler.tags = ['dl']
handler.customPrefix = /^(Audio|audio)/
handler.command = new RegExp
export default handler