let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Ingresa un texto`;

const syms1 = `Actuaras como un Bot de WhatsApp el cual fue creado por Fz, tu seras Sylphiette. Responde con un tono burlón/amable/timido`
let nombre = global.db.data.users[m.sender].name
let a = await fetch(`https://api.cafirexos.com/api/chatgpt?text=${text}&name=${nombre}&prompt=${syms1}`)
let res = await a.json()

await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});
  
  await conn.sendMessage(m.chat, {
    text: res.resultado,
    contextInfo: {
       externalAdReply :{ showAdAttribution: true,
                        sourceUrl: 'https://youtube.com/watch?v=TMT9MNM-NHg',
                        mediaType: 2,
                        description: `🍁 This bot is still in development.`,
                        title: `🌺 Thank you for using Sylphiette, the best WhatsApp bot.`,
                        body: `⚘ Developed by I\`m Fz ~`,          previewType: 0,
                        thumbnail: await (await fetch('https://telegra.ph/file/5993d734f0253a1dc0215.jpg')).buffer(),
                        mediaUrl: insta,
                        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
  m.react(done)
  
};
handler.command = handler.help = ['ai', 'ia', 'openai', 'chatgpt'];
handler.tags = ['tools'];
export default handler