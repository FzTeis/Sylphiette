import { jidNormalizedUser } from "@whiskeysockets/baileys";
import Jadibots from "../lib/jadibots.js";
let handler = async (m, { conn, text, isOwner }) => {
let ya = text && m.quoted ? m.quoted.sender : text
    const parent = await Jadibots.conn;
    if (text === "@s.whatsapp.net") throw 'Numero no valido'
   // if (text !== conn.user?.jid && !isOwner) throw 'Solo puede ser usado por mi owner'
    const number = text ? text.split('@')[0] : m.quoted ? m.quoted.sender.split('@')[0] : m.sender.split('@')[0]; //jid.split('@')[0];
    if (!number) throw 'Numero no valido'
    if (!Jadibots.conns.has(number)) throw 'Bot no activo'
    await conn.reply(m.chat, "Goodbye bot!", m);
    await Jadibots.conns.get(number)?.end?.();
    await Jadibots.conns.delete(number);
};

handler.help = ["stopjadibot"];
handler.tags = ["bebot"];
handler.command = ['stop', 'delbot', 'delsub']

export default handler;