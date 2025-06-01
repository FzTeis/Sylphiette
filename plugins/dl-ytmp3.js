import crypto from 'crypto';
import yts from "yt-search";

let handler = async(m, { conn, text, args }) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:v|e(?:mbed)?)\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})|(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
    if (!text || !youtubeRegex.test(text)) {
        return conn.reply(m.chat, `🌱 Uso correcto : ytmp3 https://youtube.com/watch?v=DLh9mnfZvc0`, m);
    }
    try {
        m.react('⏳');        
        const search = await yts(args[0]); 
        let isDoc = /--doc|doc$/.test(text);
        const video = search.videos[0];       
        if (!video.url) return conn.reply(m.chat, `No se encontró el video.`, m);
        const mp3 = await ytdl(video.url, "mp3")
        let cap = `
\`\`\`
⊜─⌈ 📻 ◜YouTube MP3◞ 📻 ⌋─⊜

≡ 🎵 Título : ${video.title}
≡ 📺 Canal : ${video.author.name}
≡ ⏳ Duración : ${video.timestamp}
≡ 👀 Vistas : ${video.views.toLocaleString()}
≡ 📅 Publicado : ${video.ago}
≡ 🔗 Enlace : ${video.url}
≡ 🌳 Calidad : 320kbps
\`\`\`
≡ Enviando como : ${isDoc ? "Documento" : "Audio"}
`;
m.reply(cap)
conn.sendFile(m.chat, mp3.result.download, `${video.title}.mp3`, "", m, null, { asDocument: isDoc ? true : false, mimetype: "audio/mpeg"
        });
        m.react('✅');
    } catch (error) {
        console.error(error); 
        return conn.reply(m.chat, `Error al descargar el audio.\n\n` + error, m);
    }
};

handler.command = ["yta", "ytmp3", "ytmp3doc"];
handler.help = ["ytmp3"];
handler.tags = ["download"];
export default handler;

async function ytdl(link, format = '720') {
  const apiBase = "https://media.savetube.me/api";
  const apiCDN = "/random-cdn";
  const apiInfo = "/v2/info";
  const apiDownload = "/download";

  const decryptData = async (enc) => {
    try {
      const key = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex');
      const data = Buffer.from(enc, 'base64');
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return JSON.parse(decrypted.toString());
    } catch (error) {
      return null;
    }
  };

  const request = async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : apiBase}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: {
          'accept': '*/*',
          'content-type': 'application/json',
          'origin': 'https://yt.savetube.me',
          'referer': 'https://yt.savetube.me/',
          'user-agent': 'Postify/1.0.0'
        }
      });
      return { status: true, data: response };
    } catch (error) {
      return { status: false, error: error.message };
    }
  };

  const youtubeID = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (!youtubeID) return { status: false, error: "Gagal mengekstrak ID video dari URL." };

  const qualityOptions = ['1080', '720', '480', '360', '240']; 
  try {
    const cdnRes = await request(apiCDN, {}, 'get');
    if (!cdnRes.status) return cdnRes;
    const cdn = cdnRes.data.cdn;

    const infoRes = await request(`https://${cdn}${apiInfo}`, { url: `https://www.youtube.com/watch?v=${youtubeID[1]}` });
    if (!infoRes.status) return infoRes;
    
    const decrypted = await decryptData(infoRes.data.data);
    if (!decrypted) return { status: false, error: "Gagal mendekripsi data video." };

    let downloadUrl = null;
    for (const quality of qualityOptions) {
      const downloadRes = await request(`https://${cdn}${apiDownload}`, {
        id: youtubeID[1],
        downloadType: format === 'mp3' ? 'audio' : 'video',
        quality: quality,
        key: decrypted.key
      });
      if (downloadRes.status && downloadRes.data.data.downloadUrl) {
        downloadUrl = downloadRes.data.data.downloadUrl;
        break;
      }
    }

    if (!downloadUrl) {
      return { status: false, error: "No se pudo encontrar un enlace de descarga disponible para el video." };
    }
    const fileResponse = await axios.head(downloadUrl); 
    const size = fileResponse.headers['content-length']; 

    return {
      status: true,
      result: {
        title: decrypted.title || "Unknown",
        type: format === 'mp3' ? 'audio' : 'video',
        format: format,
        download: downloadUrl,
        size: size ? `${(size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'
      }
    };
  } catch (error) {
    return { status: false, error: error.message };
  }
}