import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const CRM_DB_ID = process.env.NOTION_CRM_DB_ID!
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || '+447360277713'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { customerName, email, phoneNumber, leadSource, signupDate, status, freeToolsUsed, creditsBalance } = req.body

        // Sanitize phone number (remove spaces, dashes, etc. but keep +)
        const sanitizedPhoneNumber = phoneNumber.replace(/[^\d+]/g, '')

        console.log(`Processing signup for ${customerName} (${sanitizedPhoneNumber})`)

        // 1. Create entry in Notion CRM
        try {
            await (notion.pages as any).create({
                parent: { database_id: CRM_DB_ID },
                properties: {
                    'Customer Name': {
                        title: [{ text: { content: customerName } }]
                    },
                    'Email': {
                        email: email
                    },
                    'Phone Number': {
                        phone_number: sanitizedPhoneNumber
                    },
                    'Lead Source': {
                        select: { name: leadSource || 'Direct' }
                    },
                    'Signup Date': {
                        date: { start: signupDate }
                    },
                    'Status': {
                        select: { name: status }
                    },
                    'Free Tools Used': {
                        number: freeToolsUsed
                    },
                    'Credits Balance': {
                        number: creditsBalance
                    },
                    'Tools Delivered': {
                        number: 1
                    },
                    'Template Requested': {
                        rich_text: [{ text: { content: leadSource.replace('Tool: ', '') } }]
                    }
                }
            })
        } catch (notionError: any) {
            console.error('Notion CRM Error:', notionError)
            // Even if Notion fails, we might still want to try sending the WhatsApp message 
            // or at least know it failed here specifically.
            throw new Error(`CRM Integration failed: ${notionError.message}`)
        }

        // 2. Send welcome message via Twilio WhatsApp API
        const welcomeMessage = `Hey ${customerName}! 👋

Welcome to SOR7ED. You've got 2 free tool requests waiting.

Try texting:
• DOPAMINE - Create your dopamine menu
• TRIAGE - Sort overwhelming tasks
• TIME - Time blindness calculator
• SENSORY - Sensory audit
• RSD - RSD response generator

Just text the keyword and I'll send it over.

— SOR7ED
worry less, live more.`

        // Create Basic Auth header
        const authHeader = 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')

        console.log(`Sending Twilio message to ${sanitizedPhoneNumber}...`)

        // Send WhatsApp message via Twilio
        const twilioResponse = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
                    To: `whatsapp:${sanitizedPhoneNumber}`,
                    Body: welcomeMessage
                })
            }
        )

        if (!twilioResponse.ok) {
            const errorData = await twilioResponse.json()
            console.error('Twilio error:', errorData)
            throw new Error(`WhatsApp delivery failed: ${errorData.message || 'Unknown Twilio error'}`)
        }

        return res.status(200).json({ success: true, message: 'Signup successful' })
    } catch (error: any) {
        console.error('Signup error:', error)
        return res.status(500).json({
            error: 'Signup failed',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}

