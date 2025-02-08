import { jidNormalizedUser } from "@whiskeysockets/baileys";
import Jadibots from "../lib/jadibots.js";
let handler = async (m, { usedPrefix }) => {
    const users = [...Jadibots.conns.entries()].map(([k, v]) => v.user);
    if (!users.length) throw "✦ No hay subbots por ahora."
    const text = `
*Lista de Jadibots*

${users.map((user, i) => `✧ ${i + 1}. @${user?.jid?.split?.("@")?.[0] ?? jidNormalizedUser(user?.id)?.split?.("@")?.[0] ?? user?.id}${user?.name ? ` (${user.name})` : ''}\n✦   https://wa.me/${parseInt(user?.jid ?? jidNormalizedUser(user?.id))}?text=${usedPrefix}menu`).join('\n')}
`;
conn.sendMessage(m.chat, {
 image: fs.readFileSync('./src/subbots_logo.jpg'),
 caption: text,
footer: `Powered By i'm Fz ~ | ${botName}`,
 contextInfo: {
mentionedJid: conn.parseMention(text),
forwardingScore: 999,
isForwarded: true,
externalAdReply: {
  showAdAttribution: true, 
  title: `🌱 Sylph | Subbots 🌱`,
  body: "I'm Fz ~",
  thumbnail: fs.readFileSync('./src/subbots.jpg'),
  sourceUrl: "https://whatsapp.com/channel/0029Va6InNBFCCoM9xzKFG3G",
  mediaType: 1,
  renderLargerThumbnail: false
}}, 
  buttons: [
  {
 buttonId: '.code',
 buttonText: {
displayText: 'SERBOT'
 },
 type: 1,
  },
  {
 buttonId: '.qr',
 buttonText: {
displayText: 'SERBOT QR'
 },
 type: 1,
  },
  {
 type: 4,
 nativeFlowInfo: {
name: 'single_select',
paramsJson: JSON.stringify({
  title: '¡Click Here!',
  sections: [
 {
title: 'Sylphiette | The Best',
highlight_label: '',
rows: [
  {
 header: '',
 title: 'OWNER',
 description: `¿Dudas o sugerencias? ¡Contáctame!`, 
 id: '.owner',
  },
  {
 header: '',
 title: 'MENU',
 description: `Muestra la lista completa de los comandos disponibles.`, 
 id: '.menu',
  },
],
 },
  ],
}),
 },
  },
  ],
  headerType: 1,
  viewOnce: true
})
}
handler.help = handler.command = ['bots', 'botlist', 'listjadibot']
handler.tags = ['bebot']
export default handler