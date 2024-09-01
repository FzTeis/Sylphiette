import { downloadContentFromMessage, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, } from '@whiskeysockets/baileys'
const { proto } = (await import('@whiskeysockets/baileys')).default
import {youtubedl, youtubedlv2} from '@bochilteam/scraper';
let handler = async (m, {conn, text, args, usedPrefix, command }) => {

  if (!text) throw `*[❗] Por favor ingresa un texto . Ejemplo: ${usedPrefix + command} I love you so*`
m.react('📥');
let isVideo = /vid$/.test(command)
const yt_play = await search(args.join(' '))
let texto1 = `*⊜─⌈ 📻 ◜YouTube Play◞ 📻 ⌋─⊜*\n\n`
texto1 = `≡ Título : » ${yt_play[0].title}\n`
texto1 += `≡ Subido : » ${yt_play[0].ago}\n`
texto1 += `≡ Duración : » ${secondString(yt_play[0].duration.seconds)}\n`
texto1 += `≡ Vistas : » ${MilesNumber(yt_play[0].views)}\n`
texto1 += `≡ Url : » ${yt_play[0].url}\n\n`
texto1 += `≡ Tipo de archivo: » ${isVideo ? 'Video' : 'Audio'}`
      let sections = [
        {
          title: `RESULTDOS DE: ${text}`,
         // highlight_label: `Thank you for using Sylphiette`,
          rows: [
            {
              title: `Titulo: ${yt_play[0].title}`,
              description: `VIEWS: ${MilesNumber(yt_play[0].views)} | DURACIÓN: ${secondString(yt_play[0].duration.seconds)}`,
              id: `${isVideo ? '#ytmp4' : '#ytmp3'} ${yt_play[0].url}`,
            },
            {
              title: `TITULO: ${yt_play[1].title}`,
              description: `VIEWS: ${MilesNumber(yt_play[1].views)} | DURACIÓN: ${secondString(yt_play[1].duration.seconds)}`,
              id: `${isVideo ? '#ytmp4' : '#ytmp3'} ${yt_play[1].url}`,
            },
            {
              title: `TITULO: ${yt_play[2].title}`,
              description: `VIEWS: ${MilesNumber(yt_play[2].views)} | DURACIÓN: ${secondString(yt_play[2].duration.seconds)}`,
              id: `${isVideo ? '#ytmp4' : '#ytmp3'} ${yt_play[2].url}`,
            },
          ],
        },
      ];

      let listMessage = {
        title: `Tap to Download`,
        sections,
      };

      let msgs = generateWAMessageFromContent(
        m.from,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                contextInfo: {
                  mentionedJid: [m.sender],
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363267533195844@newsletter",
                    newsletterName: "Powered By Fz",
                    serverMessageId: -1,
                  },
                  businessMessageForwardInfo: {
                    businessOwnerJid: conn.decodeJid(conn.user.id),
                  },
                  externalAdReply: {
                    title: "Sylphiette - The Best",
                    thumbnail: fs.readFileSync(
                      "./src/Sylph.jpg"
                    ),
                    sourceUrl: 'https://youtube.com',
                    mediaType: 2,
                    renderLargerThumbnail: false,
                  },
                },
                body: proto.Message.InteractiveMessage.Body.create({
                  text: `Powered By Fz`,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: `Click the button below to play audio`,
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  ...(await prepareWAMessageMedia(
                    { image: { url: yt_play[0].thumbnail} },
                    { upload: conn.waUploadToServer }
                  )),
                  title: texto1,
                  subtitle: `*${botName}*`,
                  hasMediaAttachment: false,
                }),

                nativeFlowMessage:
                  proto.Message.InteractiveMessage.NativeFlowMessage.create(
                    {
                      buttons: [
                        {
                          name: "single_select",
                          buttonParamsJson: JSON.stringify(listMessage),
                        },
                      ],
                    }
                  ),
                contextInfo: {
                  mentionedJid: [m.sender],
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: "0@newsletter",
                    newsletterName: botName,
                    businessMessageForwardInfo: {
                      businessOwnerJid: conn.decodeJid(conn.user.id),
                    },
                    serverMessageId: 143,
                  },
                },
              }),
            },
          },
        },
        {}
      );
      conn.relayMessage(m.key.remoteJid, msgs.message, {
        messageId: m.key.id,
      });
}
handler.command = ['ytt', 'yttvid']

export default handler

async function search(query, options = {}) {
const search = await yts.search({query, hl: 'es', gl: 'ES', ...options});
return search.videos;
}

function MilesNumber(number) {
const exp = /(\d)(?=(\d{3})+(?!\d))/g;
const rep = '$1.';
const arr = number.toString().split('.');
arr[0] = arr[0].replace(exp, rep);
return arr[1] ? arr.join('.') : arr[0];
}

function secondString(seconds) {
seconds = Number(seconds);
const d = Math.floor(seconds / (3600 * 24));
const h = Math.floor((seconds % (3600 * 24)) / 3600);
const m = Math.floor((seconds % 3600) / 60);
const s = Math.floor(seconds % 60);
const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
return dDisplay + hDisplay + mDisplay + sDisplay;
  }