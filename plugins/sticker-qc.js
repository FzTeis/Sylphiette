import WSF from 'wa-sticker-formatter';
import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let text 
    
if (m.quoted?.text) {
    text = m.quoted.text;
    } else {
    text = args[1]
    }

    let pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
    const mentionRegex = new RegExp(`@${who.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');
    const cleanText = text.replace(mentionRegex, '');
    let name = global.db.data.users[who]?.name || 'Usuario';

    const validColors = {
        pink: '#FFC0CB', red: '#FF0000', blue: '#0000FF', green: '#008000', yellow: '#FFFF00',
        black: '#000000', white: '#FFFFFF', orange: '#FFA500', purple: '#800080', brown: '#A52A2A',
        cyan: '#00FFFF', magenta: '#FF00FF', lime: '#00FF00', indigo: '#4B0082', violet: '#8A2BE2',
        gold: '#FFD700', silver: '#C0C0C0', beige: '#F5F5DC', teal: '#008080', navy: '#000080',
        maroon: '#800000', coral: '#FF7F50', turquoise: '#40E0D0', peach: '#FFDAB9', salmon: '#FA8072',
        mint: '#98FF98', lavender: '#E6E6FA', chartreuse: '#7FFF00', khaki: '#F0E68C', plum: '#DDA0DD',
        olive: '#808000', orchid: '#DA70D6', sienna: '#A0522D', tomato: '#FF6347', tan: '#D2B48C',
        snow: '#FFFAFA', azure: '#007FFF', slategray: '#708090', royalblue: '#4169E1', fuchsia: '#FF00FF',
        lavenderblush: '#FFF0F5'
    };

    let color = 'black';
    let words = cleanText.split(" ");
    if (validColors[args[0]]) {
        color = words.shift().toLowerCase();
        text = args[1]
    }

    if (!text) {
        return m.reply(`📌 Ejemplo: .${command} pink Hola Mundo\n\n꒰ 🖌️ Colores disponibles ꒱ ೄྀ࿐ ˊˎ-\n━━━━━━⊱⋆⊰━━━━━━\n` +
            Object.keys(validColors).map((c, i) => `${i + 1}. ${c}`).join("\n"));
    }

    const obj = {
        type: "quote",
        format: "png",
        backgroundColor: validColors[color],
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
            entities: [],
            avatar: true,
            from: {
                id: 1,
                name: name,
                photo: { url: pp }
            },
            text: text,
            replyMessage: {}
        }]
    };

    try {
        const json = await axios.post('https://qc.botcahx.eu.org/generate', obj, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!json.data.result?.image) {
            throw new Error("Error en la API.");
        }

        const buffer = Buffer.from(json.data.result.image, 'base64');
        let stiker = await sticker5(buffer, false, global.packname, global.author);
        if (stiker) {
            return conn.sendFile(m.chat, stiker, 'Quotly.webp', '', m);
        } else {
            return m.reply("❌ No se pudo crear el sticker.");
        }
    } catch (error) {
        console.error(error);
        return m.reply("🚨 Error al generar el sticker.");
    }
};

handler.help = ['qc'];
handler.tags = ['sticker'];
handler.command = /^(qc)$/i;

export default handler;

async function sticker5(img, url, packname, author, categories = ['']) {
    try {
        const metadata = { type: 'full', pack: packname, author, categories };
        return await new WSF.Sticker(img || url, metadata).build();
    } catch (error) {
        console.error("Error al crear sticker:", error);
        return null;
    }
}