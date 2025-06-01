let handler = async (m, { conn, text }) => {
      try {
         if (!text) {
            return conn.reply(m.chat, `🌷 Ejemplo de uso: inspect https://whatsapp.com/channel/0029Va6InNBFCCoM9xzKFG3G`, m);
         }

         if (text.includes('https://whatsapp.com/channel/')) {
            let i = await getInfo(conn, text);

conn.relayMessage(m.chat, {
extendedTextMessage:{
                text: i.inf, 
                contextInfo: {
mentionedJid: conn.parseMention(i.inf),
                     externalAdReply: {
                        title: wm,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnail: await (await fetch(logo)).buffer(),
                        sourceUrl: ''
                    }
                }
}}, { quoted: m })
            await await await m.reply(i.id);
            m.react("☑️");
         } else {
            return conn.reply(m.chat, `🌱 Ingresa un link válido.`, m);
         }
      } catch (error) {
         console.error(error);
         await conn.reply(m.chat, `Error al obtener la información del canal: ${error.message}`, m);
      }
   }
handler.command = ["inspector", "inspect", "id"]
handler.help = ["inspect"]
handler.tags = ["tools"]
export default handler

async function getInfo(conn, url) {
    const match = url.match(/https:\/\/whatsapp\.com\/channel\/([0-9A-Za-z]+)/i);
    if (!match) throw new Error("El enlace proporcionado no es válido o no pertenece a un canal de WhatsApp.");
    
    const channelId = match[1];

    try {
        const info = await conn.newsletterMetadata("invite", channelId);
        const fecha = new Date(info.creation_time * 1000);
        const fechaFormato = fecha.toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });

        let txt = `
            ◜ *Channel - Info* ◞

≡ 🌴 *Nombre:* ${info.name}
≡ 🌿 *ID:* ${info.id}
≡ 🌾 *Estado:* ${info.state}
≡ 📅 *Creado:* ${fechaFormato}

≡ 🗃️ *Enlace:*
- https://whatsapp.com/channel/${info.invite}

≡ 🍄 *Seguidores:* ${info.subscribers}
≡ 🎍 *Verificación:* ${info.verified ? "✅ Sí" : "❌ No"}

≡ 🌷 *Descripción:* 
${info.description || "Sin descripción"}

${footer}
        `.trim();

        return {
            id: info.id,
            inf: txt
        };
    } catch (error) {
        throw new Error(`No se pudo obtener la información del canal: ${error.message}`);
    }
}