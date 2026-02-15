import { Client } from '@notionhq/client'
import { parse } from 'querystring'

// @ts-ignore
const notion = new Client({ auth: process.env.NOTION_BLOG_TOKEN })
// @ts-ignore
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID

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

    // Twilio fields are capitalized
    const { Body, From } = bodyData || {}
    const messageBody = (Body || '').trim()
    const trigger = messageBody.toUpperCase()

    console.log(`Bot received: "${messageBody}" (Trigger: "${trigger}") from ${From}`)

    try {
        if (!BLOG_DATABASE_ID) {
            return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>Config Error: BLOG_DB_ID missing</Message></Response>`)
        }

        // 1. Check for Protocol Trigger in Notion
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

        // 2. Fallback
        if (!replyMessage) {
            replyMessage = `SOR7ED Bot received: "${messageBody}". \n\nNo keyword match found. Text INDEX to see options.`
        }

        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${replyMessage}</Message>
</Response>`

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(twiml)

    } catch (error: any) {
        console.error('Bot Error:', error)
        // Return error details in the message for easier debugging
        const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>Internal Error: ${error.message || 'Unknown'}</Message>
</Response>`
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(errorTwiml)
    }
}
