import fs from 'fs/promises'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let pagina = parseInt(text.split(' ')[1]) || 1
    let msg = `¡Hola! @${m.sender.split('@')[0]}, a continuación te muestro una lista de los personajes.\nPara ver la siguiente página usa: ${usedPrefix + command} 2 - 3 - 4 - etc...\n\n`

    if (text.includes('-o') || text === 'o') {
        let perso = await getVenta(pagina)
        msg += perso
    } else {
        let perso = await getInfo(pagina)
        msg += perso
    }

    conn.reply(m.chat, msg, m, { mentions: conn.parseMention(msg) })
}

handler.help = handler.command = ['tienda', 'shop']
handler.tags = ['pj']
export default handler

async function getInfo(pagina) {
    try {
        let data = await fs.readFile('./src/person.json', 'utf-8')
        let pjs = JSON.parse(data)

        let perso = Object.entries(pjs).map(([nombre, datos]) => ({
            nombre,
            tipo: datos.tipo,
            rareza: datos.rareza,
            img: datos.img,
            ataques: datos.ataques,
            valor: datos.valor,
            poder: datos.poder,
            status: datos.status
        }))

        let disp = perso.filter(pj => pj.status === false)
        let limit = 10
        let inicio = (pagina - 1) * limit
        let fin = inicio + limit
        let selec = disp.slice(inicio, fin)

        if (selec.length === 0) return 'No hay más personajes disponibles en esta página.'

        return selec.map((pj, i) => 
            `*${inicio + i + 1}.* Nombre: ${pj.nombre}\n` +
            `   🏹 *Tipo:* ${pj.tipo}\n` +
            `   🌟 *Rareza:* ${pj.rareza}\n` +
            `   ⚡ *Poder:* ${pj.poder}\n` +
            `   💰 *Valor:* ${pj.valor} monedas\n` +
            `   🗡️ *Ataques:*\n` + 
            `${Object.entries(pj.ataques).map(([nombre, daño]) => `     - ${nombre}: ${daño} daño`).join('\n')}\n` +
            `   🖼️ *Imágenes:*\n   ${pj.img.join('\n   ')}\n`
        ).join('\n')

    } catch (error) {
        console.error('Error al leer el archivo JSON:', error)
        return 'Hubo un error al obtener la información.'
    }
}

async function getVenta(pagina) {
    try {
        let data = await fs.readFile('./src/pj_venta.json', 'utf-8')
        let pjs = JSON.parse(data)

        if (Object.keys(pjs).length === 0) {
            return 'No hay personajes a la venta por los usuarios.'
        }

        let perso = Object.entries(pjs).map(([nombre, datos]) => ({
            nombre,
            tipo: datos.tipo,
            rareza: datos.valor > 50000 ? 'Legendario' : 'Común', // Asumiendo que los valores más altos son legendarios
            img: datos.img,
            ataques: {}, // No tenemos ataques para los personajes a la venta
            valor: datos.precio,
            poder: datos.power,
            status: true
        }))

        let limit = 10
        let inicio = (pagina - 1) * limit
        let fin = inicio + limit
        let selec = perso.slice(inicio, fin)

        if (selec.length === 0) return 'No hay más personajes disponibles en esta página.'

        return selec.map((pj, i) => 
            `*${inicio + i + 1}.* Nombre: ${pj.nombre}\n` +
            `   🏹 *Tipo:* ${pj.tipo}\n` +
            `   🌟 *Rareza:* ${pj.rareza}\n` +
            `   ⚡ *Poder:* ${pj.poder}\n` +
            `   💰 *Valor:* ${pj.valor} monedas\n` +
            `   🖼️ *Imágenes:*\n   ${pj.img}\n`
        ).join('\n')

    } catch (error) {
        console.error('Error al leer el archivo de personajes a la venta:', error)
        return 'Hubo un error al obtener la información de personajes a la venta.'
    }
}