import { Article } from '../data/articles'

interface BlogCardProps {
    article: Article;
}

export default function BlogCard({ article }: BlogCardProps) {
    return (
        <div className="bg-sor7ed-gray p-8 rounded-xl border border-sor7ed-gray-light hover:border-sor7ed-yellow transition group cursor-pointer">
            <span className="text-sor7ed-yellow text-xs font-bold uppercase tracking-widest">{article.category}</span>
            <h3 className="text-2xl font-bold mt-4 mb-4 group-hover:text-sor7ed-yellow transition-colors">{article.title}</h3>
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
            </div>
        </div>
    )
}
