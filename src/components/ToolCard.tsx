import { Tool } from '../data/tools'

interface ToolCardProps {
    tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
    return (
        <div className="bg-sor7ed-gray p-8 rounded-xl border border-sor7ed-gray-light hover:border-sor7ed-yellow transition group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{tool.icon}</div>
            <h3 className="text-2xl font-bold mb-3">{tool.name}</h3>
            <p className="text-gray-400 mb-6">{tool.desc}</p>
            <div className="text-sor7ed-yellow font-bold text-sm uppercase tracking-widest">
                Try Tool →
            </div>
        </div>
    )
}
