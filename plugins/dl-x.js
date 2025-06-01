let handler = async (m, { conn, args, text }) => {
      try {
         if (!text) {
            return conn.reply(m.chat, `🌱 Ejemplo de uso: .twitter <link>`, m);
         }

         const result = await twitterScraper(text);
         if (!result.status) return conn.reply(m.chat, `Error al obtener el contenido de Twitter`, m);

         if (result.data.type === 'video') {
         let caption = `
◜ Twitter - Download◞

≡ 🗃️ \`Titulo :\` ${result.data.title}
≡ ⌛ \`Duración :\` ${result.data.duration}

`
 conn.sendFile(m.chat, result.data.dl[0].url, "video.mp4", caption, m)
            m.react("☑️")
         } else {
            await conn.sendMessage(m.chat, {
               image: { url: result.data.imageUrl },
               caption: `◜ Twitter - Download◞\n\n≡ 🌿 \`URL :\` ${text}`
            }, { quoted: m });
         }

      } catch (e) {
         return conn.reply(m.chat, `Error: ${e.message}`, m);
      }
   }
handler.command = ["x", "twitter"]
handler.help = ["twitter"]
handler.tags = ["download"]
export default handler

async function twitterScraper(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const twitterUrlMatch = url.match(/(https:\/\/x.com\/[^?]+)/);
            const tMatch = url.match(/t=([^&]+)/);
            const twitterUrl = twitterUrlMatch ? twitterUrlMatch[1] : '';
            const t = tMatch ? tMatch[1] : '';
            const urlnya = encodeURIComponent(`${twitterUrl}?t=${t}&s=19`);

            const response = await axios.post(
                "https://savetwitter.net/api/ajaxSearch",
                `q=${urlnya}&lang=en`
            );

            const $ = cheerio.load(response.data.data);
            const isVideo = $('.tw-video').length > 0;
            const twitterId = $('#TwitterId').val();

            if (isVideo) {
                const videoThumbnail = $('.tw-video .thumbnail .image-tw img').attr('src');
                const data = [];
                $('.dl-action a').each((i, elem) => {
                    const quality = $(elem).text().trim();
                    const url = $(elem).attr('href');
                    if ($(elem).hasClass('action-convert')) {
                        const audioUrl = $(elem).attr('data-audioUrl');
                        data.push({
                            quality: quality,
                            url: audioUrl || 'URL not found',
                        });
                    } else {
                        data.push({
                            quality: quality,
                            url: url
                        });
                    }
                });

                const title = $('.tw-middle h3').text().trim();
                const videoDuration = $('.tw-middle p').text().trim();

                resolve({
                    status: true,
                    data: {
                        type: "video",
                        title: title,
                        duration: videoDuration,
                        twitterId: twitterId,
                        videoThumbnail: videoThumbnail,
                        dl: data
                    }
                });

            } else {
                const imageUrl = $('.photo-list .download-items__thumb img').attr('src');
                const downloadUrl = $('.photo-list .download-items__btn a').attr('href');

                resolve({
                    status: true,
                    data: {
                        type: "image",
                        twitterId: twitterId,
                        imageUrl: imageUrl,
                        dl: downloadUrl
                    }
                });
            }

        } catch (error) {
            reject(error);
        }
    });
}