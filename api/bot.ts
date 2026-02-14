import { Client } from '@notionhq/client'
import { parse } from 'querystring'

// @ts-ignore
const notion = new Client({ auth: process.env.NOTION_BLOG_TOKEN })
// @ts-ignore
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID
// @ts-ignore
const CRM_DATABASE_ID = process.env.NOTION_CRM_DATABASE_ID
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

async function getGeminiResponse(userMessage: string) {
    if (!GEMINI_API_KEY) return null;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `You are the S0R7ED AI Concierge for neurodivergent adults. 
Tone: Industrial-stealth, calm, ultra-low friction, high-fidelity.
Action: Analyze the user message and provide a supportive response. 
If they need help with a task, identify the 'Branch' (Mind, Wealth, Body, Tech, Connection, Growth, Impression).

Return raw JSON only:
{
  "reply": "Clear, supportive message acknowledging their need and how we can help.",
  "branch": "Mind",
  "summary": "Short task description"
}

User Message: "${userMessage}"`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });
        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse);
    } catch (e) {
        console.error('Gemini Error:', e);
        return null;
    }
}

async function logTaskToNotion(summary: string, branch: string, sender: string) {
    if (!CRM_DATABASE_ID) return;
    try {
        await notion.pages.create({
            parent: { database_id: CRM_DATABASE_ID },
            properties: {
                'Title': { title: [{ text: { content: `AI Task: ${summary}` } }] },
                'Branch': { select: { name: branch } },
                'Post Body': { rich_text: [{ text: { content: `Source: WhatsApp (${sender})\nTask: ${summary}` } }] },
                'Status': { status: { name: 'Idea' } }
            } as any
        });
    } catch (e) {
        console.error('Notion Task Log Error:', e);
    }
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed')
    }

    let bodyData = req.body
    if (typeof req.body === 'string') {
        bodyData = parse(req.body)
    }

    const { Body, From } = bodyData || {}
    const message = (Body || '').trim()
    const trigger = message.toUpperCase()

    console.log(`Bot received: "${message}" from ${From}`)

    try {
        if (!BLOG_DATABASE_ID) throw new Error('NOTION_BLOG_DATABASE_ID not set')

        // 1. Check for Protocol Trigger first
        const response = await (notion.databases as any).query({
            database_id: BLOG_DATABASE_ID,
            filter: {
                property: 'Trigger',
                rich_text: { equals: trigger }
            }
        })

        let replyMessage = ""

        if (response.results.length > 0) {
            const page = response.results[0]
            const props = (page as any).properties
            const templateProp = props['Template '] || props['Template']

            if (templateProp && templateProp.rich_text) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        // 2. If no protocol match, let Gemini handle it
        if (!replyMessage) {
            const aiData = await getGeminiResponse(message);
            if (aiData) {
                replyMessage = aiData.reply;
                // Log to CRM if it's a task/request
                await logTaskToNotion(aiData.summary, aiData.branch, From);
            } else {
                // Last resort fallback
                replyMessage = "I'm sorry, I couldn't find that protocol. Text 'INDEX' for options, or tell me more about what you need.";
            }
        }

        // 3. Return TwiML XML response
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${replyMessage}</Message>
</Response>`

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(twiml)

    } catch (error: any) {
        console.error('Bot Error:', error)
        const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>The SOR7ED system is currently under maintenance. Please try again soon.</Message>
</Response>`
        res.setHeader('Content-Type', 'text/xml')
        return res.status(500).send(errorTwiml)
    }
}
