function handler(m) {
let name = conn.getName('5212431268546@s.whatsapp.net')
conn.sendContact(m.chat, [[`5212431268546@s.whatsapp.net`, `${name}`]], m, {
 contextInfo: { 
 forwardingScore: 2023,
isForwarded: false, 
 externalAdReply: {  
 title: `¡Hi! This is my developer's number, just shoot me a message if you have any questions or want to chat about a potential collab.`, 
 body: botName, 
 sourceUrl: 'https://whatsapp.com/channel/0029Va6InNBFCCoM9xzKFG3G',
 thumbnail: imagen,
 thumbnailUrl: 'https://telegra.ph/file/c96db6f7b43e28d45d8dc.jpg', 
 mediaType: 1,
 showAdAttribution: true, 
 renderLargerThumbnail: true 
 }
   }
     },
       {
         quoted: m,
         ephemeralExpiration: "86400"
           }
             );

}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño', 'fgowner'] 

export default handler