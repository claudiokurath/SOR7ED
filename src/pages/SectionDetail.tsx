import { useParams, Navigate } from 'react-router-dom'
import { sections } from '../data/sections'
import { useNotionData } from '../hooks/useNotionData'
import { resolveSection } from '../utils/sectionMapper'
import ToolCard from '../components/ToolCard'
import BlogCard from '../components/BlogCard'

export default function SectionDetail() {
    const { id } = useParams<{ id: string }>()
    const section = sections.find(s => s.id === id)
    const { data: dynamicTools, loading: toolsLoading } = useNotionData<any>('/api/tools')
    const { data: dynamicArticles, loading: articlesLoading } = useNotionData<any>('/api/articles')

    if (!section) return <Navigate to="/" />

    const sectionTools = dynamicTools.filter(t => resolveSection(t).toLowerCase() === section.name.toLowerCase())
    const sectionArticles = dynamicArticles.filter(a => resolveSection(a).toLowerCase() === section.name.toLowerCase())

    return (
        <div className="bg-black min-h-screen bg-grid relative overflow-hidden text-white font-roboto pt-32 pb-20">
            {/* Premium Background Overlay */}
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
                <div
                    className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] blur-[180px] rounded-full opacity-20 animate-stealth-glow"
                    style={{ backgroundColor: section.color }}
                />
            </div>

            <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden mb-16 md:mb-24">
                <div className="absolute inset-0 z-0">
                    <img
                        src={section.image}
                        alt={section.name}
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 mix-blend-multiply"
                        style={{ backgroundColor: `${section.color}30` }}
                    />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
                </div>

                <div className="relative z-10 px-6 container mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-10 text-center">
                    <h1 className="text-6xl md:text-9xl font-black font-fuel-decay uppercase tracking-[0.15em] mb-6 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]" style={{ color: section.color }}>
                        {section.name}
                    </h1>
                    <p className="max-w-2xl mx-auto text-white/90 text-xl md:text-2xl font-light leading-relaxed drop-shadow-md bg-black/40 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        {section.description}
                    </p>
                </div>
            </div>

            <div className="relative z-10 px-6 container mx-auto max-w-7xl">
                <div className="space-y-32">
                    {/* Tools Section */}
                    <div className="min-h-[300px]">
                        <h2 className="text-3xl font-fuel-decay uppercase tracking-[0.1em] text-white mb-8 border-b border-white/10 pb-4">
                            <span style={{ color: section.color }}>//</span> Tools
                        </h2>
                        {toolsLoading ? (
                            <p className="text-center text-zinc-500 animate-pulse font-mono uppercase tracking-[0.2em] py-10">Syncing tools...</p>
                        ) : sectionTools.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {sectionTools.map((tool, i) => (
                                    <div key={tool.id} className="animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: `${i * 100}ms` }}>
                                        <ToolCard tool={tool} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="stealth-card p-10 flex flex-col items-center justify-center border-dashed opacity-50 border-white/10 text-center">
                                <span className="text-2xl mb-4 grayscale opacity-50">🛠️</span>
                                <h3 className="text-xl font-fuel-decay uppercase tracking-[0.1em] text-zinc-500 mb-2">No tools yet</h3>
                                <p className="text-xs font-mono text-zinc-700 uppercase tracking-[0.15em]">// IN_DEVELOPMENT</p>
                            </div>
                        )}
                    </div>

                    {/* Articles Section */}
                    <div>
                        <h2 className="text-3xl font-fuel-decay uppercase tracking-[0.1em] text-white mb-8 border-b border-white/10 pb-4">
                            <span style={{ color: section.color }}>//</span> Knowledge Base
                        </h2>
                        {articlesLoading ? (
                            <p className="text-center text-zinc-500 animate-pulse font-mono uppercase tracking-[0.2em] py-10">Syncing articles...</p>
                        ) : sectionArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {sectionArticles.map((article, i) => (
                                    <div key={article.id} className="animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: `${i * 100}ms` }}>
                                        <BlogCard article={article} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="stealth-card p-10 flex flex-col items-center justify-center border-dashed opacity-50 border-white/10 text-center">
                                <span className="text-2xl mb-4 grayscale opacity-50">📝</span>
                                <h3 className="text-xl font-fuel-decay uppercase tracking-[0.1em] text-zinc-500 mb-2">No articles yet</h3>
                                <p className="text-xs font-mono text-zinc-700 uppercase tracking-[0.15em]">// TRANSMISSION_PENDING</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
