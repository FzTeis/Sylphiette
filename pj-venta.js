import fs from 'fs/promises'

let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Debes escribir el nombre del personaje y el precio que deseas establecer para la venta.\nEjemplo: #vender Roxy Migurdia 10000', m)
    }

    let parts = text.split(' ')
    let comando = parts[0]
    let nombrePersonaje = parts.slice(1, -1).join(' ')
    let precio = parseInt(parts[parts.length - 1])

    if (comando === '-set' || comando === 'set') {
        if (isNaN(precio) || precio <= 0) {
            return conn.reply(m.chat, '❌ Debes ingresar un precio válido para la venta del personaje.', m)
        }

        try {
            let userId = m.sender
            let pjVenta = await fs.readFile('./src/pj_venta.json', 'utf-8')
            let pjVentaObj = JSON.parse(pjVenta)

            if (!pjVentaObj[nombrePersonaje] || pjVentaObj[nombrePersonaje].userId !== userId) {
                return conn.reply(m.chat, `❌ No tienes el personaje "${nombrePersonaje}" en venta o no tienes permiso para modificar el precio.`, m)
            }

            pjVentaObj[nombrePersonaje].precio = precio
            await fs.writeFile('./src/pj_venta.json', JSON.stringify(pjVentaObj, null, 2))

            let mensaje = `✅ *Has actualizado el precio de ${nombrePersonaje} a ${precio} monedas.*\n\n` +
                `El nuevo precio ha sido establecido correctamente.`

            await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })
        } catch (error) {
            console.error('Error al actualizar el precio:', error)
            return conn.reply(m.chat, '❌ Hubo un error al procesar la actualización del precio.', m)
        }
    } else {
        let nombrePersonaje = parts.slice(0, -1).join(' ')
        let precio = parseInt(parts[parts.length - 1])

        if (isNaN(precio) || precio <= 0) {
            return conn.reply(m.chat, '❌ Debes ingresar un precio válido para la venta del personaje.', m)
        }

        try {
            let userId = m.sender
            let userData
            try {
                userData = await fs.readFile('./src/userData.json', 'utf-8')
            } catch (error) {
                return conn.reply(m.chat, '❌ No tienes personajes para vender, o el archivo de usuarios no está disponible.', m)
            }

            let userDataObj = JSON.parse(userData)

            if (!userDataObj[userId] || !userDataObj[userId].personajes) {
                return conn.reply(m.chat, '❌ No tienes personajes para vender.', m)
            }

            let personajes = userDataObj[userId].personajes
            let personaje = personajes[nombrePersonaje]

            if (!personaje) {
                return conn.reply(m.chat, `❌ No tienes el personaje "${nombrePersonaje}" para vender.`, m)
            }

            let pjVenta = {}
            try {
                pjVenta = await fs.readFile('./src/pj_venta.json', 'utf-8')
            } catch (error) {
                pjVenta = '{}'
            }

            let pjVentaObj = JSON.parse(pjVenta)

            if (!pjVentaObj[nombrePersonaje]) {
                pjVentaObj[nombrePersonaje] = {
                    ...personaje,
                    precio: precio,
                    userId: userId
                }
            }

            await fs.writeFile('./src/pj_venta.json', JSON.stringify(pjVentaObj, null, 2))

            delete userDataObj[userId].personajes[nombrePersonaje]
            userDataObj[userId].poder -= personaje.power

            await fs.writeFile('./src/userData.json', JSON.stringify(userDataObj, null, 2))

            let mensaje = `✅ *Has puesto en venta a ${nombrePersonaje} por ${precio} monedas.*\n\n` +
                `El personaje está ahora disponible para otros usuarios. ¡Buena suerte con la venta!`

            await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })
        } catch (error) {
            console.error('Error al vender personaje:', error)
            return conn.reply(m.chat, '❌ Hubo un error al procesar la venta.', m)
        }
    }
}

handler.help = handler.command = ['vender', 'v']
handler.tags = ['pj']
export default handler