import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as crypto from 'crypto'
const NOTION_API_KEY = (process.env.NOTION_API_KEY || "ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ").trim()
const CRM_DB_ID = (process.env.NOTION_CRM_DB_ID || "2e90d6014acc80c0b603ffa9e74f7f7d").trim()
const BLOG_DB_ID = (process.env.NOTION_BLOG_DB_ID || "db668e4687ed455498357b8d11d2c714").trim()
const TOOLS_DB_ID = (process.env.NOTION_TOOLS_DB_ID || "08ac767d313845ca91886ce45c379b99").trim()
const AUTH_SECRET = NOTION_API_KEY || 'sor7ed-default-secret'

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
        const decoded = Buffer.from(token, 'base64').toString('ascii')
        const [email, expiresAt, hmac] = decoded.split(':')

        const payload = `${email}:${expiresAt}`
        const expectedHmac = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex')

        if (hmac !== expectedHmac || Date.now() > parseInt(expiresAt)) {
            return res.status(401).json({ error: 'Token invalid or expired' })
        }

        const userQuery = await notionFetch(`databases/${CRM_DB_ID}/query`, 'POST', {
            filter: { property: 'Email', email: { equals: email } }
        })

        if (!userQuery.results || userQuery.results.length === 0) return res.status(404).json({ error: 'User not found' })
        const userPage = userQuery.results[0] as any

        const requestedTemplates = userPage.properties['Template Requested']?.rich_text?.[0]?.plain_text || ''
        const triggers = requestedTemplates ? requestedTemplates.split(',').map((t: string) => t.trim()) : []

        const savedItemsRaw = userPage.properties['Saved Items']?.rich_text?.[0]?.plain_text || ''
        const savedIds = savedItemsRaw ? savedItemsRaw.split(',').map((s: string) => s.trim()) : []

        const protocols: any[] = []

        if (triggers.length > 0) {
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
                        section: page.properties.Section?.select?.name || '',
                        trigger: page.properties.Trigger?.rich_text?.[0]?.plain_text || '',
                        type: 'blog'
                    })
                })
            }

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
                            section: page.properties.Section?.select?.name || '',
                            trigger: page.properties['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || '',
                            type: 'tool'
                        })
                    }
                })
            }
        }

        for (const sid of savedIds) {
            if (protocols.find(p => p.id === sid)) continue

            try {
                const page = await notionFetch(`pages/${sid}`, 'GET')
                if (page.error) continue

                const isBlog = page.parent.database_id === BLOG_DB_ID.replace(/-/g, '')
                const isTool = page.parent.database_id === TOOLS_DB_ID.replace(/-/g, '')

                if (isBlog) {
                    protocols.push({
                        id: page.id,
                        title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
                        branch: page.properties.Branch?.select?.name || 'Mind',
                        section: page.properties.Section?.select?.name || '',
                        trigger: page.properties.Trigger?.rich_text?.[0]?.plain_text || '',
                        type: 'blog',
                        isSaved: true
                    })
                } else if (isTool) {
                    protocols.push({
                        id: page.id,
                        title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
                        branch: page.properties.Branch?.select?.name || 'Tech',
                        section: page.properties.Section?.select?.name || '',
                        trigger: page.properties['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || '',
                        type: 'tool',
                        isSaved: true
                    })
                }
            } catch (e) {
                console.error(`Failed to fetch saved item ${sid}:`, e)
            }
        }

        return res.status(200).json({
            user: {
                name: userPage.properties['Customer Name']?.title?.[0]?.plain_text || 'Friend',
                email: email,
                savedItems: savedIds
            },
            protocols
        })

    } catch (error: any) {
        console.error('Vault content error:', error)
        return res.status(500).json({ error: 'Server error' })
    }
}
