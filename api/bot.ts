import { parse } from 'node:querystring'
// Build Sync: 2026-02-16T03:34:00Z

// Taxonomy and Routing Logic from Master Document (v1)
const UTILITY_RESPONSES: Record<string, string> = {
    'START': "Hey! Welcome to SOR7ED.\n\nI'm your ND-aware tool library, delivered right here in WhatsApp.\n\nNo apps. No overwhelm. Just practical tools that actually work.\n\nHere's what I can send you:\n\n📜 [DOPAMINE] → Personalized dopamine menu\n⚖️ [TRIAGE] → Sort your task overwhelm \n⏰ [TIMEWARP] → Fix time blindness\n🎯 [SENSORY] → Sensory environment audit\n❄️ [COOLOFF] → RSD emergency scripts\n💸 [ADHD-TAX] → Calculate hidden ADHD costs\n\nReply with any keyword to get started.\nOr text MENU to see all tools.",
    'HI': "Hey! Welcome to SOR7ED.\n\nI'm your ND-aware tool library, delivered right here in WhatsApp.\n\nNo apps. No overwhelm. Just practical tools that actually work.\n\nHere's what I can send you:\n\n📜 [DOPAMINE] → Personalized dopamine menu\n⚖️ [TRIAGE] → Sort your task overwhelm \n⏰ [TIMEWARP] → Fix time blindness\n🎯 [SENSORY] → Sensory environment audit\n❄️ [COOLOFF] → RSD emergency scripts\n💸 [ADHD-TAX] → Calculate hidden ADHD costs\n\nReply with any keyword to get started.\nOr text MENU to see all tools.",
    'MENU': "📍 SOR7ED Main Menu\n\n- [TEMPLATES]: Browse free neuro-architecture kits.\n- [LABS]: Open interactive operational tools.\n- [ABOUT]: Our mission & philosophy.\n- [HELP]: Support, safety & SLAs.\n\nEverything in the Registry is now [FREE].",
    'HELP': "🆘 SOR7ED Help & Safety\n\nI am an automated system delivering free tools for ND brains.\n\n⚠️ IMPORTANT:\n- We are NOT a crisis line. For emergencies call 999 or text SHOUT to 85258.\n- We are NOT a therapy or medical service. We do not diagnose or prescribe.\n\nSLAs:\n- Delivery: Instant via keyword\n- Support: hello@sor7ed.com (24-48h)\n\nReply 'HUMAN' for support.",
    'ABOUT': "ℹ️ About SOR7ED\n\nSOR7ED is the shame-free space where ND minds find knowledge and tools to navigate 'impossible' life admin.\n\nOUR PHILOSOPHY:\n- [Anti-App]: We meet you on WhatsApp (no new apps).\n- [Templates > Inspiration]: You need a system that works, not just a quote.\n- [ND-First]: Built by ND people, for ND people.\n\n7 BRANCHES:\nMind, Wealth, Body, Tech, Connection, Impression, Growth.",
    'CREDITS': "💳 Operational Status\n\nEffective Feb 2026: All core templates and lab tools are now [FREE]. \n\nConcierge services are currently in beta. No credits required for primary protocols.",
    'PARK': "🅿️ Protocol Parked\n\nI've paused this sequence. I'll check in with you tomorrow with one smallest next step. Reply RESUME anytime.",
    'STOP': "🛑 Opt-out Confirmed\n\nAll automations stopped. I won't message you again unless you re-start a protocol.",
    'TIMELINE': "⏳ System Timeline\n\nCurrent Request Status: [ACTIVE]\nEstimated Completion: Same-day (SLA compliant)."
}

