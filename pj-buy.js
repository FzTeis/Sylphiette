import fs from 'fs/promises'

let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ Debes escribir el nombre del personaje que deseas comprar.\nEjemplo: #comprar Roxy Migurdia', m)
    }

    try {
        let data, pjs
        let userId = m.sender

        if (text.includes('-o') || text === 'o') {
            data = await fs.readFile('./src/pj_venta.json', 'utf-8')
            pjs = JSON.parse(data)
            let personajeName = text.split(' ').slice(1).join(' ').toLowerCase()
            let personaje = Object.entries(pjs).find(([nombre]) => nombre.toLowerCase() === personajeName)

            if (!personaje) {
                return conn.reply(m.chat, `❌ El personaje "${text.split(' ').slice(1).join(' ')}" no está a la venta.`, m)
            }

            let [nombre, datos] = personaje
            let precio = datos.precio
            let sellerId = datos.userId
            let userCoins = global.db.data.users[userId].coin || 0

            if (userCoins < precio) {
                return conn.reply(m.chat, `❌ No tienes suficientes monedas para comprar a *${nombre}*.\n💰 Monedas necesarias: ${precio}\n🪙 Tus monedas: ${userCoins}`, m)
            }

            global.db.data.users[userId].coin -= precio
            global.db.data.users[sellerId].coin += precio

            let userData
            try {
                userData = await fs.readFile('./src/userData.json', 'utf-8')
            } catch (error) {
                userData = '{}'
            }

            let userDataObj = JSON.parse(userData)

            if (!userDataObj[userId]) {
                userDataObj[userId] = {
                    personajes: {},
                    poder: 0
                }
            }

            userDataObj[userId].personajes[nombre] = {
                power: datos.power,
                img: datos.img,
                valor: precio,
                tipo: datos.tipo
            }

            userDataObj[userId].poder += datos.power

            await fs.writeFile('./src/userData.json', JSON.stringify(userDataObj, null, 2))

            delete pjs[nombre]
            await fs.writeFile('./src/pj_venta.json', JSON.stringify(pjs, null, 2))

            let mensaje = `✅ *¡Has comprado a ${nombre}!*\n\n` +
                `🏹 *Tipo:* ${datos.tipo}\n` +
                `🌟 *Rareza:* ${datos.valor > 50000 ? 'Legendario' : 'Común'}\n` +
                `⚡ *Poder:* ${datos.power}\n` +
                `💰 *Costo:* ${precio} monedas\n\n` +
                `¡Disfruta de tu nuevo personaje!`

            if (datos.img) {
                await conn.sendFile(m.chat, datos.img, 'personaje.jpg', mensaje, m)
            } else {
                await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })
            }
        } else {
            data = await fs.readFile('./src/person.json', 'utf-8')
            pjs = JSON.parse(data)
            let personaje = Object.entries(pjs).find(([nombre]) => nombre.toLowerCase() === text.toLowerCase())

            if (!personaje) {
                return conn.reply(m.chat, `❌ El personaje "${text}" no existe en la tienda.`, m)
            }

            let [nombre, datos] = personaje
            if (datos.usser) {
                let msg = `❌ El personaje "${nombre}" ya fue comprado por el usuario: @${datos.usser}`
                return conn.reply(m.chat, msg, m, { mentions: conn.parseMention(msg) })
            }

            let userCoins = global.db.data.users[userId].coin || 0
            let precio = datos.valor

            if (userCoins < precio) {
                return conn.reply(m.chat, `❌ No tienes suficientes monedas para comprar a *${nombre}*.\n💰 Monedas necesarias: ${precio}\n🪙 Tus monedas: ${userCoins}`, m)
            }

            global.db.data.users[userId].coin -= precio

            datos.usser = userId.split('@')[0]
            datos.status = true

            await fs.writeFile('./src/person.json', JSON.stringify(pjs, null, 2))

            let userData
            try {
                userData = await fs.readFile('./src/userData.json', 'utf-8')
            } catch (error) {
                userData = '{}'
            }

            let userDataObj = JSON.parse(userData)

            if (!userDataObj[userId]) {
                userDataObj[userId] = {
                    personajes: {},
                    poder: 0
                }
            }

            userDataObj[userId].personajes[nombre] = {
                power: datos.poder,
                img: datos.img[0],
                valor: precio,
                tipo: datos.tipo
            }

            userDataObj[userId].poder += datos.poder

            await fs.writeFile('./src/userData.json', JSON.stringify(userDataObj, null, 2))

            let imagen = datos.img.length > 0 ? datos.img[0] : null
            let mensaje = `✅ *¡Has comprado a ${nombre}!*\n\n` +
                `🏹 *Tipo:* ${datos.tipo}\n` +
                `🌟 *Rareza:* ${datos.rareza}\n` +
                `⚡ *Poder:* ${datos.poder}\n` +
                `💰 *Costo:* ${precio} monedas\n\n` +
                `¡Disfruta de tu nuevo personaje!`

            if (imagen) {
                await conn.sendFile(m.chat, imagen, 'personaje.jpg', mensaje, m)
            } else {
                await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m })
            }
        }
    } catch (error) {
        console.error('Error al comprar personaje:', error)
        return conn.reply(m.chat, '❌ Hubo un error al procesar la compra.', m)
    }
}

handler.help = handler.command = ['comprar', 'c']
handler.tags = ['pj']
export default handler