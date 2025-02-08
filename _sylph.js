import axios from 'axios';

const headers = {
  'authority': 'labs.writingmate.ai',
  'accept': '*/*',
  'content-type': 'application/json',
  'origin': 'https://labs.writingmate.ai',
  'referer': 'https://labs.writingmate.ai/share/JyVg?__show_banner=false',
  'user-agent': 'Postify/1.0.0',
};

const mateai = async (array) => {
    const data = {
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "image_text_analysis",
                strict: true,
                schema: {
                    type: "object",
                    properties: { description: { type: "string" } },
                    required: ["description"],
                    additionalProperties: false
                }
            }
        },      
        chatSettings: {
            model: "gpt-4o",
            temperature: 0.7,
            contextLength: 16385,
            includeProfileContext: false,
            includeWorkspaceInstructions: false,
            embeddingsProvider: "openai"
        },      
        messages: array,
        customModelId: ""
    };

    try {
        const response = await axios.post('https://labs.writingmate.ai/api/chat/public', data, { headers }).catch(e => e.response);
        return response.data;
    } catch (error) {
        throw new Error(`${error.message}`);
    }
};

export async function before(m, { conn }) {
if (m.fromMe) {
return
}
    let chat = global.db?.data?.chats?.[m.chat];
    if (!chat) return;
    try {
        if (m.isGroup && !chat.isBanned) {
            let mentioned = m.mentionedJid || [];
            let botMentioned = mentioned.includes(conn.user.jid);
            if (!conn.sylph) conn.sylph = {};
            if (!conn.sylph[m.sender]) {
                conn.sylph[m.sender] = [{
                    role: 'system',
                    content: `Eres Sylph, una inteligencia artificial creada por i'm Fz (también conocido como "Tesis" o "Fz"). Responde de manera clara y concisa. El nombre del usuario será: ${conn.getName(m.sender)}`,
                }];
            }
           if (conn.sylph[m.sender].length > 10) {
                conn.sylph[m.sender] = conn.sylph[m.sender].slice(-10);
            }

            let userText = null;
            if (botMentioned) {
                userText = m.text.replace(new RegExp(`@${conn.user.jid.split('@')[0]}`, 'gi'), '').trim();
            }
            else {
                let match = m.text.match(/\b(sylph|sylphiette)\b[\s]*([\s\S]*)/i);
                if (match) {
                    userText = match[2].trim();
                }
            }

            if (!userText) return;
            await conn.sendPresenceUpdate('composing', m.chat)
            let msg = [...conn.sylph[m.sender]];
            let userInput = {
                role: "user",
                content: userText,
            };
            msg.push(userInput);
            let data = await mateai(msg);
            let responseMessage = data.description || "Ocurrió un error...";
            conn.sylph[m.sender].push({ role: "system", content: responseMessage });
            await m.reply(responseMessage);
        }
    } catch (e) {
        m.reply(`Error: ${e.message}`);
    }
    return !0;
}