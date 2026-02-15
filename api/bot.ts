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

        // Fetch all triggers (limited to 100 for performance)
        const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page_size: 100 })
        })

        if (!response.ok) throw new Error("Notion Connection Failed.")
        const data = await response.json()

        // Find the match
        const match = data.results.find((page: any) => {
            const rt = page.properties.Trigger?.rich_text || []
            const text = rt.map((t: any) => t.plain_text).join('').trim().toUpperCase()
            return text === trigger
        })

        let replyMessage = ""
        if (match) {
            const props = (match as any).properties
            const templateProp = props['Template '] || props['Template'] || props['Reply']
            if (templateProp?.rich_text?.length > 0) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        if (!replyMessage) {
            if (trigger === 'INDEX' || trigger === 'HI') {
                replyMessage = "Welcome to SOR7ED Bot. \n\nActive Keywords: \n- FRIENDSHIPPACK\n- PARENTANGER\n- DOPAMINE\n- THERAPY\n\nText any keyword from the website to begin."
            } else {
                replyMessage = `SOR7ED Bot: "${trigger}" unknown. Text INDEX for a list of valid keywords.`
            }
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ BOT ERROR: ${error.message}</Message></Response>`)
    }
}
