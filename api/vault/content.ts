import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as crypto from 'crypto'

const NOTION_API_KEY = process.env.NOTION_API_KEY!
const CRM_DB_ID = process.env.NOTION_CRM_DB_ID!
const BLOG_DB_ID = process.env.NOTION_BLOG_DB_ID!
const TOOLS_DB_ID = process.env.NOTION_TOOLS_DB_ID!
const AUTH_SECRET = process.env.NOTION_API_KEY || 'sor7ed-default-secret'

async function notionFetch(endpoint: string, method: string, body?: any) {
    const res = await fetch(`https://api.notion.com/v1/${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    })
    return res.json()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { token } = req.query
    if (!token || typeof token !== 'string') return res.status(401).json({ error: 'Auth required' })

    try {
        // 1. Verify Token
        const decoded = Buffer.from(token, 'base64').toString('ascii')
        const [email, expiresAt, hmac] = decoded.split(':')

        const payload = `${email}:${expiresAt}`
        const expectedHmac = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex')

        if (hmac !== expectedHmac || Date.now() > parseInt(expiresAt)) {
            return res.status(401).json({ error: 'Token invalid or expired' })
        }

        // 2. Fetch User from CRM
        const userQuery = await notionFetch(`databases/${CRM_DB_ID}/query`, 'POST', {
            filter: { property: 'Email', email: { equals: email } }
        })

        if (!userQuery.results || userQuery.results.length === 0) return res.status(404).json({ error: 'User not found' })
        const userPage = userQuery.results[0] as any

        const requestedTemplates = userPage.properties['Template Requested']?.rich_text?.[0]?.plain_text || ''
        const triggers = requestedTemplates ? requestedTemplates.split(',').map((t: string) => t.trim()) : []

        // 3. Fetch Protocol Details
        const protocols: any[] = []

        if (triggers.length > 0) {
            // Search Blog database
            const blogQuery = await notionFetch(`databases/${BLOG_DB_ID}/query`, 'POST', {
                filter: {
                    or: triggers.map((t: string) => ({
                        property: 'Trigger',
                        rich_text: { equals: t }
                    }))
                }
            })

            if (blogQuery.results) {
                blogQuery.results.forEach((page: any) => {
                    protocols.push({
                        id: page.id,
                        title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
                        branch: page.properties.Branch?.select?.name || 'Mind',
                        trigger: page.properties.Trigger?.rich_text?.[0]?.plain_text || '',
                        type: 'blog'
                    })
                })
            }

            // Search Tools database
            const toolsQuery = await notionFetch(`databases/${TOOLS_DB_ID}/query`, 'POST', {
                filter: {
                    or: triggers.map((t: string) => ({
                        property: 'WhatsApp Keyword',
                        rich_text: { equals: t }
                    }))
                }
            })

            if (toolsQuery.results) {
                toolsQuery.results.forEach((page: any) => {
                    if (!protocols.find(p => p.trigger === page.properties['WhatsApp Keyword']?.rich_text?.[0]?.plain_text)) {
                        protocols.push({
                            id: page.id,
                            title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
                            branch: page.properties.Branch?.select?.name || 'Tech',
                            trigger: page.properties['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || '',
                            type: 'tool'
                        })
                    }
                })
            }
        }

        return res.status(200).json({
            user: {
                name: userPage.properties['Customer Name']?.title?.[0]?.plain_text || 'Friend',
                email: email
            },
            protocols
        })

    } catch (error: any) {
        console.error('Vault content error:', error)
        return res.status(500).json({ error: 'Server error' })
    }
}
