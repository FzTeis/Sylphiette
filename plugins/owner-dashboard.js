import { createCanvas, loadImage } from 'canvas'

import moment from 'moment'
const chatHistory = {}
const activeChats = new Set()
const userStats = {}

let handler = async (m, { conn }) => {
  const MAX_CHAT_CAPACITY = 5000
  const STYLES = {
    colors: {
      bg: '#0A0F16', 
      header: '#111827',
      text: '#F3F4F6',
      textDim: '#4B5563',
      primary: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B', 
      danger: '#EF4444',
      border: '#1F2937',
      highlight: '#6366F1',
      muted: '#6B7280',
      chart: {
        primary: '#60A5FA',
        secondary: '#818CF8',
        tertiary: '#34D399'
      }
    },
    fonts: {
      mono: 'JetBrains Mono',
      sans: 'Inter'
    }
  }

  function sanitizeText(text) {
    if (!text) return ''
    return text
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
      .replace(/[^\w\s.,!?-]/g, '')
      .trim()
  }

  function getMessageStats(messages) {
    const stats = {
      total: messages.length,
      media: 0,
      text: 0,
      replies: 0,
      timeStats: {
        morning: 0,
        afternoon: 0, 
        evening: 0,
        night: 0
      }
    }

    messages.forEach(msg => {
      if (msg.mediaType) stats.media++
      else stats.text++
      if (msg.replyTo) stats.replies++
      
      const hour = moment(msg.timestamp).hour()
      if (hour >= 5 && hour < 12) stats.timeStats.morning++
      else if (hour >= 12 && hour < 17) stats.timeStats.afternoon++ 
      else if (hour >= 17 && hour < 22) stats.timeStats.evening++
      else stats.timeStats.night++
    })

    return stats
  }

  function getActivityScore(stats) {
    const now = moment()
    const lastMsg = moment(stats.lastActivity)
    const hoursDiff = now.diff(lastMsg, 'hours')
    const baseScore = stats.total * 10
    const timeMultiplier = Math.max(0.1, Math.min(1, 24 / (hoursDiff + 1)))
    return Math.round(baseScore * timeMultiplier)
  }

  async function saveMessage(sender, message, metadata = {}) {
    if (!chatHistory[sender]) chatHistory[sender] = []
    if (chatHistory[sender].length >= MAX_CHAT_CAPACITY) chatHistory[sender].shift()
    
    let profilePic = await conn.profilePictureUrl(
      sender.includes('@g.us') ? sender : metadata.number,
      'image'
    ).catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png")
    
    const messageData = {
      timestamp: new Date(),
      message: sanitizeText(message),
      name: sanitizeText(metadata.name || ''),
      number: metadata.number || '',
      profilePic: profilePic,
      mediaType: metadata.mediaType || null,
      mediaUrl: metadata.mediaUrl || null,
      mediaCaption: metadata.mediaCaption ? sanitizeText(metadata.mediaCaption) : null,
      replyTo: metadata.replyTo || null,
      messageId: metadata.messageId,
      isForwarded: metadata.isForwarded || false,
      reactions: metadata.reactions || []
    }

    chatHistory[sender].push(messageData)
    activeChats.add(sender)

    if (!userStats[sender]) {
      userStats[sender] = {
        firstSeen: new Date(),
        messageCount: 0,
        mediaCount: 0,
        activeStreak: 0,
        lastActivity: new Date()
      }
    }

    userStats[sender].messageCount++
    if (messageData.mediaType) userStats[sender].mediaCount++
    userStats[sender].lastActivity = new Date()
  }

  async function drawSystemMetrics(ctx, x, y, width) {
    const metrics = [
      {label: "CPU Usage", value: `${Math.round(process.cpuUsage().user / 1000000)}%`},
      {label: "Memory", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`},
      {label: "Active Chats", value: activeChats.size.toString()},
      {label: "Uptime", value: `${Math.floor(process.uptime() / 3600)}h`}
    ]

    ctx.save()
    ctx.fillStyle = STYLES.colors.header
    ctx.fillRect(x, y, width, 35)

    const metricWidth = width / metrics.length
    metrics.forEach((metric, i) => {
      const metricX = x + (i * metricWidth)
      ctx.fillStyle = STYLES.colors.textDim
      ctx.font = '12px ' + STYLES.fonts.mono
      ctx.fillText(metric.label, metricX + 15, y + 22)
      ctx.fillStyle = STYLES.colors.chart.primary
      ctx.fillText(metric.value, metricX + metricWidth - 60, y + 22)
    })
    ctx.restore()
  }

  async function generateDashboard() {
    const canvas = createCanvas(1400, 1000)
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = STYLES.colors.bg
    ctx.fillRect(0, 0, 1400, 1000)

    ctx.fillStyle = STYLES.colors.header
    ctx.fillRect(0, 0, 1400, 60)

    const buttons = [
      {color: STYLES.colors.danger, x: 25},
      {color: STYLES.colors.warning, x: 50}, 
      {color: STYLES.colors.success, x: 75}
    ]
    
    buttons.forEach(btn => {
      ctx.fillStyle = btn.color
      ctx.beginPath()
      ctx.arc(btn.x, 30, 6, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.fillStyle = STYLES.colors.textDim
    ctx.font = '13px ' + STYLES.fonts.mono
    ctx.fillText('system@whatsapp-analytics:~/dashboard $ monitor --realtime', 100, 35)

    await drawSystemMetrics(ctx, 0, 60, 1400)

    const contacts = Object.keys(chatHistory)
      .map(k => ({
        id: k,
        messages: chatHistory[k],
        stats: getMessageStats(chatHistory[k]),
        lastMsg: chatHistory[k].slice(-1)[0]
      }))
      .map(c => ({
        ...c,
        activityScore: getActivityScore({
          total: c.stats.total,
          lastActivity: c.lastMsg.timestamp
        })
      }))
      .sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, 12)

    let y = 150
    const columns = [
      {name: 'STATUS', width: 80},
      {name: 'USER', width: 60},
      {name: 'CONTACT', width: 240}, 
      {name: 'LAST MESSAGE', width: 320},
      {name: 'ACTIVITY', width: 180},
      {name: 'ANALYTICS', width: 400}
    ]

    ctx.fillStyle = STYLES.colors.highlight
    ctx.font = '12px ' + STYLES.fonts.mono
    let xPos = 25
    columns.forEach(col => {
      ctx.fillText(col.name, xPos, y)
      xPos += col.width + 20
    })

    ctx.strokeStyle = STYLES.colors.border
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(25, y + 10)
    ctx.lineTo(1375, y + 10)
    ctx.stroke()

    y += 40

    for(const contact of contacts) {
      const isGroup = contact.id.includes('@g.us')
      let xPos = 25

      ctx.fillStyle = contact.activityScore > 1000 ? STYLES.colors.success : STYLES.colors.textDim
      ctx.font = '12px ' + STYLES.fonts.mono
      ctx.fillText(contact.activityScore > 1000 ? 'ONLINE' : 'IDLE', xPos, y + 25)
      xPos += columns[0].width + 20

      try {
        ctx.save()
        ctx.beginPath()
        ctx.arc(xPos + 25, y + 25, 18, 0, Math.PI * 2)
        ctx.clip()
        const profilePic = await loadImage(contact.lastMsg.profilePic)
        ctx.drawImage(profilePic, xPos + 7, y + 7, 36, 36)
        ctx.restore()
      } catch {
        ctx.restore()
        ctx.fillStyle = STYLES.colors.header
        ctx.beginPath()
        ctx.arc(xPos + 25, y + 25, 18, 0, Math.PI * 2)
        ctx.fill()
      }
      xPos += columns[1].width + 20

      let name = ''
      try {
        name = isGroup
          ? sanitizeText((await conn.groupMetadata(contact.id)).subject)
          : sanitizeText(await conn.getName(contact.id))
      } catch {
        name = 'Unknown Contact'
      }

      ctx.fillStyle = isGroup ? STYLES.colors.primary : STYLES.colors.success
      ctx.fillText(isGroup ? '[GROUP]' : '[USER]', xPos, y + 25)
      ctx.fillStyle = STYLES.colors.text
      ctx.fillText(` ${name.slice(0, 28)}${name.length > 28 ? '...' : ''}`, xPos + 60, y + 25)
      xPos += columns[2].width + 20

      let preview = contact.lastMsg.message || ''
      if(contact.lastMsg.mediaType) {
        preview = `[${contact.lastMsg.mediaType.toUpperCase()}] ${contact.lastMsg.mediaCaption || ''}`
      }
      preview = preview.slice(0, 48) + (preview.length > 48 ? '...' : '')
      
      ctx.fillStyle = STYLES.colors.textDim
      ctx.fillText(preview, xPos, y + 25)
      xPos += columns[3].width + 20

      const time = moment(contact.lastMsg.timestamp)
      ctx.fillStyle = time.isSame(new Date(), 'hour') ? STYLES.colors.success : 
                     time.isSame(new Date(), 'day') ? STYLES.colors.primary :
                     STYLES.colors.textDim
      ctx.fillText(time.fromNow(), xPos, y + 25)
      xPos += columns[4].width + 20

      const stats = contact.stats
      const metrics = [
        {color: STYLES.colors.chart.primary, value: `MSG:${stats.total}`},
        {color: STYLES.colors.chart.secondary, value: `MEDIA:${stats.media}`},
        {color: STYLES.colors.chart.tertiary, value: `REPLIES:${stats.replies}`}
      ]

      metrics.forEach((metric, i) => {
        ctx.fillStyle = metric.color
        ctx.fillText(metric.value, xPos + (i * 120), y + 25)
      })

      ctx.strokeStyle = STYLES.colors.border
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(25, y + 45)
      ctx.lineTo(1375, y + 45)
      ctx.stroke()

      y += 60
    }

    ctx.fillStyle = STYLES.colors.header
    ctx.fillRect(0, 960, 1400, 40)

    const statusItems = [
      {color: STYLES.colors.primary, text: `[TIME] ${moment().format('YYYY-MM-DD HH:mm:ss')}`},
      {color: STYLES.colors.highlight, text: `[MEMORY] ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`},
      {color: STYLES.colors.success, text: `[CHATS] ${activeChats.size} active`},
      {color: STYLES.colors.chart.primary, text: `[MSG/s] ${(Object.values(chatHistory).reduce((sum, chat) => sum + chat.length, 0) / process.uptime()).toFixed(2)}`}, 
      {color: STYLES.colors.chart.secondary, text: '[MODE] Real-time monitoring'},
      {color: STYLES.colors.chart.tertiary, text: '[STATUS] System healthy'}
    ]

    statusItems.forEach((item, i) => {
      ctx.fillStyle = item.color
      ctx.font = '12px ' + STYLES.fonts.mono
      ctx.fillText(item.text, 25 + (i * 230), 985)
    })

    return canvas.toBuffer()
  }

  conn.ev.on('messages.upsert', async (upsert) => {
    const msg = upsert.messages[0]
    if (!msg.message) return
    
    const from = msg.key.remoteJid
    const body = msg.message?.conversation || 
                 msg.message?.imageMessage?.caption || 
                 msg.message?.videoMessage?.caption ||
                 msg.message?.extendedTextMessage?.text ||
                 msg.message?.documentMessage?.caption ||
                 msg.message?.audioMessage?.caption ||
                 '[Media]'
    
    const mediaType = msg.message.imageMessage ? 'image' :
                     msg.message.videoMessage ? 'video' :
                     msg.message.documentMessage ? 'document' :
                     msg.message.audioMessage ? 'audio' : 
                     msg.message.stickerMessage ? 'sticker' : null

    const replyTo = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? {
      text: msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation,
      sender: msg.message.extendedTextMessage.contextInfo.participant,
      messageId: msg.message.extendedTextMessage.contextInfo.stanzaId
    } : null

    await saveMessage(from, body, {
      name: msg.pushName,
      number: msg.key.participant || msg.key.remoteJid,
      mediaType: mediaType,
      mediaUrl: msg.message?.imageMessage?.url ||
                msg.message?.videoMessage?.url ||
                msg.message?.documentMessage?.url ||
                msg.message?.audioMessage?.url || null,
      mediaCaption: msg.message?.imageMessage?.caption ||
                   msg.message?.videoMessage?.caption ||
                   msg.message?.documentMessage?.caption ||
                   msg.message?.audioMessage?.caption || null,
      replyTo: replyTo,
      messageId: msg.key.id,
      isForwarded: msg.message?.extendedTextMessage?.contextInfo?.isForwarded || false,
      reactions: msg.message?.reactionMessage ? [{
        key: msg.message.reactionMessage.key,
        text: msg.message.reactionMessage.text
      }] : []
    })
  })

  const buffer = await generateDashboard()
  await conn.sendFile(m.chat, buffer, 'akano.png', '', m)
}

handler.help = handler.command =  ['dashboard', 'dash', 'i']
handler.tags = ['owner']
handler.owner = true
export default handler