import { parse } from 'querystring'

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

    let bodyData = req.body
    if (typeof req.body === 'string') {
        try { bodyData = parse(req.body) } catch (e) { }
    }

    const { Body, From } = bodyData || {}
    const trigger = (Body || '').trim().toUpperCase()

    const TOKEN = (process.env.NOTION_BLOG_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) throw new Error("Vercel Config Error: Missing Notion Configuration.")

        // BULLETPROOF: Fetch all entries and filter in Javascript
        // This avoids issues with Notion's strict filtering and whitespace
        const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page_size: 100 })
        })

        if (!response.ok) throw new Error("Notion API Connection Failed.")

        const data = await response.json()
        let replyMessage = ""

        // Search for a matching trigger in the results
        const match = data.results.find((page: any) => {
            const props = page.properties
            const nodeTrigger = props.Trigger?.rich_text?.[0]?.plain_text || ""
            return nodeTrigger.trim().toUpperCase() === trigger
        })

        if (match) {
            const props = (match as any).properties
            const templateProp = props['Template '] || props['Template'] || props['Reply']

            if (templateProp && templateProp.rich_text && templateProp.rich_text.length > 0) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        if (!replyMessage) {
            // Check for hardcoded constants
            if (trigger === 'HI' || trigger === 'HELLO') {
                replyMessage = "Welcome to SOR7ED. Text any keyword from our website to receive the protocol instantly."
            } else {
                replyMessage = `SOR7ED Bot: "${trigger}" not found. Text a valid keyword from the website (e.g., FRIEND or DOPAMINE).`
            }
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        console.error('Bot Error:', error)
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ BOT ERROR: ${error.message}</Message></Response>`)
    }
}
