export const sections = [
    {
        id: 'think',
        emoji: '🧠',
        name: 'Think',
        description: 'Mental load, clarity, planning, decision-making, focus, motivation, overwhelm, executive function.',
        color: '#9B59B6'
    },
    {
        id: 'care',
        emoji: '🔋',
        name: 'Care',
        description: 'Body + nervous system: sleep, food, movement, meds, hygiene, sensory needs, recovery, health routines.',
        color: '#E74C3C'
    },
    {
        id: 'spend',
        emoji: '💳',
        name: 'Spend',
        description: 'Money + financial life admin: budgeting, bills, debt, subscriptions, taxes, saving, money systems.',
        color: '#27AE60'
    },
    {
        id: 'connect',
        emoji: '🤝',
        name: 'Connect',
        description: 'Relationships + social: communication, friendships, dating, family, boundaries, community, conflict repair.',
        color: '#E67E22'
    },
    {
        id: 'file',
        emoji: '📁',
        name: 'File',
        description: 'Tech + systems: digital setup, automations, tools, templates, accounts, passwords, organisation systems.',
        color: '#3498DB'
    },
    {
        id: 'live',
        emoji: '🏠',
        name: 'Live',
        description: 'Life direction + stability: habits, identity, routines, lifestyle design, long-term sustainability.',
        color: '#16A085'
    },
    {
        id: 'grow',
        emoji: '🌱',
        name: 'Grow',
        description: 'Outward growth + presentation: confidence, self-image, personal brand, presentation, visibility, skill-building, leveling up.',
        color: '#F39C12'
    }
]

export const branchToSectionMap: Record<string, string> = {
    'MIND': 'Think',
    'BODY': 'Care',
    'WEALTH': 'Spend',
    'CONNECTION': 'Connect',
    'TECH': 'File',
    'GROWTH': 'Live',
    'IMPRESSION': 'Grow',
    'mind': 'think',
    'body': 'care',
    'wealth': 'spend',
    'connection': 'connect',
    'tech': 'file',
    'growth': 'live',
    'impression': 'grow'
}
