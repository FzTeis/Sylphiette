const apikey = "Tesina"; // Obten una aquí: https://api.lyrax.net
import fetch from "node-fetch";

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) throw `🌱 Ingresa un texto o URL para descargar. Ejemplo:\n\n${usedPrefix}applemusic Del Rio - Ed Maverick\n${usedPrefix}appledl <url>`;

  try {
    if (command === 'applemusic' || command === 'applem') {
      let api = await fetch(`https://api.lyrax.net/api/search/apples?text=${text}&apikey=${apikey}`).then(res => res.json());
      let dl = await fetch(`https://api.lyrax.net/api/dl/appledl?url=${api.data[0].song}&apikey=${apikey}`).then(res => res.json());

      let { datePublished, description, inAlbum: { url, name }, title, image, song } = { ...dl.metadata, ...api.data[0] };

      let info = `
        ⪩ AppleMusic - Download ⪨
        
        𖦹 🌱 Título : ${title}
        𖦹 🗃️ Descripción : ${description}
        𖦹 🔽 Publicado : ${datePublished}
        𖦹 🔗 URL : ${song}

        𖦹 📦 Album : ${name}
        𖦹 ☄️ Link : ${url}
      `;

      conn.sendFile(m.chat, image, `${title}.jpg`, info, m);
      await conn.sendMessage(m.chat, { audio: { url: dl.download }, mimetype: "audio/mpeg" }, m);
      
    } else if (command === 'applemdl' || command === 'appledl') {
      let dl = await fetch(`https://api.lyrax.net/api/dl/appledl?url=${text}&apikey=${apikey}`).then(res => res.json());
      await conn.sendMessage(m.chat, { audio: { url: dl.download }, mimetype: "audio/mpeg" }, m);
      
    } else {
      throw `🌷 Comando no reconocido.`;
    }
  } catch (e) {
    m.reply(`Ocurrió un error, inténtalo nuevamente.`);
  }
};

handler.help = handler.command = ['applemusic', 'applem', 'applemdl', 'appledl'];
handler.tags = ['dl'];

export default handler;