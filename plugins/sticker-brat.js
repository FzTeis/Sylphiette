import { Sticker } from 'wa-sticker-formatter';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (m.quoted && m.quoted.text) {
        text = m.quoted.text || 'Que';
    } else if (!text) {
        return m.reply('🌿 Responde a un mensaje o ingresa un texto.');
    }
    try {
        await m.react(rwait)
        const apiUrl = `https://rest.cloudkuimages.com/api/maker/bratanime?text=${encodeURIComponent(text)}`;
        
        let stiker = await createSticker(apiUrl, '', footer, 100);
        if (stiker) await conn.sendFile(m.chat, stiker, '', '', m);
        m.react(done)
    } catch (e) {
        console.error(e);
        m.reply('Se produjo un error, inténtelo de nuevo más tarde!');
    }
};

handler.help = ['brat'];
handler.tags = ['sticker'];
handler.command = /^(brat)$/i;
export default handler;

async function createSticker(url, packName, authorName, quality) {
    let res = await fetch(url);
    let buffer = await res.buffer(); 
    let stickerMetadata = {
        type: 'full',
        pack: packName,
        author: authorName,
        quality: 100
    };
    return (new Sticker(buffer, stickerMetadata)).toBuffer();
}