
import fs from 'fs'

const DB_ID = '30a0d6014acc81ebbf18ea14125173e3'
const TOKEN = 'ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g'

async function notionRequest(endpoint, method, body) {
    const response = await fetch(`https://api.notion.com/v1/${endpoint}`, {
        method: method,
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    })
    if (!response.ok) {
        throw new Error(`Notion API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
}

function chunkText(text) {
    const chunks = []
    for (let i = 0; i < text.length; i += 2000) {
        chunks.push({ text: { content: text.slice(i, i + 2000) } })
    }
    return chunks
}

const PROBLEM_HEADERS = [
    "## The Reality",
    "## What's Actually Happening",
    "## The Struggle",
    "## The Breakdown",
    "## The Situation"
]

const CONTEXT_HEADERS = [
    "## The Context",
    "## Why It's Hard",
    "## The Hidden Cost",
    "## The Systemic Issue",
    "## Why Whatever You Try Fails"
]

const PROTOCOL_HEADERS = [
    "## The Way Out",
    "## The Fix",
    "## Moving Forward",
    "## What Actually Helps",
    "## The Strategy"
]

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function parseAndEnhance(originalText, title) {
    let text = originalText.replace(/\r\n/g, '\n')

    // Parse Minimal Story Format or Protocol Format (Look for known headers)
    // We match ANY of the headers we've used before.
    // Or just look for "## " sections.

    // Regex strategy: Find content between known anchors.
    // Problem Content: Between (Reality/Problem/Struggle) AND (Context/Shift/Why)

    // Simplest regex: Match 3 sections based on structure
    // Since we just standardized to "The Reality", "The Context", "The Way Out" in last step.
    // We can rely on THOSE keys for parsing.

    const problemMatch = text.match(/## The Reality\n\n([\s\S]*?)(?=## The Context)/)
    const contextMatch = text.match(/## The Context\n\n([\s\S]*?)(?=## The Way Out)/)
    const wayOutMatch = text.match(/## The Way Out\n\n([\s\S]*?)(?=---|$)/)

    if (problemMatch && contextMatch && wayOutMatch) {
        return formatRandom(problemMatch[1].trim(), contextMatch[1].trim(), wayOutMatch[1].trim())
    }

    return null
}

function formatRandom(problem, shift, protocol) {
    let newText = ''

    newText += `${pickRandom(PROBLEM_HEADERS)}\n\n`
    newText += `${problem}\n\n`

    newText += `${pickRandom(CONTEXT_HEADERS)}\n\n`
    newText += `${shift}\n\n`

    newText += `${pickRandom(PROTOCOL_HEADERS)}\n\n`
    newText += `${protocol}\n\n`

    newText += `---\n`
    newText += `Reply anytime. — SOR7ED`

    return newText
}

async function enhanceAllPosts() {
    console.log('🚀 Applying "Varied Story" Template...')

    let hasMore = true
    let startCursor = undefined
    let processed = 0

    while (hasMore) {
        const query = await notionRequest(`databases/${DB_ID}/query`, 'POST', {
            page_size: 50,
            start_cursor: startCursor
        })

        for (const page of query.results) {
            const title = page.properties.Title?.title[0]?.plain_text || 'Untitled'
            const currentRichText = page.properties.Content?.rich_text || []
            const currentText = currentRichText.map(t => t.plain_text).join('')

            if (!currentText) continue

            const enhancedText = parseAndEnhance(currentText, title)

            if (enhancedText) {
                // Determine if we should update.
                // Current text might already be random?
                // But parseAndEnhance only supports "The Reality/Context/Way Out".
                // If it fails to parse (because headers are random), it returns null.
                // So this script converts "Standard Minimal" -> "Random".
                // Once it's Random, this script can't re-parse it easily.
                // This is fine for a one-off transformation.

                console.log(`✨ Varying: ${title}`)
                try {
                    await notionRequest(`pages/${page.id}`, 'PATCH', {
                        properties: {
                            'Content': { rich_text: chunkText(enhancedText) }
                        }
                    })
                    processed++
                } catch (e) {
                    console.error(`❌ Failed: ${title} ${e.message}`)
                }
            } else {
                if (!currentText.includes('## The Reality')) {
                    // Already varied?
                }
            }
        }

        hasMore = query.has_more
        startCursor = query.next_cursor
    }

    console.log(`\n✅ Finished. Updates ${processed} posts.`)
}

enhanceAllPosts()
