let cooldown = 120000 
let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.chat][m.sender]
  if (new Date() - user.lastmiming < cooldown) throw `⏳ Regresa en *${msToTime((user.lastmiming + cooldown) - new Date())}* para volver a entrar a la mina.`

  let events = [
    { type: 'coin', chance: 60, amount: () => Math.floor(Math.random() * 6000) + 2000 }, 
    { type: 'chest_exp', chance: 15, amount: () => Math.floor(Math.random() * 2000) + 500 }, 
    { type: 'chest_monster', chance: 5, monster: 'Goblin', expGain: () => Math.floor(Math.random() * 800) + 200 }, 
    { type: 'monster_escape', chance: 10, monster: 'Dragón', expLost: () => Math.floor(Math.random() * 3000) + 1000, expBeforeEscape: 0 }, 
    { type: 'cave', chance: 10, amount: () => Math.floor(Math.random() * 4000) + 1000 },  
  ];

  let event = events.find(e => Math.random() * 100 < e.chance);

  if (event) {
    switch (event.type) {
      case 'coin':
        let coinAmount = event.amount();
        user.coin += coinAmount;
        m.reply(`⛏️ Encontraste una veta! Obtuviste *${coinAmount} xp*`);
        break;

      case 'chest_exp':
        let expAmount = event.amount();
        user.exp += expAmount;
        m.reply(`✨ Encontraste un cofre brillante! Obtuviste *${expAmount} EXP*`);
        break;

      case 'chest_monster':
        let monster = event.monster;
        let expGoblin = event.expGain();
        user.exp += expGoblin;
        m.reply(`⚔️ Encontraste un cofre, ¡pero un *${monster}* salió! Lo derrotaste y ganaste *${expGoblin} EXP*`);
        break;

      case 'monster_escape':
        let monsterEscape = event.monster;
        let expLost = event.expLost();
        event.expBeforeEscape = Math.floor(Math.random() * expLost);

        let coinBeforeEscape = Math.floor(Math.random() * expLost);

        user.coin += coinBeforeEscape;
        m.reply(`🔥 ¡Un *${monsterEscape}* apareció de repente!  Lograste escapar con *${coinBeforeEscape} xp*, pero perdiste la oportunidad de obtener más.`);
        break;

      case 'cave':
        let caveAmount = event.amount();
        user.coin += caveAmount;
        m.reply(`🌌 Encontraste una cueva misteriosa! Obtuviste *${caveAmount} 🪙*`);
        break;
    }
  } else {
    let hasil = Math.floor(Math.random() * 4000) + 500;
    user.coin += hasil;
    m.reply(`⛏️ Buscaste diligentemente y encontraste *${hasil} xp*`);
  }

  user.lastmiming = new Date().getTime()
}
handler.help = ['mine']
handler.tags = ['economy']
handler.command = ['minar', 'miming', 'mine']

export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return minutes + ` m ` + seconds + ` s`
}