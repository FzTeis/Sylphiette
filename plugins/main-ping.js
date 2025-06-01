import speed from 'performance-now'
import { exec } from 'child_process'

let handler = async (m, { conn }) => {
    let timestamp = speed();
    let sentMsg = await conn.reply(m.chat, '\`\`\`🏓 Calculando ping...\`\`\`', m);

    let latency = speed() - timestamp;

    exec('neofetch --stdout', (error, stdout, stderr) => {
        let info = stdout.toString('utf-8').replace(/Memory:/, 'Ram:');
        let result = `🌿  \`Ping :\` \`\`\`${latency.toFixed(1)} ms\`\`\`\n${info}`;
        conn.sendMessage(m.chat, { text: result, edit: sentMsg.key }, { quoted: m });
    });
};

handler.help = ['ping'];
handler.tags = ['main'];
handler.command = ['ping', 'p', 'speed'];

export default handler;