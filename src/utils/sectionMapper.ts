import { branchToSectionMap } from '../data/sections'

export const resolveSection = (item: { section?: string; branch?: string; category?: string }): string => {
    if (item.section) return item.section
    const legacy = item.branch || item.category
    if (legacy) {
        return branchToSectionMap[legacy] || branchToSectionMap[legacy.toLowerCase()] || legacy
    }
    return 'Unknown'
}
