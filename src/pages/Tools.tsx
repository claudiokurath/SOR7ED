import ToolCard from '../components/ToolCard'
import { useNotionData } from '../hooks/useNotionData'

interface Tool {
    id: string
    emoji: string
    name: string
    description: string
    whatsappKeyword: string
    category: string
    coverImage?: string
}

import { fallbackTools } from '../data/fallbackTools'

const Tools = () => {
    const { data: apiTools, loading } = useNotionData<Tool>('/api/tools')

    // Combine API tools with fallbacks, ensuring unique IDs and never empty
    const tools = apiTools.length > 0 ? apiTools : fallbackTools

    return (
        <div className="bg-black min-h-screen bg-grid relative overflow-hidden text-white font-roboto">
            {/* Premium Background Overlay */}
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
            </div>

            {/* Dynamic Background Glows */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-1">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sor7ed-yellow/5 blur-[150px] animate-stealth-glow rounded-full" />
            </div>

            <div className="relative z-10 pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-7xl">

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="text-xs font-mono-headline text-zinc-600 uppercase tracking-[0.15em] animate-pulse">Syncing with Registry...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tools.map((tool, i) => (
                                <div key={tool.id} className="animate-in fade-in slide-in-from-bottom-20" style={{ animationDelay: `${i * 100}ms` }}>
                                    <ToolCard tool={tool} />
                                </div>
                            ))}

                            {/* Coming Soon Placeholders */}
                            <div className="stealth-card p-10 flex flex-col items-center justify-center border-dashed opacity-50 border-white/10 h-full min-h-[300px]">
                                <span className="text-2xl mb-4 grayscale opacity-50">🛡️</span>
                                <h3 className="text-base font-bold uppercase tracking-[0.15em] text-zinc-600 mb-2">Vaulted Tool</h3>
                                <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.15em]">// COMING_THIS_MONTH</p>
                            </div>
                            <div className="stealth-card p-10 flex flex-col items-center justify-center border-dashed opacity-30 border-white/10 h-full min-h-[300px]">
                                <span className="text-2xl mb-4 grayscale opacity-50">📈</span>
                                <h3 className="text-base font-bold uppercase tracking-[0.15em] text-zinc-600 mb-2">Market Engine</h3>
                                <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.15em]">// IN_DEVELOPMENT</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Tools
