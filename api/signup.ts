import { Client } from '@notionhq/client'

// Initialize Notion client (Server-side)
// @ts-ignore
const crmNotion = new Client({ auth: process.env.NOTION_CRM_TOKEN })
// @ts-ignore
const CRM_DATABASE_ID = process.env.NOTION_CRM_DATABASE_ID

export default async function handler(req: any, res: any) {
    // Add CORS headers for local development if needed, 
    // though Vercel handles this for same-origin by default.
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { name, email, phone, template } = req.body

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required' })
        }

        if (!CRM_DATABASE_ID) {
            throw new Error('VITE_NOTION_CRM_DATABASE_ID is not configured')
        }

        const response = await crmNotion.pages.create({
            parent: { database_id: CRM_DATABASE_ID },
            properties: {
                'Name': {
                    title: [{ text: { content: name } }]
                },
                'Email': {
                    email: email
                },
                'Phone': {
                    phone_number: phone || ''
                },
                'Template Requested': {
                    rich_text: [{ text: { content: template } }]
                },
                'Signup Date': {
                    date: { start: new Date().toISOString() }
                }
            } as any
        })

        return res.status(200).json({ success: true, id: response.id })
    } catch (error: any) {
        console.error('Notion API Error:', error)
        return res.status(500).json({
            error: 'Failed to save to Notion',
            details: error.message
        })
    }
}
