export interface Article {
    title: string;
    date: string;
    category: string;
    readTime: string;
}

export const articles: Article[] = [
    { title: 'Why your todo list is a trap', date: 'Feb 15, 2026', category: 'Growth', readTime: '5 min' },
    { title: 'Managing sensory overload at work', date: 'Feb 12, 2026', category: 'Environment', readTime: '8 min' },
    { title: 'The hidden cost of masking', date: 'Feb 09, 2026', category: 'Mind', readTime: '6 min' }
];
