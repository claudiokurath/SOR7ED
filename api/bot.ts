import { Client } from '@notionhq/client'
import { parse } from 'querystring'

// Initialize Notion outside the handler
const notion = new Client({ auth: (process.env.NOTION_BLOG_TOKEN || '').trim() })
const BLOG_DATABASE_ID = (process.env.NOTION_BLOG_DATABASE_ID || '').trim()

export default async function handler(req: any, res: any) {
    // Only allow POST (Twilio)
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed')
    }

    // Parse Twilio Body (application/x-www-form-urlencoded)
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

    console.log(`[Twilio Inbound] Message: "${messageBody}" | From: ${From}`)

    try {
        // Validation check for ID
        if (!BLOG_DATABASE_ID || BLOG_DATABASE_ID.length < 32) {
            throw new Error(`Invalid or missing BLOG_DATABASE_ID: "${BLOG_DATABASE_ID}"`)
        }

        // Validation check for Token
        if (!process.env.NOTION_BLOG_TOKEN) {
            throw new Error(`Missing NOTION_BLOG_TOKEN environment variable`)
        }

        console.log(`[Notion Query] DB: ${BLOG_DATABASE_ID} | Trigger: ${trigger}`)

        // 1. Query Notion
        const response = await notion.databases.query({
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

            // Notion DBs often have 'Template ' or 'Template'
            const templateProp = props['Template '] || props['Template']

            if (templateProp && templateProp.rich_text) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        // 2. Fallback
        if (!replyMessage) {
            if (trigger === 'INDEX' || trigger === 'HI') {
                replyMessage = "I found the registry but it seems empty. Please check the 'Trigger' column in Notion."
            } else {
                replyMessage = `SOR7ED Bot: Protocol "${trigger}" not found in database ${BLOG_DATABASE_ID.substring(0, 6)}... \n\nText INDEX for options.`
            }
        }

        // 3. Return TwiML
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${replyMessage}</Message>
</Response>`

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(twiml)

    } catch (error: any) {
        console.error('[Bot Error Details]:', error)

        // Return clear error message to user for troubleshooting
        let errorMsg = error.message || 'Unknown Error'
        if (error.code === 'object_not_found') {
            errorMsg = `Notion says database ${BLOG_DATABASE_ID} was not found. Please ensure it's shared with the integration.`
        }

        const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>🤖 System Error: ${errorMsg}</Message>
</Response>`
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(errorTwiml)
    }
}
