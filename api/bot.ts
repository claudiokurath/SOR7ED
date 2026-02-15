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
        if (!TOKEN || !DB_ID) throw new Error("Vercel Config Error: Missing Notion Token or DB ID.")

        // NATIVE FETCH: Bypassing the Notion Client library for maximum robustness
        const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Trigger',
                    rich_text: { equals: trigger }
                }
            })
        })

        if (!response.ok) {
            const errJson = await response.json();
            throw new Error(`Notion API Error: ${errJson.message || response.statusText}`);
        }

        const data = await response.json()
        let replyMessage = ""

        if (data.results && data.results.length > 0) {
            const props = data.results[0].properties
            const templateProp = props['Template '] || props['Template'] || props['Reply']

            if (templateProp && templateProp.rich_text && templateProp.rich_text.length > 0) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        if (!replyMessage) {
            replyMessage = `SOR7ED Bot: Protocol "${trigger}" not found. Text INDEX for catalog.`
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        console.error('Bot Error:', error)
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ BOT ERROR: ${error.message}</Message></Response>`)
    }
}
