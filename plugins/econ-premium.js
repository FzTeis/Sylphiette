const pHora = 30;
const pDia = 700;
const cHora = 1;  
const cDia = 20;  

let handler = async (m, { conn, usedPrefix, command, args }) => {

  let texto = `
≡ 🍁 \`Opciones disponibles para comprar premium :\`

° *h :* Horas = ${pHora} diamantes
° *d :* Días = ${pDia} diamantes

🌲 Ejemplo :
${command} 1 h ---> 1 hora premium.
${command} 1 d ---> 1 día premium.

${footer}
`;
  let name = await conn.getName(m.sender);
  if (!args[0]) return conn.reply(m.chat, texto, fkontak);
  let type;
  let user = global.db.data.users[m.sender];
  if (isNaN(args[0])) return conn.reply(m.chat, `🌷 Solo se aceptan números. Ejemplo:\n${command} 1 h`, fkontak);
  let kk = args[1] || "h";
  let precio = kk === "h" ? pHora : pDia;
  let comision = kk === "h" ? cHora : cDia; 
  if (!args[1] || (args[1] !== "h" && args[1] !== "d")) {
    return conn.reply(m.chat, `🍁 Formato no válido.`, fkontak);
  }
  if (user.diamond < (precio + comision)) {
    return conn.reply(m.chat, `🏦 No tienes suficientes diamantes para comprar premium!`, fkontak);
  }
  let tiempo;
  if (args[1] === "h") {
    tiempo = 3600000 * args[0];
    let now = new Date() * 1
    if (now < user.premiumTime) user.premiumTime += tiempo;
    else user.premiumTime = now + tiempo;
    user.premium = true;
    user.diamond -= (pHora * args[0]) + (cHora * args[0]);
    type = "Hora(s)";
  } else if (args[1] === "d") {
    tiempo = 86400000 * args[0];
    let now = new Date() * 1
    if (now < user.premiumTime) user.premiumTime += tiempo;
    else user.premiumTime = now + tiempo;
    user.premium = true;
    user.diamond -= (pDia * args[0]) + (cDia * args[0]); 
    type = "Día(s)";
  }
  let cap = `
  \`\`\`乂 B U Y  -  ＰＲＥＭＩＵＭ\`\`\`

≡ 🌿 \`Usuario :\` @${m.sender.split`@`[0]}
≡ 🍂 \`Tiempo Premium :\` ${args[0]} ${type}
≡ 🌾 \`Total a pagar :\` ${precio * args[0] + comision * args[0]} diamantes
≡ 🌴 \`Diamantes :\` ${user.diamond}
≡ 🌳 \`Tenía :\` ${user.diamond + precio * args[0] + comision * args[0]}
≡ 🎍 \`Comisión :\`  -${comision * args[0]} (incluida) 💎

${footer}
`;
conn.sendMessage(m.chat, { image: await (await fetch(menu)).buffer(), caption: cap, mentions: [m.sender] }, { quoted: fkontak });
};

handler.tags = ['prem', 'econ'];
handler.help = ['premium'];
handler.command = ['buyprem', 'premium', 'prem'];
handler.register = true;
export default handler;