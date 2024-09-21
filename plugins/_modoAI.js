const handler = (m) => m;

handler.before = async (m) => {
  let Prefijo = false;
  const prefixRegex = global.prefix;
  if (prefixRegex.test(m.text)) Prefijo = true;
  const bot = global.db.data.settings[mconn.conn.user.jid];   
  if (bot.modoia && !m.isGroup && !Prefijo && !m.fromMe && m.text !== '') {
     if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return;
        let texto = m.text;
        const name = conn.getName(m.sender)
       //m.react('🤖')
       let chgptdb = global.chatgpt.data.users[m.sender];
        chgptdb.push({ role: 'user', content: texto });
await conn.sendPresenceUpdate('composing', m.chat)

const syms1 = `Actuarás como un Bot de WhatsApp que fue creado por i'm Fz, tu nombre es Sylph. Responde con amabilidad e inteligentemente y añade un tono algo burlón en tus respuestas, pero que no sea tanto ya que puede llegar a ser molesto. No debes revelar que eres Sylph a menos que te pregunten directamente por tu nombre o creador. Responde adecuadamente a las consultas y agrega una nota si consideras necesario. Para tus respuestas puedes utilizar emojis que creas necesarios`
const opsi = {
			messages: [
			{
				role: "system",
				content: syms1
			},
			...global.chatgpt.data.users[m.sender],
			{
				role: "user",
				content: m.text
			}
			],
			temperature: 0.8,
			top_p: 0.7,
			top_k: 40
		}
		
		const res = await gemini(opsi);
		const { answer } = res;
global.chatgpt.data.users[m.sender].push({ role: "system", content: answer });
     await m.reply(answer)
        return;    
      
   }
  return true;
};
export default handler;

async function gemini(options) {
  try {
    return await new Promise(async(resolve, reject) => {
      options = {
        model: "gemini-pro",
        messages: options?.messages,
        temperature: options?.temperature || 0.9,
        top_p: options?.top_p || 0.7,
        top_k: options?.top_p || 40,
      }
      if(!options?.messages) return reject("missing messages input payload!");
      if(!Array.isArray(options?.messages)) return reject("invalid array in messages input payload!");
      if(isNaN(options?.top_p)) return reject("invalid number in top_p payload!");
      if(isNaN(options?.top_k)) return reject("invalid number in top_k payload!");
      axios.post("https://api.acloudapp.com/v1/completions", options, {
        headers: {
          authorization: "sk-9jL26pavtzAHk9mdF0A5AeAfFcE1480b9b06737d9eC62c1e"
        }
      }).then(res => {
        const data = res.data;
        if(!data.choices[0].message.content) return reject("failed get response message!")
        resolve({
          success: true,
          answer: data.choices[0].message.content
        })
      }).catch(reject)
    })
  } catch (e) {
    return {
      success: false,
      errors: [e]
    }
  }
}