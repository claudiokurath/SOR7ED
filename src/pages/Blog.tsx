import { useState } from 'react'
import BlogCard from '../components/BlogCard'
import { articles as fallbackArticles } from '../data/articles'
import { branches } from '../data/branches'
import { useNotionData } from '../hooks/useNotionData'

interface Article {
    id: string
    title: string
    excerpt: string
    branch: string
    branchColor: string
    readTime: string
    date: string
    whatsappKeyword: string
}

const Blog = () => {
    const { data: articles, loading } = useNotionData<Article>('/api/articles', fallbackArticles)
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null)

    const filteredArticles = selectedBranch
        ? articles.filter(article => article.branch === selectedBranch)
        : articles

    return (
        <div className="bg-black">
            <section className="container mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Blog</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Real talk about ADHD, neurodivergence, and building a life that actually works.
                    </p>
                </div>

                {/* Branch Filter */}
                <div className="flex flex-wrap gap-3 justify-center mb-12">
                    <button
                        onClick={() => setSelectedBranch(null)}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedBranch === null
                                ? 'bg-sor7ed-yellow text-black'
                                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                            }`}
                    >
                        All
                    </button>
                    {branches.map(branch => (
                        <button
                            key={branch.id} // Assuming branches have .id, based on branches.ts
                            onClick={() => setSelectedBranch(branch.name)}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors ${selectedBranch === branch.name
                                    ? 'bg-sor7ed-yellow text-black'
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                                }`}
                        >
                            <span className="mr-1">{branch.emoji}</span>
                            {branch.name}
                        </button>
                    ))}
                </div>

                {/* Articles Grid */}
                {loading && (
                    <div className="text-center text-gray-500 py-12">Loading articles...</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map(article => (
                        <BlogCard key={article.id} article={article} />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Blog
