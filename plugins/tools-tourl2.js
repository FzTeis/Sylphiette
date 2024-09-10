import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import os from 'os';
import path from 'path';

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw `✳️ ${mssg.replyVideo}`;

  // Descargar el archivo del mensaje
  let media = await q.download();

  // Crear una ruta temporal en el sistema
  let tempFilePath = path.join(os.tmpdir(), 'tempfile');
  fs.writeFileSync(tempFilePath, media);

  // Crear FormData y añadir el archivo
  let form = new FormData();
  form.append('file', fs.createReadStream(tempFilePath));

  try {
    // Subir el archivo a FileTransfer.io
    let response = await axios.post('https://filetransfer.io/api-upload-file', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    if (!response.data || !response.data.url) throw '❌ Error al subir el archivo';

    // Extraer el enlace directo de la respuesta
    let link = response.data.url;

    // Eliminar el archivo temporal después de subir
    fs.unlinkSync(tempFilePath);

    // Responder con la información del archivo
    m.reply(`❖ ${media.length} Byte(s)❖ (Archivo subido a FileTransfer.io) ❖ URL: ${link} `);
 } catch (error) { console.error('Error al subir el archivo:', error.message); throw '❌ Error al subir el archivo a FileTransfer.io'; 
}
 };
handler.help = ['tourl'];
handler.tags = ['tools']; handler.command = ['upload2', 'tourl2'];
export default handler;