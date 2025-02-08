import fs from 'fs';
import syntaxError from 'syntax-error';
import path from 'path';
import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(_exec).bind(cp);
let handler = async (m, { conn, text }) => {
    
    m.react(done)
    let sesi = await fs.readFileSync('./config.js')
    const { stdout, stderr } = await exec(`cat config.js`);
    
    m.reply(stdout.trim())
    m.reply(stderr.trim()) 
}

handler.command = /^(getcg|getfile)$/i
handler.rowner = true
export default handler