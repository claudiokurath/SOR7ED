import type { VercelRequest, VercelResponse } from '@vercel/node'

const NOTION_API_KEY = (process.env.NOTION_API_KEY || "ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ").trim()
const CRM_DB_ID = (process.env.NOTION_CRM_DB_ID || "2e90d6014acc80c0b603ffa9e74f7f7d").trim()
const TWILIO_ACCOUNT_SID = (process.env.TWILIO_ACCOUNT_SID || "ACd0b71f7f267952855cb3ce0fb950505680ca7ff6e58205").trim()
const TWILIO_AUTH_TOKEN = (process.env.TWILIO_AUTH_TOKEN || "fb562143e370be7264").trim()
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || '+447360277713'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        // 0. Validate (Note: fallbacks are now in place for Notion/Twilio)
        if (!NOTION_API_KEY || !CRM_DB_ID || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
            return res.status(500).json({ error: 'System Configuration Error', message: 'One or more required credentials (Notion/Twilio) are missing even after fallbacks.' })
        }

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
            if (!res.ok) {
                const text = await res.text()
                throw new Error(text)
            }
            return res.json()
        }

        const { customerName, email, phoneNumber, leadSource, signupDate, status, freeToolsUsed, creditsBalance, password } = req.body

        // Sanitize phone number (remove spaces, dashes, etc. but keep +)
        const sanitizedPhoneNumber = phoneNumber ? phoneNumber.replace(/[^\d+]/g, '') : ''
        if (!sanitizedPhoneNumber) {
            return res.status(400).json({ error: 'Invalid Data', message: 'Phone number is required.' })
        }

        console.log(`Processing signup for ${customerName} (${sanitizedPhoneNumber})`)

        // 1. Check for existing entry in Notion CRM to prevent duplicates
        try {
            const existingQuery = await notionFetch(`databases/${CRM_DB_ID}/query`, 'POST', {
                filter: {
                    or: [
                        { property: 'Email', email: { equals: email } },
                        { property: 'Phone Number', phone_number: { equals: sanitizedPhoneNumber } }
                    ]
                }
            })

            if (existingQuery.results.length > 0) {
                // User already exists! Return without creating a duplicate.
                return res.status(200).json({
                    success: false,
                    message: "Account already exists! Please click 'Access Vault' instead of 'Join Registry'."
                })
            }

            // Create new entry since they do not exist
            await notionFetch(`pages`, 'POST', {
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
                        select: { name: status || 'Active' }
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
        const welcomeMessage = `Hey ${customerName || 'there'}! 👋 Welcome to SOR7ED.

To ensure the system is always ready when your brain needs it most, please follow these 2 quick steps:

📌 **STEP 1:** Save this number to your contacts as "SOR7ED Bot".
📌 **STEP 2:** Pin this chat to the top of your WhatsApp.

Your account is active and you have unlimited free access to our tools! 

To get your first tool, simply reply with a keyword. Try:
▹ DOPAMINE (Creates a dopamine menu)
▹ TRIAGE (Sorts overwhelming tasks)
▹ TIME (Time blindness calculator)

Just text the keyword, and I'll send the tool right over.
— SOR7ED`

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

