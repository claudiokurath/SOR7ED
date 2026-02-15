import { Client } from '@notionhq/client'
import { parse } from 'querystring'

export default async function handler(req: any, res: any) {
    // 1. Method check
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

    // 2. Parse Body (Twilio sends form-urlencoded)
    let bodyData = req.body
    if (typeof req.body === 'string') {
        try { bodyData = parse(req.body) } catch (e) { }
    }

    const { Body, From } = bodyData || {}
    const trigger = (Body || '').trim().toUpperCase()

    // 3. Robust Config Detection
    const TOKEN = (process.env.NOTION_BLOG_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()

    try {
        if (!TOKEN) throw new Error("Vercel Config: NOTION_BLOG_TOKEN or NOTION_TOKEN is missing.")
        if (!DB_ID) throw new Error("Vercel Config: NOTION_BLOG_DATABASE_ID or BLOG_DB_ID is missing.")

        const notion = new Client({ auth: TOKEN })

        // 4. Query Notion for Protocol
        const response = await notion.databases.query({
            database_id: DB_ID,
            filter: {
                property: 'Trigger',
                rich_text: { equals: trigger }
            }
        })

        let replyMessage = ""

        if (response.results.length > 0) {
            const page = response.results[0] as any
            const props = page.properties
            // Supporting 'Template ' (common typo) and 'Template'
            const templateProp = props['Template '] || props['Template'] || props['Reply']

            if (templateProp && templateProp.rich_text) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        // 5. Fallback if no match
        if (!replyMessage) {
            replyMessage = `SOR7ED Bot: "${trigger}" matched 0 protocols in your registry. \n\nCheck your Notion 'Trigger' column or text INDEX.`
        }

        // 6. Return TwiML
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        console.error('Bot Error:', error)
        let msg = error.message || 'Unknown Error'
        if (error.code === 'object_not_found') {
            msg = `Notion Database ${DB_ID.substring(0, 6)} not found. Please click "..." -> "Add Connections" in Notion and select your integration.`
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ BOT ERROR: ${msg}</Message></Response>`)
    }
}
