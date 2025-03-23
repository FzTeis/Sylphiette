let handler = async (m, { conn }) => {
conn.sendMessage(m.chat, { react: { text: '🍟', key: m.key }})
  const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = (await import('@whiskeysockets/baileys')).default
let res = await fetch('https://api.github.com/repos/FzTeis/Sylphiette')

if (!res.ok) throw new Error('Error al obtener datos del repositorio')
let json = await res.json()

let txt = `≡ 🌳 \`Nombre :\` ${json.name}\n`
txt += `≡ 🌱 \`Visitas :\` ${json.watchers_count}\n`
txt += `≡ 🍁 \`Peso :\` ${(json.size / 1024).toFixed(2)} MB\n`
txt += `≡ 🍂 \`Actualizado :\`
° *${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}*\n`
txt += `≡ 🎍 \`Url :\` ${json.html_url}\n`
txt += `≡ 🌿 \`Forks :\` ${json.forks_count}\n`
txt += `≡ 🌴 \`Stars :\` ${json.stargazers_count}\n\n`
txt += footer
	const msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2
      },
      interactiveMessage: proto.Message.InteractiveMessage.fromObject({
      contextInfo: {
        	mentionedJid: [m.sender], 
        	isForwarded: true, 
	        forwardedNewsletterMessageInfo: {
			newsletterJid: '120363183614708156@newsletter',
			newsletterName: "Sylphiette's Channel 🍂", 
			serverMessageId: -1
		},
	businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
	forwardingScore: 256,
            externalAdReply: {  
                title: 'Sylph', 
                thumbnailUrl: 'https://telegra.ph/file/a6f3ef42e42efcf542950.jpg', 
                sourceUrl: insta,
                mediaType: 2,
                renderLargerThumbnail: false
            }
          }, 
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `🍂 Hola, @${m.sender.replace(/@.+/g, '')}! A continuación te proporciono información sobre el script del bot!`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: "Sylphiette | Powered By I'm Fz ~"
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          hasMediaAttachment: false
        }),
        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
          cards: [
            {
              body: proto.Message.InteractiveMessage.Body.fromObject({
                text: txt
              }),
              footer: proto.Message.InteractiveMessage.Footer.fromObject({
              }),
              header: proto.Message.InteractiveMessage.Header.fromObject({
                title: '`</> Script - Sylphiette </>`\n',
                hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: fs.readFileSync("./src/script.jpg") }, { upload: conn.waUploadToServer }))
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: `{"display_text":"Click Here!","url":"https://github.com/FzTeis/Sylphiette","merchant_url":"https://github.com/FzTeis/Sylphiette"}`
                    }
                  ]
              })
            },
            ]
        })
      })
    }
  }
}, { userJid: m.chat, quoted: m })
conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
}
handler.help = ['script']
handler.tags = ['main']
handler.command = /^(sc|script|sylph)$/i
export default handler