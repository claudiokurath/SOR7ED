import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as crypto from 'crypto'
const NOTION_API_KEY = (process.env.NOTION_API_KEY || "ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ").trim()
const CRM_DB_ID = (process.env.NOTION_CRM_DB_ID || "2e90d6014acc80c0b603ffa9e74f7f7d").trim()
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
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'Invalid Data', message: 'Email and password are required.' })
    }

    try {
        console.log(`Authenticating: ${email}`)
        const query = await notionFetch(`databases/${CRM_DB_ID}/query`, 'POST', {
            filter: { property: 'Email', email: { equals: email } }
        })

        if (!query.results || query.results.length === 0) {
            return res.status(404).json({ error: 'Account Not Found', message: 'This email is not registered.' })
        }

        const userPage = query.results[0] as any
        const storedPassword = userPage.properties['Password']?.rich_text?.[0]?.plain_text

        if (!storedPassword || storedPassword !== password) {
            return res.status(401).json({ error: 'Authentication Failed', message: 'Invalid password.' })
        }

        const expiresAt = Date.now() + (30 * 24 * 3600000) // 30 days
        const payload = `${email}:${expiresAt}`
        const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex')
        const token = Buffer.from(`${payload}:${hmac}`).toString('base64')

        return res.status(200).json({
            success: true,
            token,
            user: {
                name: userPage.properties['Customer Name']?.title?.[0]?.plain_text || 'Friend',
                email: email
            }
        })

    } catch (error: any) {
        console.error('Login error:', error)
        return res.status(500).json({ error: 'Login Failure', message: error.message })
    }
}
