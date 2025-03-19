import * as baileys from "@whiskeysockets/baileys";
import axios from "axios";

async function sendAlbum(jid, medias, options = {}) {
  if (typeof jid !== "string") {
    throw new TypeError(`jid must be string, received: ${jid} (${jid?.constructor?.name})`);
  }
  for (const media of medias) {
    if (!media.type || (media.type !== "image" && media.type !== "video")) {
      throw new TypeError(`media.type must be "image" or "video", received: ${media.type} (${media.type?.constructor?.name})`);
    }
    if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data))) {
      throw new TypeError(`media.data must be object with url or buffer, received: ${media.data} (${media.data?.constructor?.name})`);
    }
  }
  if (medias.length < 2) {
    throw new RangeError("Minimum 2 media");
  }
  const delay = !isNaN(options.delay) ? options.delay : 500;
  delete options.delay;
  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(media => media.type === "image").length,
        expectedVideoCount: medias.filter(media => media.type === "video").length,
        ...(options.quoted
          ? {
              contextInfo: {
                remoteJid: options.quoted.key.remoteJid,
                fromMe: options.quoted.key.fromMe,
                stanzaId: options.quoted.key.id,
                participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                quotedMessage: options.quoted.message,
              },
            }
          : {}),
      },
    },
    {}
  );
  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });
  for (let i = 0; i < medias.length; i++) {
    const { type, data, caption } = medias[i];
    const message = await baileys.generateWAMessage(
      album.key.remoteJid,
      { [type]: data, caption: caption || "" },
      { upload: conn.waUploadToServer }
    );
    message.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
    };
    await conn.relayMessage(message.key.remoteJid, message.message, { messageId: message.key.id });
    await baileys.delay(delay);
  }
  return album;
}
const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🌿 Ejemplo de uso: ${usedPrefix + command} Black Clover`, m);
    }
    m.react('🕒');
    let old = new Date();
    let res = await ttks(text);
    let videos = res.data; 
    if (!videos.length) {
      return conn.reply(m.chat, "No se encontraron videos.", m);
    }
    let cap = `*◜ TikTok - Download ◞*\n\n`
            + `≡ 🎥 \`Título  :\` ${videos[0].title}\n`
            + `≡ 🔗 \`Text:\` ${text}\n\n`
            + footer;
    let medias = videos.map((video, index) => ({
      type: "video",
      data: { url: video.no_wm },
      caption: index === 0 
        ? cap 
        : `🌷 \`Title\` : ${video.title}\n🍟 \`Process\` : ${((new Date() - old) * 1)} ms`
    }));
    await sendAlbum(m.chat, medias, { quoted: m });
    m.react('✅');
  } catch (e) {
    return conn.reply(m.chat, `Ocurrió un problema al obtener los videos:\n\n` + e, m);
  }
};
handler.command = ["ttsesearch", "tiktoks", "tts", "ttrndm", "ttks"];
handler.help = ["ttsearch"];
handler.tags = ["dl"];
export default handler;

async function ttks(query) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: {
        keywords: query,
        count: 20,
        cursor: 0,
        HD: 1
      }
    });
    const videos = response.data.data.videos;
    if (videos.length === 0) throw new Error("⚠️ No se encontraron videos para esa búsqueda.");
    const shuffled = videos.sort(() => 0.5 - Math.random()).slice(0, 5);
    return {
      status: true,
      creator: "I'm Fz~",
      data: shuffled.map(video => ({
        title: video.title,
        no_wm: video.play,
        watermark: video.wmplay,
        music: video.music
      }))
    };
  } catch (error) {
    throw error;
  }
}