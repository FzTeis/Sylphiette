import { download, detail, search } from "../lib/anime.js";

async function lang(episodes) {
    const list = [];
    for (const ep of episodes) {
        try {
            const dl = await download(ep.link);
            const langs = [];
            if (dl?.dl?.sub) langs.push('sub');
            if (dl?.dl?.dub) langs.push('dub');
            list.push({ ...ep, lang: langs });
        } catch {
            list.push({ ...ep, lang: [] });
        }
    }
    return list;
}

let handler = async (m, { command, usedPrefix, conn, text, args }) => {
    if (!text) return m.reply(`🌱 \`Ingresa el título de algún anime o la URL. Ejemplo:\`\n\n • ${usedPrefix + command} Mushoku Tensei\n • ${usedPrefix + command} https://animeav1.com/media/mushoku-tensei`);

    try {
        if (text.includes('https://animeav1.com/media/')) {
            m.react("⌛");
            let info = await detail(args[0]);
            let { title, altTitle, description, cover, votes, rating, total, genres } = info;
            let episodes = await lang(info.episodes);

            const gen = genres.join(', ');
            let eps = episodes.map(e => {
                const epNum = e.ep;
                return `• Episodio ${epNum} (${e.lang.includes('sub') ? 'SUB' : ''}${e.lang.includes('dub') ? (e.lang.includes('sub') ? ' & ' : '') + 'DUB' : ''})`;
            }).join('\n');

            let cap = `
乂 \`\`\`ANIME - DOWNLOAD\`\`\`

≡ 🌷 \`Título :\` ${title} - ${altTitle}
≡ 🌾 \`Descripción :\` ${description}
≡ 🌲 \`Votos :\` ${votes}
≡ 🍂 \`Rating :\` ${rating}
≡ 🍃 \`Géneros :\` ${gen}
≡ 🌱 \`Episodios totales :\` ${total}
≡ 🌿 \`Episodios disponibles :\`

${eps}

> Responde a este mensaje con el número del episodio y el idioma. Ejemplo: 1 sub, 3 dub
`.trim();

            let buffer = await (await fetch(cover)).arrayBuffer();
            let sent = await conn.sendMessage(m.chat, { image: Buffer.from(buffer), caption: cap }, m)
            
            conn.anime = conn.anime || {};
            conn.anime[m.sender] = {
                title,
                episodes,
                key: sent.key,
                downloading: false,
                timeout: setTimeout(() => delete conn.anime[m.sender], 600_000)
            };
        } else {
            m.react('🔍');
            const results = await search(text);
            if (results.length === 0) {
                return conn.reply(m.chat, 'No se encontraron resultados.', m);
            }

            let cap = `◜ Anime - Search ◞\n`;
            results.slice(0, 15).forEach((res, index) => {
                cap += `\n\`${index + 1}\`\n≡ 🌴 \`Title :\` ${res.title}\n≡ 🌱 \`Link :\` ${res.link}\n`;
            });

            let buffer = await (await fetch(logo)).arrayBuffer();
            conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: cap,
                    contextInfo: {
                        externalAdReply: {
                            title: wm,
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
        console.error('Error en handler anime:', error);
        conn.reply(m.chat, 'Error al procesar la solicitud: ' + error.message, m);
    }
};

handler.before = async (m, { conn }) => {
    conn.anime = conn.anime || {};
    const session = conn.anime[m.sender];
    if (!session || !m.quoted || m.quoted.id !== session.key.id) return;

    if (session.downloading) return m.reply('⏳ Ya estás descargando un episodio. Espera a que termine.');

    let [epStr, langInput] = m.text.trim().split(/\s+/);
    const epi = parseInt(epStr);
    let lang = langInput?.toLowerCase();

    if (isNaN(epi)) return m.reply('Número de episodio no válido.');

    const episode = session.episodes.find(e => parseInt(e.ep) === epi);
    if (!episode) return m.reply(`Episodio ${epi} no encontrado.`);

    const inf = await download(episode.link);
    const availableLangs = Object.keys(inf.dl || {});
    if (!availableLangs.length) return m.reply(`No hay idiomas disponibles para el episodio ${epi}.`);

    if (!lang || !availableLangs.includes(lang)) {
        lang = availableLangs[0];
    }

    const idiomaLabel = lang === 'sub' ? 'sub español' : 'español latino';
    await m.reply(`Descargando ${session.title} - cap ${epi} ${idiomaLabel}`);
    m.react("📥");

    session.downloading = true;

    try {
        const videoBuffer = await (await fetch(inf.dl[lang])).buffer();
        await conn.sendFile(m.chat, videoBuffer, `${session.title} - cap ${epi} ${idiomaLabel}.mp4`, '', m, false, {
            mimetype: 'video/mp4',
            asDocument: true
        });
        m.react("✅");
    } catch (err) {
        console.error('Error al descargar:', err);
        m.reply(`Error al descargar el episodio: ${err.message}`);
    }

    clearTimeout(session.timeout);
    delete conn.anime[m.sender];
};

handler.command = ["anime", "animedl", "animes"];
handler.tags = ['download'];
handler.help = ["animedl"];

export default handler;