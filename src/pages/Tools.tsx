import ToolCard from '../components/ToolCard'
import { tools as fallbackTools } from '../data/tools'
import { useNotionData } from '../hooks/useNotionData'

interface Tool {
    id: string
    emoji: string
    name: string
    description: string
    whatsappKeyword: string
    category: string
}

const Tools = () => {
    const { data: tools, loading } = useNotionData<Tool>('/api/tools', fallbackTools)

    return (
        <div className="bg-black">
            <section className="container mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">ADHD-Friendly Tools</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Instant templates and resources delivered via WhatsApp. No downloads, no accounts, no friction.
                    </p>
                </div>
                {loading && (
                    <div className="text-center text-gray-500 py-12">Loading tools...</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Tools
