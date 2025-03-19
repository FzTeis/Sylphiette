import { download } from "aptoide-scraper";

let handler = async (m, { conn, text, args, setting }) => {
   try {
      if (!text) {
         return conn.reply(m.chat, `🌱 Ejemplo de uso: playstore WhatsApp`, m);
      }
      m.react('🕒');
      if (text.includes('https://play.google.com/')) {
         try {
            let id = args[0].split("=")[1];
            let info = await download(id);
            let { name, lastup, size, package: pkg, icon, dllink } = info;

            let cap = `
◜ Play Store - Download ◞

≡ 🌴 \`Nombre :\` ${name}
≡ 🌿 \`Package :\` ${pkg}
≡ 🌾 \`Peso :\` ${size}
≡ ☑️ \`Upload :\` ${lastup}

≡ 🌷 \`Link :\` ${args[0]}
`;

            conn.sendMessage(m.chat, { text: cap,
               contextInfo: {
                  externalAdReply: {
                     title: name,
                     body: "Descargar APK",
                     thumbnail: await (await fetch(icon)).buffer(),
                     sourceUrl: args[0],
                     mediaType: 1,
                     renderLargerThumbnail: true
                  }
               }
            }, { quoted: m });

            await conn.sendFile(m.chat, dllink, `${name}.apk`, '', m, {
               document: true
            });
            m.react('☑️');
         } catch (err) {
            return conn.reply(m.chat, 'Error al obtener la información de la app.\n\n' + err, m);
         }
      } else {
         const info = await search(text);
         let cap = `◜ Play Store - Search ◞\n${info}`;
         conn.sendMessage(m.chat, { text: cap,
            contextInfo: {
               externalAdReply: {
                  title: "Resultados de búsqueda",
                  body: "Google Play Store",
                  thumbnail: await (await fetch(menu)).buffer(),
                  sourceUrl: insta,
                  mediaType: 1,
                  renderLargerThumbnail: true
               }
            }
         }, { quoted: m });
         m.react("☑️");
      }
   } catch (err) {
      return conn.reply(m.chat, 'Error en la ejecución.\n\n' + err, m);
   }
};

handler.help = ["playstore"];
handler.command = ["playstore", "gplay"];
handler.tags = ["dl"];
handler.limit = true;

export default handler;

async function search(txt) {
   const g = await import('google-play-scraper');
   let res = await g.default.search({ term: txt });
   return res.map(v => `
≡ 🔍 \`Nombre :\` ${v.title}
≡ ✍️ \`Desarrollador :\` ${v.developer}
≡ 💸 \`Precio :\` ${v.priceText}
≡ 📈 \`Puntuación :\` ${v.scoreText}
≡ ⛓️ \`Link :\` ${v.url}`).join("\n\n");
}