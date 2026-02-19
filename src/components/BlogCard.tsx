import { Link } from 'react-router-dom'

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

interface BlogCardProps {
    article: Article
}

const BlogCard = ({ article }: BlogCardProps) => {
    return (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-sor7ed-yellow transition-all card-hover flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
                <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: article.branchColor, color: '#000' }}
                >
                    {article.branch}
                </span>
                <span className="text-xs text-gray-500">{article.readTime}</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">
                <Link to={`/blog/${article.id}`} className="hover:text-sor7ed-yellow transition-colors">
                    {article.title}
                </Link>
            </h3>
            <p className="text-gray-400 text-sm mb-4 flex-grow">{article.excerpt}</p>
            <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-500">{article.date}</span>
                <Link
                    to={`/blog/${article.id}`}
                    className="text-sor7ed-yellow hover:text-yellow-500 text-sm font-semibold transition-colors"
                >
                    Read More →
                </Link>
            </div>
        </div>
    )
}

export default BlogCard
