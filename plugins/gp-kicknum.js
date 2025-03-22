const handler = async (m, {conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin}) => {
  if (!args[0]) return conn.reply(m.chat, `🌷 Ingrese algún prefijo de un país para ejecutar el comando.`, m);
  if (isNaN(args[0])) return conn.reply(m.chat, `🍬 Ingrese algún prefijo de un país\nEjemplo: ${usedPrefix + command} 58`, m);
  const lol = args[0].replace(/[+]/g, '');
  const ps = participants.map((u) => u.id).filter((v) => v !== conn.user.jid && v.startsWith(lol));
  const bot = global.db.data.settings[conn.user.jid] || {};
  if (ps.length === 0) return m.reply(`🌱 *Aquí no hay ningún número con el prefijo +${lol}*`);
  
  const numeros = ps.map((v) => '⭔ @' + v.replace(/@.+/, ''));
  const delay = (time) => new Promise((res) => setTimeout(res, time));

  switch (command) {
    case 'listanum': case 'listnum':
      conn.reply(m.chat, `📦 *Lista de números con el prefijo +${lol} que están en este grupo: ${ps.length}*\n\n` + numeros.join`\n`, m, {mentions: ps});
      break;

    case 'kicknum':
      if (!bot.restrict) return conn.reply(m.chat, '🍬 *¡Este comando está deshabilitado por el propietario del bot!*', m);
      if (!isBotAdmin) return m.reply('🌾 *El bot no es admin*');
      await conn.reply(m.chat, `♻️ *Iniciando eliminación....*`, m);
      const ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net';
      const users = ps;
      
      for (const user of users) {
        const error = `@${user.split('@')[0]} ya ha sido eliminado o ha abandonado el grupo...`;
        if (user !== ownerGroup && user !== global.conn.user.jid && user !== global.owner + '@s.whatsapp.net' && user !== isSuperAdmin && isBotAdmin && bot.restrict) {
          await delay(2000);
          const responseb = await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
          if (responseb[0].status === '404') m.reply(error, m.chat, {mentions: conn.parseMention(error)});
          await delay(10000);
        } else return m.reply('⚠️ *Ocurrió un error.*', m);
      }
      break;
  }
};
handler.help = handler.command = ['kicknum', 'listnum', 'listanum'];
handler.tags = ['group'];
handler.group = true;
handler.botAdmin = true;
handler.admin = true;
handler.fail = null;
export default handler;