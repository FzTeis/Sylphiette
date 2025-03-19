import fetch from 'node-fetch' 
const handler = async (m, {conn, text, args}) => {   
if (!args[0]) return conn.reply(m.chat, "*[ 🔎 ] Envie el comando más la url completa del sitio web.*", m);  
   try {
     const ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer();
        conn.sendFile(m.chat, ss, '', '', m);
   } catch { 
   try {  
     const ss2 = `https://api.screenshotmachine.com/?key=c04d3a&url=${args[0]}&screenshotmachine.com&dimension=720x720`;  
        conn.sendMessage(m.chat, {image: {url: ss2}}, {quoted: m}); 
   } catch {  
   try { 
     const ss3 =  `https://api.lolhuman.xyz/api/SSWeb?apikey=GataDios&url=${text}`; 
        conn.sendMessage(m.chat, {image: {url: ss3}}, {quoted: m}); 
   } catch { 
     const ss4 = `https://api.lolhuman.xyz/api/SSWeb2?apikey=GataDios&url=${text}`;
        conn.sendMessage(m.chat, {image: {url: ss4}}, {quoted: m});  
   }
  }
 }
}; 
handler.help = ['ss', 'ssweb'].map((v) => v + ' <url>');   
handler.tags = ['tools'];   
handler.command = /^ss(web)?f?$/i;   
export default handler