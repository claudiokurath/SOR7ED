import { useState } from 'react'
import BlogCard from '../components/BlogCard'
import { branches } from '../data/branches'
import { useNotionData } from '../hooks/useNotionData'

interface Article {
    id: string
    title: string
    excerpt: string
    content: string
    cta: string
    coverImage: string
    branch: string
    branchColor: string
    readTime: string
    date: string
    whatsappKeyword: string
}

const Blog = () => {
    const { data: articles, loading } = useNotionData<Article>('/api/articles')
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null)

    const filteredArticles = selectedBranch
        ? articles.filter(article => article.branch === selectedBranch)
        : articles

    return (
        <div className="bg-[#050505] min-h-screen bg-grid relative overflow-hidden text-white font-sans">
            {/* Premium Background Overlay */}
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
            </div>

            {/* Dynamic Background Glows */}
            <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-1">
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-7xl flex flex-col items-center">
                    {/* Content Header removed per user request: 'dont repeat the title when on that specific tab' */}

                    {/* Branch Filter */}
                    <div className="flex flex-wrap gap-4 justify-center mb-24 animate-in fade-in delay-300">
                        <button
                            onClick={() => setSelectedBranch(null)}
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${selectedBranch === null
                                ? 'bg-sor7ed-yellow border-sor7ed-yellow text-black'
                                : 'bg-transparent border-white/10 text-zinc-500 hover:text-white hover:border-white/30'
                                }`}
                        >
                            ALL
                        </button>
                        {branches.map(branch => (
                            <button
                                key={branch.id}
                                onClick={() => setSelectedBranch(branch.name)}
                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${selectedBranch === branch.name
                                    ? 'bg-sor7ed-yellow border-sor7ed-yellow text-black'
                                    : 'bg-transparent border-white/10 text-zinc-500 hover:text-white hover:border-white/30'
                                    }`}
                            >
                                {branch.name}
                            </button>
                        ))}
                    </div>

                    {/* Articles Grid */}
                    {loading ? (
                        <div className="text-center py-20 w-full border border-dashed border-white/5 rounded-3xl">
                            <div className="text-[10px] font-mono-headline text-zinc-600 uppercase tracking-[0.15em] animate-pulse">Syncing Repository...</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                            {filteredArticles.map((article, i) => (
                                <div key={article.id} className="animate-in fade-in slide-in-from-bottom-20" style={{ animationDelay: `${i * 100}ms` }}>
                                    <BlogCard article={article} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Blog
