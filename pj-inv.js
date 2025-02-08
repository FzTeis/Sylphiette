import fs from 'fs/promises'

let handler = async (m, { conn }) => {
    let userId = m.sender

    try {
        let userData
        try {
            userData = await fs.readFile('./src/userData.json', 'utf-8')
        } catch (error) {
            userData = '{}'
        }

        let userDataObj = JSON.parse(userData)

        if (!userDataObj[userId] || !userDataObj[userId].personajes) {
            return conn.reply(m.chat, '❌ No tienes personajes en tu inventario.', m)
        }

        let personajes = userDataObj[userId].personajes
        let poderTotal = userDataObj[userId].poder
        let mensaje = `¡Hola! @${m.sender.split('@')[0]}, aquí está tu inventario de personajes:\n\n`

        let count = 1
        for (let nombre in personajes) {
            let pj = personajes[nombre]
            let tipoEmoji = ''
            switch (pj.tipo.toLowerCase()) {
                case 'ataque':
                    tipoEmoji = '⚔️'
                    break
                case 'defensa':
                    tipoEmoji = '🛡️'
                    break
                case 'apoyo':
                    tipoEmoji = '💖'
                    break
                case 'magia':
                    tipoEmoji = '✨'
                    break
                default:
                    tipoEmoji = '🗡️'
            }

            mensaje += `${count}.- *${nombre}:*\n` +
                `${tipoEmoji} *Tipo:* ${pj.tipo}\n` +
                `⚡ *Poder:* ${pj.power}\n\n`
            count++
        }

        mensaje += `🌟 *Poder Total:* ${poderTotal}`

        conn.reply(m.chat, mensaje, m, { mentions: conn.parseMention(mensaje) })

    } catch (error) {
        console.error('Error al obtener el inventario:', error)
        return conn.reply(m.chat, '❌ Hubo un error al obtener tu inventario.', m)
    }
}

handler.help = handler.command = ['inv', 'inventario']
handler.tags = ['pj']
export default handler