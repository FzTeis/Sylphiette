import fs from "fs";
import path from "path";
import archiver from "archiver";
import moment from "moment-timezone";
import * as glob from "glob";

let handler = async (m, { text }) => {
   try {
      m.react("⌛");
      
      moment.locale("es");
      const now = moment().tz("America/Mexico_City");
      const formattedDate = now.format("dddd D [de] MMMM [del] YYYY - h:mmA");
      
      const zipPath = "./backup.zip";
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", async () => {
         const fileSize = (archive.pointer() / (1024 * 1024)).toFixed(2) + " MB";
         await conn.sendMessage(m.chat, {
            document: fs.readFileSync(zipPath),
            mimetype: "application/zip",
            fileName: `Backup - ${formattedDate}.zip`,
            caption: `✅ *Backup Completado*\n📦 *Tamaño:* ${fileSize}`,
         });
         fs.unlinkSync(zipPath);
         m.react("☑️");
      });

      archive.on("error", (err) => {
         console.error(err);
         conn.sendMessage(m.chat, { text: "Ocurrió un error al crear el backup." });
      });

      archive.pipe(output);

      const rootDir = "./";
      const excludedDirs = ["node_modules", "aria2", "Data", "tmp", "mini.jpg", "downloads"];

      const allFiles = glob.sync("**/*", { cwd: rootDir, dot: false, nodir: true })
         .filter(file => !excludedDirs.some(dir => file.startsWith(dir)) && 
            file !== "package-lock.json" && 
            !path.basename(file).startsWith("."));

      allFiles.forEach(file => archive.file(path.join(rootDir, file), { name: file }));

      archive.finalize();
   } catch (e) {
      console.error(e);
      conn.sendMessage(m.chat, { text: "Error al generar el backup." });
   }
};

handler.command = ["backup"];
handler.help = ["backup"];
handler.tags = ["owner"];
handler.owner = true;
export default handler;