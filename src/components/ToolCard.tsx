interface Tool {
    id: string
    emoji: string
    name: string
    description: string
    whatsappKeyword: string
    category: string
}

interface ToolCardProps {
    tool: Tool
}

const ToolCard = ({ tool }: ToolCardProps) => {
    const whatsappUrl = `https://wa.me/447360277713?text=${encodeURIComponent(tool.whatsappKeyword)}`

    return (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-sor7ed-yellow transition-all card-hover">
            <div className="text-4xl mb-3">{tool.emoji}</div>
            <h3 className="text-xl font-bold mb-2 text-white">{tool.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-sor7ed-yellow text-black px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors text-sm"
            >
                Get via WhatsApp
            </a>
        </div>
    )
}

export default ToolCard