const ALIAS_MAP: Record<string, string> = {
    'ACTION KIT': 'ACTIONKIT', 'EXECUTIVE DYSFUNCTION': 'ACTIONKIT', 'LOW FRICTION': 'ACTIONKIT',
    'TIME BLINDNESS': 'TIMERAILS', 'TIMERS': 'TIMERAILS', 'FINISH CLEANLY': 'TIMERAILS',
    'AFTER WORK': 'LANDINGRITUAL', 'DECOMPRESSION': 'LANDINGRITUAL', 'UNMASKING': 'LANDINGRITUAL',
    'MONEY RESET': 'MONEYRESET', 'IMPULSE SPEND': 'MONEYRESET', 'DEBT': 'MONEYRESET',
    'MELTDOWN': 'WORKPARK', 'SHUTDOWN': 'WORKPARK', 'OVERWHELM': 'WORKPARK',
    'CONSENT KIT': 'CONSENTKIT', 'INTIMACY': 'CONSENTKIT',
    'CAPACITY SCRIPT': 'CAPACITYSCRIPT', 'MASKING INTIMACY': 'CAPACITYSCRIPT',
    'BOUNDARIES PACK': 'BOUNDARIESPACK', 'HOLIDAY SCRIPTS': 'BOUNDARIESPACK',
    'THERAPY BRIEF': 'THERAPYBRIEF', 'THERAPY PREP': 'THERAPYBRIEF',
    'PARK': 'PARK', 'STOP': 'STOP', 'TIMELINE': 'TIMELINE',
    'GAMING RAILS': 'GAMINGRAILS', 'GAME TIME': 'GAMINGRAILS',
    'PHILOSOPHY': 'ABOUT', 'MISSION': 'ABOUT', 'WHY SOR7ED': 'ABOUT',
    'WAKE': 'AGENCYPLAN',
    'TASK TRIAGE': 'TRIAGE', 'EXECUTIVE FUNCTION': 'TRIAGE',
    'TIME CALCULATOR': 'TIMEWARP',
    'SENSORY AUDIT': 'SENSORY', 'OVERLOAD': 'SENSORY',
    'RSD SCRIPTS': 'COOLOFF', 'REJECTION': 'COOLOFF',
    'COST CALCULATOR': 'ADHDTAX', 'ADHD TAX': 'ADHDTAX', 'ADHD-TAX': 'ADHDTAX'
}

