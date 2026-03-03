import { useNavigate } from 'react-router-dom'
import { useVault } from '../context/VaultContext'

interface Tool {
    id: string
    emoji: string
    name: string
    description: string
    whatsappKeyword: string
    category: string
    coverImage?: string
}

interface ToolCardProps {
    tool: Tool
}

const ToolCard = ({ tool }: ToolCardProps) => {
    const navigate = useNavigate()
    const { isLoggedIn } = useVault()

    const handleClick = () => {
        if (isLoggedIn) {
            const slug = (tool.whatsappKeyword || tool.name).toLowerCase().replace(/\s+/g, '-')
            navigate(`/tool/${slug}`)
        } else {
            navigate('/vault')
        }
    }

    return (
        <div
            onClick={handleClick}
            className="stealth-card group hover:border-sor7ed-yellow/40 transition-all duration-700 cursor-pointer overflow-hidden p-0 aspect-[4/3] relative"
        >
            {/* Background Image / Emoji */}
            <div className="absolute inset-0 w-full h-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                {tool.coverImage ? (
                    <img
                        src={tool.coverImage}
                        alt={tool.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                    />
                ) : (
                    <div className="text-6xl grayscale group-hover:grayscale-0 transition-all duration-500 opacity-20 group-hover:opacity-40">
                        {tool.emoji || '🛠️'}
                    </div>
                )}
            </div>

            {/* Dark Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

            {/* Title Overlay */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <span className="text-[9px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.3em] mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    // {tool.category || 'LAB_PROTOCOL'}
                </span>
                <h3 className="text-4xl md:text-5xl font-fuel-decay uppercase tracking-[0.1em] text-white group-hover:text-sor7ed-yellow transition-colors break-words">
                    {tool.name}
                </h3>
                <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100 mt-2">
                    <span className="text-[10px] font-mono-headline text-zinc-400 uppercase tracking-[0.15em]">
                        Initialize Connection →
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ToolCard
