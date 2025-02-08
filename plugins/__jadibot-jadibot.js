import Jadibot from "../lib/jadibot.js";
import Jadibots from "../lib/jadibots.js";
let handler = async (m, { conn, text, usedPrefix, command }) => {
/*    if (conn.user.jid !== await Jadibots.conn?.user?.jid)
        throw m.reply(`!\nhttps://wa.me/${await conn.user?.jid.split("@")[0]}`);*/
    let who = text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : m.sender;
    if (!who || who === "@s.whatsapp.net") throw "Uhm.. el número introducido no es valido!"
 //   if (Jadibots.conns.has(who.split("@")[0])) throw "Uhm.. usted ya es un bot!"
    const usePairingCode = !/qr(?:\s?code)?/i.test(command);
    try {
        await Jadibot(who, conn, m, usePairingCode);
    } catch (e) {
        throw m.reply(e?.message || e);
    };
};

handler.help = handler.tags = ["jadibot"];
handler.command = /^(jadibot|code|serbot|qr)$/i;
handler.premium = false;
export default handler;