export default async function handler(req: any, res: any) {
    console.log('Bot Request Recieved:', req.method)
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

    let bodyData = req.body
    if (typeof req.body === 'string') {
        try { bodyData = parse(req.body) } catch (e) { }
    }

    const { Body } = bodyData || {}
    const rawTrigger = (Body || '').trim().toUpperCase()

    // 1. Resolve Canonical Trigger
    const trigger = ALIAS_MAP[rawTrigger] || rawTrigger

    // 2. Handle Global Utility Words
    if (UTILITY_RESPONSES[trigger]) {
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${UTILITY_RESPONSES[trigger]}</Message></Response>`)
    }

    const TOKEN = (process.env.NOTION_TOKEN || process.env.NOTION_BLOG_TOKEN || process.env.NOTION_CRM_TOKEN || '').trim()
    const BLOG_DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || process.env.BLOG_DATABASE_ID || '').trim()
    const TOOLS_DB_ID = (process.env.NOTION_TOOLS_DATABASE_ID || process.env.TOOLS_DB_ID || process.env.TOOLS_DATABASE_ID || '').trim()
    const CRM_DB_ID = (process.env.NOTION_CRM_DATABASE_ID || '').trim()

    try {
        if (!TOKEN) throw new Error("Vercel Config Error: Missing Notion Token.")
        if (!BLOG_DB_ID) throw new Error("Vercel Config Error: Missing Blog Database ID.")
        if (!CRM_DB_ID) throw new Error("Vercel Config Error: Missing CRM Database ID.")

        const { From } = bodyData || {}
        const userPhone = From || ''

        // 3. User Resolution (CRM)
        let userPage: any = null
        if (userPhone && !UTILITY_RESPONSES[trigger]) {
            const crmQuery = await fetch(`https://api.notion.com/v1/databases/${CRM_DB_ID}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filter: { property: 'Phone Number', phone_number: { equals: userPhone } }
                })
            })
            const crmData = await crmQuery.json()
            userPage = crmData.results?.[0]

            // Auto-create Trial User if not found
            if (!userPage && userPhone.includes('+')) {
                const createRes = await fetch(`https://api.notion.com/v1/pages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        parent: { database_id: CRM_DB_ID },
                        properties: {
                            'Customer Name': { title: [{ text: { content: `New User (${userPhone})` } }] },
                            'Phone Number': { phone_number: userPhone },
                            'Join Date': { date: { start: new Date().toISOString() } },
                            'Lead Source': { select: { name: 'WhatsApp Bot' } },
                            'Free Tools Used': { number: 0 },
                            'Credits Balance': { number: 0 }
                        }
                    })
                })
                userPage = await createRes.json()
            }
        }

        let match: any = null
        let replyMessage = ""
        let branch = "Mind"

        // Credit Check Logic
        const freeToolsUsed = userPage?.properties?.['Free Tools Used']?.number || 0
        const credits = userPage?.properties?.['Credits Balance']?.number || 0
        const isAuthorized = UTILITY_RESPONSES[trigger] || freeToolsUsed < 2 || credits > 0

        if (!isAuthorized && !UTILITY_RESPONSES[trigger]) {
            res.setHeader('Content-Type', 'text/xml')
            return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>🔴 You've used all your free tools!\n\nTo unlock more, you need credits.\n\nCREDIT PACKS:\n💚 Starter (5 tools) = £15\n💙 Value (10 tools) = £25 ⭐ Most popular\n💜 Premium (20 tools) = £40 (Save £20!)\n\nBuy now: https://buy.stripe.com/sor7ed_credits\n\nQuestions? Reply HELP</Message></Response>`)
        }

        // Search Tools first (Primary operational layer)
        const toolsResponse = await fetch(`https://api.notion.com/v1/databases/${TOOLS_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'WhatsApp CTA',
                    rich_text: { equals: trigger }
                },
                page_size: 1
            })
        })
        const toolsData = await toolsResponse.json()
        match = toolsData.results?.[0]

        if (match) {
            const props = match.properties
            branch = props.Branch?.select?.name || "Mind"
            const templateRichText = props.Template?.rich_text || props.Description?.rich_text || []
            const template = templateRichText.map((t: any) => t.plain_text).join('')

            const toolName = props.Name?.title?.[0]?.plain_text || "Requested Tool"

            let creditNotice = ""
            if (!UTILITY_RESPONSES[trigger]) {
                if (freeToolsUsed < 2) {
                    creditNotice = `🛡️ Free tool ${freeToolsUsed + 1}/2 delivered.`
                } else {
                    creditNotice = `✅ Tool unlocked. Remaining credits: ${credits - 1}`
                }
            }

            replyMessage = `Reflected: You want the ${toolName}. Got it. [Branch: ${branch}]\n\n${template}\n\n${creditNotice}`
        }

        // Search Blog/Articles if no tool match
        if (!replyMessage) {
            const blogResponse = await fetch(`https://api.notion.com/v1/databases/${BLOG_DB_ID}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filter: {
                        property: 'Trigger',
                        rich_text: { equals: trigger }
                    },
                    page_size: 1
                })
            })
            const blogData = await blogResponse.json()
            match = blogData.results?.[0]

            if (match) {
                const props = match.properties
                branch = props.Branch?.select?.name || "Mind"
                const templateRichText = props.Template?.rich_text || props['Template ']?.rich_text || []
                const template = templateRichText.map((t: any) => t.plain_text).join('')

                const postTitle = props.Title?.title?.[0]?.plain_text || "Requested Protocol"

                let creditNotice = ""
                if (!UTILITY_RESPONSES[trigger]) {
                    if (freeToolsUsed < 2) {
                        creditNotice = `🛡️ Free protocol ${freeToolsUsed + 1}/2 delivered.`
                    } else {
                        creditNotice = `✅ Protocol unlocked. Remaining credits: ${credits - 1}`
                    }
                }

                replyMessage = `Reflected: Opening "${postTitle}". [Branch: ${branch}]\n\n${template}\n\n${creditNotice}`
            }
        }

        // 4. Update CRM Usage Stats
        if (match && userPage && userPage.properties && !UTILITY_RESPONSES[trigger]) {
            const updates: any = {}
            if (freeToolsUsed < 2) {
                updates['Free Tools Used'] = { number: freeToolsUsed + 1 }
            } else {
                updates['Credits Balance'] = { number: Math.max(0, credits - 1) }
                const currentTotal = userPage.properties['Total Credits Used']?.number || 0
                updates['Total Credits Used'] = { number: currentTotal + 1 }
            }
            const currentDelivered = userPage.properties['Tools Delivered']?.number || 0
            updates['Tools Delivered'] = { number: currentDelivered + 1 }
            updates['Last Active'] = { date: { start: new Date().toISOString() } }

            await fetch(`https://api.notion.com/v1/pages/${userPage.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ properties: updates })
            })
        }

        if (!replyMessage) {
            replyMessage = `SOR7ED Bot: "${trigger}" unknown. Valid protocols include DOPAMINE, TRIAGE, COOLOFF, SENSORY. \n\nReply MENU for more.`
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ SYSTEM ERROR: ${error.message}</Message></Response>`)
    }
}
