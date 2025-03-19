let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let fz = '5212431268546'
  const text = `
▧「 *👤 USER - BANK 🏦* 」
│ 📛 *Nombre:* ${user.registered ? user.name : conn.getName(m.sender)}
│ 💳 *Atm:* ${user.coin > 0 ? user.coin : 'No tienes monedas en este momento'}
│ 🏛️ *Cuenta del banco:* ${user.bank} 💲 / ${user.coin} 💲
│ 🌴 *User level:* ${user.level}
│ 🤖 *Experiencia:* ${user.exp}
│ 🌟 *Status:* ${m.sender.split`@`[0] == fz ? 'Developer' : (user.premiumTime >= 1 ? 'Premium User' : 'Free User')}
│ 📑 *Registered:* ${user.registered ? 'Yes':'No'}
└──···

> Para poder retirar las monedas en tu cuenta del banco, utiliza:
\`\`\`##  #wd <cantidad>
##  #wd all\`\`\`
`
  conn.sendFile(m.chat, 'https://telegra.ph/file/5139d94f6a80d5f525ce0.png', 'menu.jpg', text, null, true, { contextInfo: { externalAdReply: { showAdAttribution: true,
 mediaUrl: insta,
    mediaType: 0, 
    description: insta,
    title: `Sylph is the best`,
    body: `SylphBot by >\`\` I\'m Fz~`,
    thumbnail: await (await fetch('https://telegra.ph/file/d6c1f6d09e777b258d709.jpg')).buffer(),
    sourceUrl: insta
}
     }
    })
    m.react('🏦')
}
handler.help = ['bank']
handler.tags = ['econ']
handler.command = /^(bank)$/i
export default handler