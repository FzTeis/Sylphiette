let handler = m => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems}) {
  const chat = global.db.data.chats[m.chat]
  const bot = global.db.data.settings[conn.user.jid] || {}

  const hl = global.prefix
  const adminMode = global.db.data.chats[m.chat].modoadmin
  const hm = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || hl ||  m.text.slice(0, 1) == hl || plugins.command}`

  if (m.isGroup) {
    if (adminMode && !isOwner && !isROwner && !isAdmin && hm) return
    if (!isBotAdmin) return
  } else {
    if (isOwner || isROwner || isPrems) return
  }
}

export default handler