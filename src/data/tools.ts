export interface Tool {
    icon: string;
    name: string;
    desc: string;
    category: string;
}

export const tools: Tool[] = [
    { icon: '', name: 'Dopamine Menu', desc: 'Create your personal menu of quick dopamine hits', category: 'Executive Function' },
    { icon: '', name: 'Executive Function Triage', desc: 'Sort overwhelming tasks into manageable next steps', category: 'Executive Function' },
    { icon: '', name: 'Time Blindness Calculator', desc: 'See where your time really goes (ADHD-adjusted)', category: 'Time Management' },
    { icon: '', name: 'Focus Mode', desc: 'ND-friendly concentration kits', category: 'Focus' },
    { icon: '', name: 'Spend Guard', desc: 'Impulse control for your wallet', category: 'Wealth' },
    { icon: '', name: 'Social Kit', desc: 'Communication shortcuts', category: 'Connection' }
];
