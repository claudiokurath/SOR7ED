import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'

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

interface BlogCardProps {
    article: Article
}

const BlogCard = ({ article }: BlogCardProps) => {
    return (
        <div className="stealth-card group hover:border-white/20 transition-all duration-700 flex flex-col aspect-[4/5] overflow-hidden relative">
            <Link to={`/blog/${encodeURIComponent(article.title)}`} className="absolute inset-0 z-10" />

            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                {article.coverImage ? (
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-900/50 flex items-center justify-center">
                        <span className="text-zinc-800 font-mono-headline text-[10px] uppercase tracking-[0.15em]">// NO_DATA_STREAM</span>
                    </div>
                )}
            </div>

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />

            {/* Favorite Button Overlay */}
            <div className="absolute top-4 right-4 z-20">
                <FavoriteButton itemId={article.id} itemType="blog" />
            </div>

            {/* Title & Branch Overlay */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-20 pointer-events-none">
                <span className="text-[9px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.4em] mb-3">
                    {article.branch}
                </span>
                <h3 className="text-xl md:text-2xl font-fuel-decay uppercase tracking-[0.1em] text-white group-hover:text-sor7ed-yellow transition-colors break-words mb-4">
                    {article.title}
                </h3>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-[9px] font-mono-headline text-zinc-400 uppercase tracking-[0.15em]">{article.readTime}</span>
                    <span className="text-sor7ed-yellow text-lg">→</span>
                </div>
            </div>
        </div>
    )
}

export default BlogCard
