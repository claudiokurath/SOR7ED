import type { VercelRequest, VercelResponse } from '@vercel/node'
import * as crypto from 'crypto'

const NOTION_API_KEY = process.env.NOTION_API_KEY!
const CRM_DB_ID = process.env.NOTION_CRM_DB_ID!
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || '+447360277713'
const AUTH_SECRET = process.env.NOTION_API_KEY || 'sor7ed-default-secret' // Fallback to Notion API Key as secret if not set

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

    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    try {
        // 1. Find user in Notion CRM
        const query = await notionFetch(`databases/${CRM_DB_ID}/query`, 'POST', {
            filter: { property: 'Email', email: { equals: email } }
        })

        if (!query.results || query.results.length === 0) {
            return res.status(404).json({ error: 'No account found with this email. Try signing up for a tool first.' })
        }

        const userPage = query.results[0] as any
        const customerName = userPage.properties['Customer Name']?.title?.[0]?.plain_text || 'there'
        const phoneNumber = userPage.properties['Phone Number']?.phone_number

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Account found but no phone number is linked.' })
        }

        // 2. Generate token
        const expiresAt = Date.now() + 3600000 // 1 hour
        const payload = `${email}:${expiresAt}`
        const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex')
        const token = Buffer.from(`${payload}:${hmac}`).toString('base64')

        // 3. Send Magic Link via WhatsApp
        const magicLink = `https://sor7ed.com/vault?token=${token}`
        const message = `Hey ${customerName}! 👋\n\nHere is your secure access link to The Vault:\n\n${magicLink}\n\nThis link expires in 1 hour.\n\n— SOR7ED`

        const authHeader = 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')

        const twilioRes = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
                    To: `whatsapp:${phoneNumber}`,
                    Body: message
                })
            }
        )

        if (!twilioRes.ok) {
            const errorData = await twilioRes.json()
            console.error('Twilio error:', errorData)
            throw new Error('Failed to send WhatsApp message')
        }

        return res.status(200).json({ success: true, message: 'Magic link sent' })

    } catch (error: any) {
        console.error('Magic link error:', error)
        return res.status(500).json({ error: 'Server error', message: error.message })
    }
}
