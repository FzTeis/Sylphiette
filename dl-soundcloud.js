let handler = async (m, { conn, text, args, setting }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🌱 Ejemplo de uso: soundcloud creep - radiohead`, m);
    }
let sound = new SoundCloud();
    m.react('🕒');
    if (text.includes('https://soundcloud.com/')) {
      const info = await (await fetch(`https://apis-starlights-team.koyeb.app/starlight/soundcloud?url=${args[0]}`)).json()
      let isDoc = text.includes("-doc")
      if (!info) {
        return conn.reply(m.chat, 'No se encontró información del audio.', m);
      }
      let cap = `
◜ Soundcloud - Download ◞

≡ 🌴 \`Title :\` ${info.title}
≡ 🌷 \`Link :\` ${args[0]}

`;
conn.relayMessage(m.chat, {
extendedTextMessage:{
                text: cap, 
                contextInfo: {
mentionedJid: conn.parseMention(cap),
                     externalAdReply: {
                        title: footer,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnail: await (await fetch(info.image)).buffer(),
                        sourceUrl: args[0]
                    }
                }
}}, { quoted: m })

      await conn.sendFile(m.chat, await (await fetch(info.link)).buffer(), `${info.title}.mp3`, '', m, null, {
        asDocument: isDoc ? true : false, mimetype: "audio/mpeg"
      });
      m.react('☑️');
    } else {
      const results = await sound.search(text);
      if (results.length === 0) {
        return conn.reply(m.chat, 'No se encontraron resultados.', m);
      }

      let cap = `◜ Soundcloud - Search ◞\n`;

      results.slice(0, 15).forEach((res, index) => {
        cap += `\n\`${index + 1}\`\n≡ 🌴 \`Title :\` ${res.title}\n≡ 🌱 \`Link :\` ${res.url}\n`;
      });
conn.relayMessage(m.chat, {
extendedTextMessage:{
                text: cap, 
                contextInfo: {
mentionedJid: conn.parseMention(cap),
                     externalAdReply: {
                        title: footer,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnail: await (await fetch(menu)).buffer(),
                        sourceUrl: ''
                    }
                }
}}, { quoted: m })
      m.react("☑️");
    }
} catch (err) {
  console.error(err);
  return conn.reply(m.chat, 'Error en la ejecución.\n\n' + JSON.stringify(err, null, 2), m);
}
};

handler.help = ["soundcloud"];
handler.command = ["sound", "soundcloud", "sdc"];
handler.tags = ["dl"];
handler.diamond = true;

export default handler;

class SoundCloud {
    search = async function search(search) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    data,
                    status
                } = await axios.get(
                    `https://soundcloud.com/search?q=${search}`,
                );
                const $ = cheerio.load(data);
                const ajg = [];
                $("#app > noscript").each((u, i) => {
                    ajg.push($(i).html());
                });
                const _$ = cheerio.load(ajg[1]);
                const hasil = [];
                _$("ul > li > h2 > a").each((i, u) => {
                    if ($(u).attr("href").split("/").length === 3) {
                        const linkk = $(u).attr("href");
                        const judul = $(u).text();
                        const link = linkk ? linkk : "Tidak ditemukan";
                        const jdi = `https://soundcloud.com${link}`;
                        const jadu = judul ? judul : "Tidak ada judul";
                        hasil.push({
                            url: jdi,
                            title: jadu,
                        });
                    }
                });
                if (hasil.every((x) => x === undefined))
                    return {
                        mess: "no result found"
                    };
                resolve(hasil);
            } catch (err) {
                console.error(err);
            }
        });
    }

    download = async function download(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const getToken = await axios.get("https://soundcloudmp3.org/", {
                    headers: {
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
                        cookie: "XSRF-TOKEN=eyJpdiI6ImsrUTZJTVQxbWwwSGZHWkFVem16SkE9PSIsInZhbHVlIjoiMFA0RFk1ZFE0dzI4emJ0VWZFZGVSSGxwd3U2NkhzK2g5XC9xekFtNE1kajdGaVJvUHZMdUJ6SUR6XC9qQm55NUtaZGVlU0llSE5TRmtGM2xKOGRnYUJQZz09IiwibWFjIjoiY2YxNjQxOWRiNDNkODlmYzQ4M2Q0ZTdlNTUxNmQ0MDVhNTFkMGI0MTVlNzZlY2NlMDNhYTBkODg2MzE4YTk5YyJ9; laravel_session=eyJpdiI6Im8zbUk1UkRSOHpDanBXVzJpdmRNZXc9PSIsInZhbHVlIjoiWlNTRnVYZVwvb21PRjJhaU81UFRKRDRIb0dOUWRPSjAxcGV1MEhYV1NnbTA4M0FvT2lJQmQrb3JDRzh4Y3UxTkdlNFwvSlhLSnF4TmZUTHRUUVBPNGNTQT09IiwibWFjIjoiMDQwZTFlNDNkYzFlOWNhOTVlM2E3NDNlM2M5N2MyNTkyMTQ1ZTQwNGYwNGQ2ZDlhYTY0MTE4Nzc0M2UzMGEwMCJ9",
                    },
                });
                const dom = getToken.data
                const a = cheerio.load(dom);
                const token = a("input").attr("value");
                const config = {
                    _token: token,
                    lang: "en",
                    url: url,
                    submit: "",
                };

                const {
                    data,
                    status
                } = await axios(
                    "https://soundcloudmp3.org/converter", {
                        method: "POST",
                        data: new URLSearchParams(Object.entries(config)),
                        headers: {
                            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
                            cookie: "XSRF-TOKEN=eyJpdiI6ImsrUTZJTVQxbWwwSGZHWkFVem16SkE9PSIsInZhbHVlIjoiMFA0RFk1ZFE0dzI4emJ0VWZFZGVSSGxwd3U2NkhzK2g5XC9xekFtNE1kajdGaVJvUHZMdUJ6SUR6XC9qQm55NUtaZGVlU0llSE5TRmtGM2xKOGRnYUJQZz09IiwibWFjIjoiY2YxNjQxOWRiNDNkODlmYzQ4M2Q0ZTdlNTUxNmQ0MDVhNTFkMGI0MTVlNzZlY2NlMDNhYTBkODg2MzE4YTk5YyJ9; laravel_session=eyJpdiI6Im8zbUk1UkRSOHpDanBXVzJpdmRNZXc9PSIsInZhbHVlIjoiWlNTRnVYZVwvb21PRjJhaU81UFRKRDRIb0dOUWRPSjAxcGV1MEhYV1NnbTA4M0FvT2lJQmQrb3JDRzh4Y3UxTkdlNFwvSlhLSnF4TmZUTHRUUVBPNGNTQT09IiwibWFjIjoiMDQwZTFlNDNkYzFlOWNhOTVlM2E3NDNlM2M5N2MyNTkyMTQ1ZTQwNGYwNGQ2ZDlhYTY0MTE4Nzc0M2UzMGEwMCJ9",
                        },
                    },
                );
                if (status === 200) {
                    const tot = [];
                    const $ = cheerio.load(data);
                    const result = {}
                    $(".info > p").each((a, i) => {
                        let name = $(i).find("b").text()
                        let key = $(i).text().trim().replace(name, '').trim()
                        result[name.split(":")[0].trim().toLowerCase()] = key
                    })
                    result.thumbnail = $(".info img").attr("src");
                    result.download = $("#ready-group a").attr("href")
                    resolve(result);
                } else {
                    console.log("No result found");
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
}