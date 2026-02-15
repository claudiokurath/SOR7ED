import { Client } from '@notionhq/client'
import { parse } from 'querystring'

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed')
    }

    let bodyData = req.body
    if (typeof req.body === 'string') {
        try {
            bodyData = parse(req.body)
        } catch (e) {
            console.error('Parse error', e)
        }
    }

    const { Body, From } = bodyData || {}
    const messageBody = (Body || '').trim()
    const trigger = messageBody.toUpperCase()

    // Support both naming conventions to prevent user frustration
    const BLOG_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()
    const BLOG_TOKEN = (process.env.NOTION_BLOG_TOKEN || '').trim()

    try {
        if (!BLOG_ID || BLOG_ID.length < 32) {
            throw new Error(`MISSING CONFIG: Please add NOTION_BLOG_DATABASE_ID to Vercel Env Variables. current value: "${BLOG_ID}"`)
        }

        if (!BLOG_TOKEN) {
            throw new Error('MISSING CONFIG: Please add NOTION_BLOG_TOKEN to Vercel Env Variables.')
        }

        const notion = new Client({ auth: BLOG_TOKEN })

        const response = await notion.databases.query({
            database_id: BLOG_ID,
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

        if (!replyMessage) {
            replyMessage = `SOR7ED: "${trigger}" not found in your Notion registry. \n\nText INDEX for help.`
        }

        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${replyMessage}</Message>
</Response>`

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(twiml)

    } catch (error: any) {
        console.error('Bot Error:', error)
        let msg = error.message || 'Unknown Error'
        if (error.code === 'object_not_found') msg = "Notion Connection Error: Database ID is wrong or not shared with Integration."

        const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>🛠️ BOT FIX REQUIRED: ${msg}</Message>
</Response>`
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(errorTwiml)
    }
}
