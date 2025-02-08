import cheerio from 'cheerio';
import fetch from 'node-fetch';
let handler = async (m, { conn, text }) => {
	
if (!text) throw `✳️ ${mssg.notext}`;
m.react('💬')

	try {
		let gpt = await fetch(`https://api--fzteis.repl.co/api/chatgpt?text=${text}&lenguaje=es`);
        let res = await gpt.json()
        await m.reply(res.resultado)
	} catch {
		m.reply(`❎ Error: intenta más tarde`);
	}

}
handler.command = ['ia2'];

export default handler;