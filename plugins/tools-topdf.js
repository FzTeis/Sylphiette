import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
const handler = async (m, { conn, command, text }) => {
    try {
        if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.startsWith('image/')) {
            return m.reply(`🌱 Responde a una imagen usando el comando: ${command}`);
        }
        m.react("⌛")
        const imageBuffer = await m.quoted.download();
        const downloadsDir = './downloads';
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir, { recursive: true });
        }
        const name = text ? text : 'sylph-pdf';
        const pdfPath = path.join(downloadsDir, `${name}.pdf`);
        const pdfDoc = new PDFDocument();
        const writeStream = fs.createWriteStream(pdfPath);
        pdfDoc.pipe(writeStream);
        pdfDoc.image(imageBuffer, {
            fit: [500, 500], 
            align: 'center',
            valign: 'center'
        });
        pdfDoc.end();
        await new Promise((resolve) => writeStream.on('finish', resolve));
        await conn.sendMessage(m.chat, {
            document: fs.readFileSync(pdfPath),
            mimetype: 'application/pdf',
            fileName: `${name}.pdf`,
            caption: 'Aquí tienes tu PDF'
        }, { quoted: m });
        fs.unlinkSync(pdfPath);
        m.react("☑️")
    } catch (error) {
        console.error(error);
        m.reply('Se produjo un error al convertir la imagen a PDF.');
    }
};
handler.command = ['topdf'];
handler.tags = ['tools'];
handler.help = ['topdf'];
export default handler;