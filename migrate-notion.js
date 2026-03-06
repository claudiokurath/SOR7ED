const fs = require('fs')

const NOTION_API_KEY = "ntn_t3590408908aUz0vVi2pdJGWtgrNspZczTJJQWqdlTsgVQ"
const BLOG_DB_ID = "db668e4687ed455498357b8d11d2c714"
const TOOLS_DB_ID = "08ac767d313845ca91886ce45c379b99"

const branchToSectionMap = {
    'MIND': 'Think',
    'BODY': 'Care',
    'WEALTH': 'Spend',
    'CONNECTION': 'Connect',
    'TECH': 'File',
    'GROWTH': 'Live',
    'IMPRESSION': 'Grow',
}

async function migrateDatabaseItems(dbId, dbName) {
    console.log(`Starting migration for ${dbName} items...`)
    let hasMore = true
    let nextCursor = undefined
    let itemCount = 0

    while (hasMore) {
        const response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_cursor: nextCursor
            })
        })

        if (!response.ok) {
            console.error(`Failed to fetch ${dbName}:`, await response.text())
            break
        }

        const data = await response.json()

        for (const page of data.results) {
            const branch = page.properties.Branch?.select?.name
            if (branch && branchToSectionMap[branch.toUpperCase()]) {
                const sectionName = branchToSectionMap[branch.toUpperCase()]

                // Update the Section property
                const updateRes = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${NOTION_API_KEY}`,
                        'Notion-Version': '2022-06-28',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        properties: {
                            'Section': {
                                select: {
                                    name: sectionName
                                }
                            }
                        }
                    })
                })

                if (updateRes.ok) {
                    console.log(`✅ [${dbName}] Updated page ${page.id} - Branch: ${branch} -> Section: ${sectionName}`)
                    itemCount++
                } else {
                    const err = await updateRes.text()
                    console.error(`❌ [${dbName}] Failed to update page ${page.id}:`, err)
                    console.log(`➡️ NOTE: Ensure you have added a 'Select' property named 'Section' to the ${dbName} database first!`)
                }
            } else {
                console.log(`⏭️ [${dbName}] Skipping page ${page.id} - No branch or already migrated.`)
            }

            // sleep to avoid rate limiting
            await new Promise(r => setTimeout(r, 400))
        }

        hasMore = data.has_more
        nextCursor = data.next_cursor
    }

    console.log(`Finished migration for ${dbName}. Updated ${itemCount} items.`)
}

async function main() {
    console.log("Welcome to SOR7ED Migration Tool")
    console.log("Please ensure a 'Section' Select property exists on both Databases.")
    console.log("Starting in 3 seconds...")
    await new Promise(r => setTimeout(r, 3000))

    await migrateDatabaseItems(TOOLS_DB_ID, 'Tools')
    await migrateDatabaseItems(BLOG_DB_ID, 'Blog')

    console.log("Migration complete!")
}

main().catch(console.error)
