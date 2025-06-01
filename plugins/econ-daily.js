let free = 2500
let cooldown = 86400000
let handler = async (m, {conn}) => {
  let user = global.db.data.users[m.chat][m.sender]
  if (new Date - user.lastclaim < cooldown) throw `🎁 Ya has reclamado tu recompensa diaria, vuelve en : *${msToTime((user.lastclaim + cooldown) - new Date())}*`
  user.exp += free
  m.reply(`
🎁 ¿Ya ha pasado un día? Toma tu recompensa :

🍄 Experiencia : +${free.toLocaleString()}`)
  user.lastclaim = new Date * 1
}
handler.help = ['daily']
handler.tags = ['economy']
handler.command = ['daily', 'claim'] 


export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return hours + ` h ` + minutes + ` m`
}