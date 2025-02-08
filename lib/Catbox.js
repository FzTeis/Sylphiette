/**********************************************************************************
Made By: https://github.com/looolsa/Abstract-All-Bot
**********************************************************************************/

import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { fileTypeFromBuffer } from 'file-type';
import crypto from 'crypto';

/**
 * Upload file to Catbox
 * Supported mimetypes:
 * - `image/jpeg`
 * - `image/jpg`
 * - `image/png`
 * - `video/mp4`
 * - `video/webm`
 * - `audio/mpeg`
 * - `audio/wav`
 * @param {Buffer} buffer File Buffer
 * @return {Promise<string>}
 */

const Catbox = async (buffer) => {
  try {
    const { ext, mime } = await fileTypeFromBuffer(buffer) || {};
    const form = new FormData();
    const blob = new Blob([buffer.toArrayBuffer()], { type: mime });
    const randomBytes = crypto.randomBytes(5).toString("hex");
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', blob, randomBytes + "." + ext);
    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
      }
    });
    if (!res.ok) {
      throw new Error(`Error al subir el archivo: ${res.statusText}`);
    }
    return await res.text(); 
  } catch (error) {
    console.error('Error al subir el archivo a Catbox:', error);
    throw error;
  }
};

export default Catbox;