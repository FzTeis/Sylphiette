import { spawn, exec, execSync } from 'child_process';

let handler = async (m, { conn }) => {
    let start = Date.now(); 

    exec(`neofetch --stdout`, (error, stdout, stderr) => {
        let end = Date.now(); 
        let duration = end - start;

        let child = stdout.toString("utf-8");
        let ssd = child.replace(/Memory:/, "Ram:");

        m.reply(`🟢 *Ping* : ${duration} _ms_\n${ssd}`);
    });
};

handler.help = ['ping'];
handler.tags = ['main'];
handler.command = ['ping', 'speed'];

export default handler;