import { fetch } from "undici";
import { lookup } from "mime-types";

let handler = async (m, { conn, text, args }) => {
    if (!text) return m.reply(`🌱 Ingresa un texto. Ejemplo: .anime <url> <episodio>`);

    try {
        if (text.includes('otakustv.com/anime/')) {
            let epi = parseInt(args[1]) || 1;
            let info = await getInfo(args[0]);
            let { title, description, image, status, episodes, total } = info;

            if (epi < 1 || epi > total) {
                return m.reply(`El episodio solicitado no es válido. Hay un total de ${total} episodios.`);
            }

            let cap = `
乂 \`\`\`ANIME - DOWNLOAD\`\`\`

≡ 🌷 \`Título :\` ${title}
≡ 🌾 \`Descripción :\` ${description}

≡ 🌿 \`Estado :\` ${status}
≡ 🌱 \`Episodios totales :\` ${total}

_En un momento se enviará el episodio ${epi}... ten paciencia._

${footer}
`;
            let buffer = await (await fetch(menu)).arrayBuffer();
            conn.sendSylph(m.chat, cap, Buffer.from(buffer), footer, "", "", fkontak);

            let episode = episodes[epi - 1];
            const links = await getLinks(episode.link);
            if (links.mediafire) {
                m.react("⌛");
                const f = await mediafire(links.mediafire);
                await conn.sendFile(m.chat, f.download, `${f.filename}`, ``, m, false, { mimetype: 'video/mp4', asDocument: true });
                m.react("☑️");
            } else {
                m.reply(`No se encontró un link válido para el episodio ${epi}.`);
            }
        } else {
            m.react('🔍');
            const results = await search(text);
            if (results.length === 0) {
                return conn.reply(m.chat, 'No se encontraron resultados.', m);
            }

            let cap = `◜ Anime - Search ◞\n`;
            results.slice(0, 15).forEach((res, index) => {
                cap += `\n\`${index + 1}\`\n≡ 🌴 \`Title :\` ${res.name}\n≡ 🌱 \`Link :\` ${res.url}\n≡ 🌿 \`Episodios :\` ${res.episodes}\n`;
            });

            let buffer = await (await fetch(menu)).arrayBuffer();
            conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: cap,
                    contextInfo: {
                        externalAdReply: {
                            title: footer,
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnail: Buffer.from(buffer),
                            sourceUrl: ''
                        }
                    }, mentions: [m.sender]
                }
            }, {});
            m.react("🌱");
        }
    } catch (error) {
        conn.reply(m.chat, 'Error al obtener información del anime.\n\n' + error, m);
    }
};

handler.command = ["anime", "animedl", "animes"];
handler.tags = ['dl', 'prem'];
handler.help = ["animedl"];
handler.premium = true;
export default handler;

async function search(query) {
    const baseURL = `https://www1.otakustv.com/buscador?q=${query}`;
    try {
        const response = await axios.get(baseURL);
        const html = response.data;
        const $ = cheerio.load(html);

        const results = [];

        $('.animes_lista .row .col-6').each((_, element) => {
            const name = $(element).find('p.font-GDSherpa-Bold').text().trim();
            const url = $(element).find('a').attr('href');
            const icon = $(element).find('img').attr('src');
            const episodesText = $(element).find('p span.bog').text().trim();
            const episodes = episodesText.match(/\d+/g)?.pop() || '0';

            results.push({
                name,
                url,
                icon,
                episodes
            });
        });

        return results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function getInfo(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const title = $('meta[name="twitter:title"]').attr('content');
        const description = $('meta[name="twitter:description"]').attr('content');
        const image = $('meta[name="twitter:image"]').attr('content');
        const status = $('.btn-anime-info').text().trim();
        const episodes = [];

        $('.col-6.col-sm-6.col-md-4.col-lg-3.col-xl-2.pre.text-white.mb20.text-center').each((_, element) => {
            const episodeTitle = $(element).find('span.font-GDSherpa-Bold a').text().trim();
            const episodeLink = $(element).find('a.item-temp').attr('href');
            const episodeImage = $(element).find('img.img-fluid').attr('src');

            if (episodeTitle && episodeLink) {
                const modifiedLink = episodeLink.replace('/anime/', '/descargar/');
                episodes.push({
                    title: episodeTitle,
                    link: modifiedLink,
                    image: episodeImage
                });
            }
        });
        episodes.reverse();
        return {
            title,
            description,
            image,
            status,
            episodes,
            total: episodes.length
        };
    } catch (error) {
        console.error('Error fetching anime info:', error);
        throw error;
    }
}

async function getLinks(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const links = {};

        $('.bloque_download .row').each((_, element) => {
            const serverName = $(element).find('.text-left').text().trim().toLowerCase();
            const downloadLink = $(element).find('a').attr('href');
            if (serverName && downloadLink) {
                links[serverName] = downloadLink;
            }
        });
        return { status: true, ...links };
    } catch (error) {
        console.error('Error fetching links:', error);
        return { status: false, error: error };
    }
}

async function mediafire(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al acceder a la URL');

            const html = await response.text();
            const $ = cheerio.load(html);

            const typeClass = $(".dl-btn-cont").find(".icon").attr("class");
            const type = typeClass ? typeClass.split("archive")[1]?.trim() : 'desconocido';

            const filename = $(".dl-btn-label").attr("title") || 'archivo desconocido';

            const sizeMatch = $('.download_link .input').text().trim().match(/\((.*?)\)/);
            const size = sizeMatch ? sizeMatch[1] : 'desconocido';

            const ext = filename.split(".").pop();
            const mimetype = lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();

            const download = $(".input").attr("href");
            if (!download) throw new Error('No se pudo encontrar el enlace de descarga');

            resolve({
                filename,
                type,
                size,
                ext,
                mimetype,
                download,
            });
        } catch (error) {
            reject({
                msg: "Error al obtener datos del enlace: " + error.message,
            });
        }
    });
}