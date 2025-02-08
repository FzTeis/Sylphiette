import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {

    function ZipFiles(directorio, name) {
        const zip = new AdmZip();

        function addFiles(directorio) {
            const archivos = fs.readdirSync(directorio);

            archivos.forEach((archivo) => {
                const rutaCompleta = path.join(directorio, archivo);

                if (archivo.startsWith('.') || archivo === 'node_modules') {
                    return;
                }

                const stats = fs.statSync(rutaCompleta);

                if (stats.isDirectory()) {
                    addFiles(rutaCompleta);
                } else {
                    zip.addLocalFile(rutaCompleta, path.relative('.', directorio));
                }
            });
        }

        addFiles(directorio);

        const zipPath = `${name}.zip`;
        zip.writeZip(zipPath);
        return zipPath;
    }

    try {
        const Base = '.'; // Directorio actual
        const name = 'Sylphiette_Respaldo';

        const rutaZip = ZipFiles(Base, name);

        const Sylphiette = fs.readFileSync(rutaZip);

        await conn.sendMessage(m.chat, { 
            document: Sylphiette, 
            mimetype: 'application/zip', 
            fileName: `${name}.zip`, 
            caption: "Aquí tienes los archivos"
        }, { quoted: m });

        fs.unlinkSync(rutaZip); // Eliminamos el archivo zip después de enviarlo
    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { text: 'Hubo un error al intentar generar o enviar el archivo zip.' }, { quoted: m });
    }
}

handler.tags = ['owner'];
handler.help = ['getfiless'];
handler.command = ['getfiless'];
handler.owner = true;

export default handler;