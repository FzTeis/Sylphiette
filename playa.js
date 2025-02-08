import { youtube } from 'btch-downloader';
import yts from 'yt-search';
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw (`*Example:* ${usedPrefix + command} Lil Peep hate my life`);
  
  m.reply("_Tunggu sebentar kak..._");
  
  try {
    // Cari video di YouTube berdasarkan input teks
    const searchResults = await yts(text);
    const video = searchResults.videos[0];

    if (!video) throw '*Video tidak ditemukan, coba dengan link yang lain.*';

    const { title, duration, views, ago, author, thumbnail, url } = video;
    const infoMessage = `🎬 *Detail Video*\n\n` +
                        `📌 *Judul:* ${title}\n` +
                        `⏳ *Durasi:* ${duration.timestamp}\n` +
                        `👁️ *Views:* ${views.toLocaleString()}\n` +
                        `📅 *Upload:* ${ago}\n` +
                        `✍️ *Author:* ${author.name}\n\n` +
                        `🔄 *Sedang menyiapkan audio...*`;

    // Ambil thumbnail sebagai buffer
    const thumbRes = await axios.get(thumbnail, { responseType: 'arraybuffer' });
    const thumbBuffer = Buffer.from(thumbRes.data, 'utf-8');

    // Kirim informasi detail video beserta thumbnail
    await conn.sendMessage(m.chat, {
      text: infoMessage,
      contextInfo: {
        externalAdReply: {
          title: `🎵 ${title}`,
          body: `✍️ ${author.name}`,
          thumbnail: thumbBuffer,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    // Unduh audio dari YouTube
    const data = await youtube(url);

    if (!data || !data.mp3) {
      throw new Error('Gagal mendapatkan link audio. Coba dengan link yang lain.');
    }

    const audioMessage = `*🎧 Berhasil mendownload audio YouTube*\n*Powered by PontaDev*`;

    // Kirim audio langsung dari URL
    await conn.sendMessage(m.chat, { 
      audio: { url: data.mp3 }, 
      mimetype: 'audio/mpeg', 
      caption: audioMessage,
      ptt: false // Set true jika ingin mengirim sebagai pesan suara
    }, { quoted: m });

  } catch (error) {
    console.error('Error saat mengunduh atau mengirim audio:', error);
    m.reply('*⚠️ Terjadi kesalahan saat mengunduh audio. Pastikan link yang diberikan benar.*');
  }
};

handler.help = ['playa'];
handler.command = ['playa'];
handler.tags = ['dl'];
export default handler;