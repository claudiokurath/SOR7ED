import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as crypto from 'crypto'
import { Client } from '@notionhq/client'
const NOTION_API_KEY = (process.env.NOTION_API_KEY || "ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ").trim()
const CRM_DB_ID = (process.env.NOTION_CRM_DB_ID || "2e90d6014acc80c0b603ffa9e74f7f7d").trim()
const AUTH_SECRET = NOTION_API_KEY || 'sor7ed-default-secret'

const notion = new Client({ auth: NOTION_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.body.token || req.query.token as string)

    if (!token) return res.status(401).json({ error: 'Authentication required' })

    const { itemId, itemType, action } = req.body

    try {
        const decoded = Buffer.from(token, 'base64').toString('ascii')
        const [email, expiresAt, hmac] = decoded.split(':')

        const payload = `${email}:${expiresAt}`
        const expectedHmac = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex')

        if (hmac !== expectedHmac || Date.now() > parseInt(expiresAt)) {
            return res.status(401).json({ error: 'Token invalid or expired' })
        }

        const userQuery = await notion.databases.query({
            database_id: CRM_DB_ID,
            filter: { property: 'Email', email: { equals: email } }
        })

        if (!userQuery.results || userQuery.results.length === 0) return res.status(404).json({ error: 'User not found' })
        const userPage = userQuery.results[0] as any

        const currentSavedText = userPage.properties['Saved Items']?.rich_text?.[0]?.plain_text || ''
        let savedItems = currentSavedText ? currentSavedText.split(',').map((s: string) => s.trim()) : []

        if (action === 'add') {
            if (!savedItems.includes(itemId)) {
                savedItems.push(itemId)
            }
        } else if (action === 'remove') {
            savedItems = savedItems.filter((id: string) => id !== itemId)
        }

        await notion.pages.update({
            page_id: userPage.id,
            properties: {
                'Saved Items': {
                    rich_text: [{ text: { content: savedItems.join(',') } }]
                }
            }
        })

        return res.status(200).json({ success: true, savedItems })

    } catch (error: any) {
        console.error('Save item error:', error)
        return res.status(500).json({ error: 'Failed to update space' })
    }
}
