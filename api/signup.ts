import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from '@notionhq/client'
import { NOTION_CONFIG, TWILIO_CONFIG } from './notion-config'

const NOTION_API_KEY = NOTION_CONFIG.apiKey
const CRM_DB_ID = NOTION_CONFIG.crmDbId
const TWILIO_ACCOUNT_SID = TWILIO_CONFIG.accountSid
const TWILIO_AUTH_TOKEN = TWILIO_CONFIG.authToken
const TWILIO_WHATSAPP_NUMBER = TWILIO_CONFIG.whatsappNumber

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        // 0. Validate (Note: fallbacks are now in place for Notion/Twilio)
        if (!NOTION_API_KEY || !CRM_DB_ID || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
            return res.status(500).json({ error: 'System Configuration Error', message: 'One or more required credentials (Notion/Twilio) are missing even after fallbacks.' })
        }

        const notion = new Client({ auth: NOTION_API_KEY })

        const { customerName, email, phoneNumber, leadSource, signupDate, status, freeToolsUsed, creditsBalance, password } = req.body

        // Sanitize phone number (remove spaces, dashes, etc. but keep +)
        const sanitizedPhoneNumber = phoneNumber ? phoneNumber.replace(/[^\d+]/g, '') : ''
        if (!sanitizedPhoneNumber) {
            return res.status(400).json({ error: 'Invalid Data', message: 'Phone number is required.' })
        }

        console.log(`Processing signup for ${customerName} (${sanitizedPhoneNumber})`)

        // 1. Create entry in Notion CRM
        try {
            await notion.pages.create({
                parent: { database_id: CRM_DB_ID },
                properties: {
                    'Customer Name': {
                        title: [{ text: { content: customerName || 'Unnamed' } }]
                    },
                    'Email': {
                        email: email || ''
                    },
                    'Phone Number': {
                        phone_number: sanitizedPhoneNumber
                    },
                    'Lead Source': {
                        select: { name: leadSource || 'Landing Page' }
                    },
                    'Signup Date': {
                        date: { start: signupDate || new Date().toISOString().split('T')[0] }
                    },
                    'Status': {
                        select: { name: status || 'Trial' }
                    },
                    'Free Tools Used': {
                        number: freeToolsUsed ?? 0
                    },
                    'Credits Balance': {
                        number: creditsBalance ?? 0
                    },
                    'Tools Delivered': {
                        number: 1
                    },
                    'Template Requested': {
                        rich_text: [{ text: { content: (leadSource || 'Landing Page').replace('Tool: ', '') } }]
                    },
                    // Storing password as rich text for simplicity in this project (ideally hashed)
                    'Password': {
                        rich_text: [{ text: { content: password || '' } }]
                    }
                }
            })
        } catch (notionError: any) {
            console.error('Notion CRM Error:', notionError)
            return res.status(502).json({
                error: 'CRM Integration Failed',
                message: `Failed to save lead to Notion: ${notionError.message || 'Unknown error'}`
            })
        }

        // 2. Send welcome message via Twilio WhatsApp API
        const welcomeMessage = `Hey ${customerName || 'there'}! 👋\n\nWelcome to SOR7ED. You've got 2 free tool requests waiting.\n\nTry texting:\n• DOPAMINE - Create your dopamine menu\n• TRIAGE - Sort overwhelming tasks\n• TIME - Time blindness calculator\n• SENSORY - Sensory audit\n• RSD - RSD response generator\n\nJust text the keyword and I'll send it over.\n\n— SOR7ED\nworry less, live more.`

        const authHeader = 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')

        console.log(`Sending Twilio message to ${sanitizedPhoneNumber}...`)

        try {
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
                // We return 206 (Partial Content) or just 200 with an error flag because the lead IS saved in CRM
                return res.status(200).json({
                    success: true,
                    message: 'Account created, but WhatsApp welcome message failed to deliver.',
                    twilioError: errorData.message || 'Twilio error'
                })
            }
        } catch (twilioError: any) {
            console.error('Twilio transmission error:', twilioError)
            return res.status(200).json({
                success: true,
                message: 'Account created, but WhatsApp delivery service is currently unreachable.',
                error: twilioError.message
            })
        }

        return res.status(200).json({ success: true, message: 'Signup successful' })
    } catch (error: any) {
        console.error('Signup error:', error)
        return res.status(500).json({
            error: 'Signup process failed',
            message: error.message
        })
    }
}

