let handler = async (m, { conn, args, command }) => {
  if (!args[0]) throw `🌱 Ingresa un texto. Ejemplo: ${command} Sylphiette`
  let url = 'https://api.nekorinn.my.id/ai-img/capcut-genimage?text=' + encodeURIComponent(args.join(' '));
  await conn.sendMessage(m.chat, { image: { url } }, { quoted: m });
};
handler.help = ['cimage'];
handler.command = ['cimage', 'cimg'];
handler.tags = ['tools']
export default handler;