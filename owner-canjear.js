let handler = async (m, {conn, text, usedPrefix}) => {	
if (!text) throw `Por favor ingresa el código de canjeo asignado `;
const user = global.db.data.users[m.sender];
if (!text === '0987123ABC') {
    if (user.hero === 0) {
      // Si ya ha utilizado el canjeo, mostrar un mensaje de error
      m.reply('Ya haz utilizado el canjeo');
      //console.log('Ya has utilizado el canjeo');
    } else {
      // Realizar el canjeo
      global.db.data.users[m.sender].coin += 150000;
      // Mostrar un mensaje de éxito
      m.reply(m.chat, '¡Canjeo realizado con éxito! Puedes verificar utilizando #bal', m);
      user.hero = 0
     // console.log('Canjeo realizado con éxito');
    }
} else { 
m.reply(m.chat, 'Codigo incorrecto', m);
}
}
handler.command = ['canjear'] 
export default handler