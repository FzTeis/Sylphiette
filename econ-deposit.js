let handler = async (m, { args }) => {
   let user = global.db.data.users[m.sender]
   if (!args[0]) return m.reply('Ingresa la cantidad de dinero que deseas Depositar.')
   if (args[0] == 'all') {
      let count = parseInt(user.coin)
      user.coin -= count * 1
      user.bank += count * 1
      await m.reply(`*Depositaste ${count} de dinero al Banco.* 🍟`)
      return !0
   }
   if (!Number(args[0])) return m.reply('La cantidad deve ser un Numero.')
   let count = parseInt(args[0])
   if (!user.coin) return m.reply('No tienes dinero en la Cartera.')
   if (user.coin < count) return m.reply(`Solo tienes ${user.coin} de dinero en la Cartera.`)
   user.coin -= count * 1
   user.bank += count * 1
   await m.reply(`*Depositaste ${count} de dinero al Banco.* 🍟`)
}

handler.help = ['deposit']
handler.tags = ['econ']
handler.command = ['deposit', 'depositar', 'dep']
export default handler