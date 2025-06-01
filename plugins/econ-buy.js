const precioDiamante = 200 
let handler = async (m, { conn, usedPrefix, command, args }) => {

  let user = global.db.data.users[m.chat][m.sender]
 
  if (!args[0]) throw `📌 Ejemplo de uso : *${usedPrefix + command}* all\n*${usedPrefix + command}* 8`;
  if (args[0].toLowerCase() !== 'all' && !/^[1-9]\d*$/.test(args[0])) throw `✳️ Ingresa una cantidad válida.`;

  let all =  Math.floor(user.coin / precioDiamante)
 let count = args[0].replace('all', all)
 count = Math.max(1, count)
 
  let totalCost = precioDiamante * count;
  if (user.exp >= totalCost) {
    user.exp -= totalCost;
    user.diamond += count;

    m.reply(`
≡ 🌿 \`${await style("Detalles de la compra :", 7)}\`

‣ Cantidad comprda : ${count.toLocaleString()} 💎 
‣ Total pagado : -${totalCost.toLocaleString()} 🪙
`);
  } else {
    m.reply(`❎ No tienes suficiente exp para comprar *${count}* 💎`);
  }

}
handler.help = ['buy']
handler.tags = ['economy']
handler.command = ['buy'] 
handler.disabled = false
export default handler