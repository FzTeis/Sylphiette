let handler = async (m, { conn, usedPrefix, command }) => {
   let user = db.data.users[m.sender]
   function explorarMazmorra(usuario) {
  const coinsEncontradas = randomNumber(834, 4930); // Genera una cantidad aleatoria de monedas
  // Añade las monedas al usuario

  const probabilidadMonstruo = randomNumber(1, 100); // Probabilidad de encontrar un monstruo

  if (probabilidadMonstruo <= 56) { // Probabilidad de 30% de encontrar un monstruo
    const fuerzaUsuario = randomNumber(10, user.mana); // Fuerza del usuario
    const fuerzaMonstruo = randomNumber(50, 90); // Fuerza del monstruo

    if (fuerzaUsuario > fuerzaMonstruo) {
      // El usuario mata al monstruo y recibe un bono extra
      const bonoExtra = randomNumber(500, 10000);
      global.db.data.users[m.sender].coin += bonoExtra;
      return `> ¡Encontraste un monstruo! Lo derrotaste y encontraste ${coinsEncontradas} monedas más ${bonoExtra} como bono extra.`;
    } else {
      // El monstruo mata al usuario y pierde la recompensa
      global.db.data.users[m.sender].coin -= coinsEncontradas;
      return `> ¡Encontraste un monstruo! El monstruo te derrotó y perdiste ${coinsEncontradas} monedas.`;
    
    }
  } else {
    // No se encuentra ningún monstruo
    return `> ¡Exploraste la mazmorra y encontraste ${coinsEncontradas} monedas!`;
    global.db.data.users[m.sender].coin += coinsEncontradas; 
  }
}
const result = explorarMazmorra(m.sender)
await conn.reply(m.chat, result, m)
}
handler.help = ['mazmorra']
handler.tags = ['econ']
handler.command = ['explorar', 'mazmorra']

export default handler
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}