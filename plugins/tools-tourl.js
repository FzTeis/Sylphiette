import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import mime from "mime-types";

let handler = async (m, { conn, args, usedPrefix }) => {
  if (!m.quoted) throw `☘️ Responde a una imagen o vídeo usando el comando.`;

  if (!args[0]) throw `🌳 Elige una de las siguientes opciones:

▸ \`CloudMini :\` *1 ( imagen & vídeo )*
▸ \`Telegra :\` *2 ( imagen )*
▸ \`CatBox :\` *3 ( imagen & vídeo )*

## \`Ejemplo :\` ${usedPrefix}tourl 1
`;

  if (!m.quoted.mimetype?.includes("image") && !m.quoted.mimetype?.includes("video"))
    throw `☘️ Solo se aceptan imágenes o vídeos.`;

  let buffer = await m.quoted.download();
  let ext = mime.extension(m.quoted.mimetype) || "bin";
  const path = `./downloads/temp_${Date.now()}.${ext}`;
  fs.writeFileSync(path, buffer);

  try {
    let info;
    if (args[0] === "1") {
      info = await cloudmini(path);
    } else if (args[0] === "2") {
      info = await telegra(path);
    } else {
      info = await catbox(path);
    }
    m.reply(`☘️ \`URL :\` ${info}`);
  } finally {
    fs.unlinkSync(path);
  }
};

handler.help = handler.command = ["tourl"];
handler.tags = ["tools"];
export default handler;

async function telegra(path) {
  try {
    let data = new FormData();
    data.append("images", fs.createReadStream(path));

    let response = await axios.post("https://telegraph.zorner.men/upload", data, {
      headers: data.getHeaders(),
    });

    return response.data.links[0];
  } catch (err) {
    throw new Error(err.message);
  }
}

async function cloudmini(path) {
  try {
    const file_type = path.split(".").pop();
    const file_name = path.split("/").pop();
    const unique_id = randomKarakter(2) + (file_type + file_name).length;

    const form = new FormData();
    form.append("file", fs.createReadStream(path), `${unique_id}.${file_type}`);

    const response = await axios.post("https://files.cloudmini.net/upload", form, {
      headers: form.getHeaders(),
    });

    const { filename } = response.data;
    return `https://files.cloudmini.net/download/${filename}`;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function catbox(path) {
  const data = new FormData();
  data.append("reqtype", "fileupload");
  data.append("userhash", "");
  data.append("fileToUpload", fs.createReadStream(path));

  const response = await axios.post("https://catbox.moe/user/api.php", data, {
    headers: {
      ...data.getHeaders(),
      "User-Agent": "Mozilla/5.0",
    },
  });

  return response.data;
}

function randomKarakter(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}