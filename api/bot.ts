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
        if (!TOKEN || !DB_ID) throw new Error("Config missing.")

        const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page_size: 100 })
        })

        const data = await response.json()
        let replyMessage = ""

        // DEBUG: Capture the first few triggers to see what's happening
        const debugTriggers = data.results
            .map((p: any) => p.properties.Trigger?.rich_text?.[0]?.plain_text || "NONE")
            .slice(0, 5)
            .join(', ')

        const match = data.results.find((page: any) => {
            const props = page.properties
            const val = props.Trigger?.rich_text?.[0]?.plain_text || ""
            return val.trim().toUpperCase() === trigger
        })

        if (match) {
            const props = match.properties
            const templateProp = props['Template '] || props['Template'] || props['Reply']
            if (templateProp?.rich_text?.[0]) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        if (!replyMessage) {
            replyMessage = `DEBUG: Trigger "${trigger}" not among: ${debugTriggers}`
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ BOT ERROR: ${error.message}</Message></Response>`)
    }
}
