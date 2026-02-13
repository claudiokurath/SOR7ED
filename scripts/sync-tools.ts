import { Client } from '@notionhq/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_TOOLS_TOKEN })
const databaseId = process.env.NOTION_TOOLS_DATABASE_ID

async function syncTools() {
    console.log('🚀 Starting Tool Sync...')

    if (!databaseId) {
        console.error('❌ NOTION_TOOLS_DATABASE_ID missing')
        return
    }

    const files = [
        'AGENCYPLAN_TEMPLATE.md',
        'CONSENT_TEMPLATE.md',
        'TEMPLATES_FINAL_BATCH.md'
    ]

    for (const file of files) {
        const filePath = path.join(process.cwd(), file)
        if (!fs.existsSync(filePath)) continue

        console.log(`\n📄 Parsing ${file}...`)
        const content = fs.readFileSync(filePath, 'utf-8')

        // Split by Trigger headers (e.g. ## TRIGGER: CRISIS)
        const sections = content.split(/## TRIGGER: /)

        for (const section of sections.slice(1)) {
            const lines = section.split('\n')
            const trigger = lines[0].split(' ')[0].trim()
            const nameMatch = section.match(/\*\*POST:\*\* (.*)/)
            const name = nameMatch ? nameMatch[1].trim() : trigger

            // Extract the block inside ``` 
            const templateMatch = section.match(/```([\s\S]*?)```/)
            const templateContent = templateMatch ? templateMatch[1].trim() : ''

            console.log(`✨ Found: ${name} [${trigger}]`)

            try {
                // Search if exists
                const existing = await notion.databases.query({
                    database_id: databaseId,
                    filter: {
                        property: 'Keyword',
                        rich_text: { equals: trigger }
                    }
                })

                if (existing.results.length > 0) {
                    console.log(`   Updating existing page...`)
                    await notion.pages.update({
                        page_id: existing.results[0].id,
                        properties: {
                            'Name': { title: [{ text: { content: name } }] },
                            'Description': { rich_text: [{ text: { content: name } }] },
                            'Keyword': { rich_text: [{ text: { content: trigger } }] },
                            'Status': { status: { name: 'Live' } }
                        } as any
                    })
                } else {
                    console.log(`   Creating new page...`)
                    await notion.pages.create({
                        parent: { database_id: databaseId },
                        properties: {
                            'Name': { title: [{ text: { content: name } }] },
                            'Description': { rich_text: [{ text: { content: name } }] },
                            'Keyword': { rich_text: [{ text: { content: trigger } }] },
                            'Icon': { rich_text: [{ text: { content: '⚒️' } }] },
                            'Status': { status: { name: 'Live' } }
                        } as any
                    })
                }
            } catch (err: any) {
                console.error(`❌ Error syncing ${trigger}:`, err.message)
            }
        }
    }

    console.log('\n✅ Sync Complete.')
}

syncTools()
