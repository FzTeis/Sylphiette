import yts from 'yt-search'
let handler = async (m, {conn, text }) => {
  if (!text) throw `✳️ ${mssg.search('YouTube')}`
  let results = await yts(text)
let tes = results.videos
let ms = tes.map(v => `
° ${v.title}

≡ 🌳 \`${mssg.duration} :\` ${v.timestamp}
≡ 🌴 \`${mssg.aploud} :\` ${v.ago}
≡ 🍁 \`${mssg.views} :\` ${v.views.toLocaleString()}
≡ 🌿 \`${mssg.link} :\` ${v.url}
`.trim()).join('\n________________________\n\n')
let teks = `\`\`\`乂 YOUTUBE - SEARCH\`\`\`\n\n${ms}`
teks += `\n\n${footer}`
	conn.sendFile(m.chat, tes[0].image, 'yts.jpeg', teks, m)
}
handler.help = ['ytsearch'] 
handler.tags = ['dl']
handler.command = ['ytsearch', 'yts'] 

export default handler