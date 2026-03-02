import { useParams, useNavigate } from 'react-router-dom'
import { useVault } from '../context/VaultContext'
import { useNotionData } from '../hooks/useNotionData'
import { fallbackTools } from '../data/fallbackTools'
import { useEffect, useState } from 'react'
import FavoriteButton from '../components/FavoriteButton'

// Import all interactive tools
import FocusTimer from '../components/tools/FocusTimer'
import DopamineMenu from '../components/tools/DopamineMenu'
import BodyDouble from '../components/tools/BodyDouble'
import MoodTracker from '../components/tools/MoodTracker'
import TaskBreaker from '../components/tools/TaskBreaker'
import SensoryFidget from '../components/tools/SensoryFidget'
import DynamicTool from '../components/tools/DynamicTool'

const ToolDetail = () => {
    const { keyword } = useParams<{ keyword: string }>()
    const navigate = useNavigate()
    const { isLoggedIn, isLoading: sessionLoading } = useVault()
    const { data: apiTools, loading: toolsLoading } = useNotionData<any>('/api/tools')
    const [tool, setTool] = useState<any>(null)

    useEffect(() => {
        if (!sessionLoading && !isLoggedIn) {
            navigate('/vault')
        }
    }, [isLoggedIn, sessionLoading, navigate])

    useEffect(() => {
        const allTools = [...apiTools, ...fallbackTools]
        const found = allTools.find(t =>
            t.whatsappKeyword?.toLowerCase() === keyword?.toLowerCase() ||
            t.name?.toLowerCase().replace(/\s+/g, '-') === keyword?.toLowerCase()
        )
        setTool(found)
    }, [apiTools, keyword])

    if (sessionLoading || toolsLoading) {
        return (
            <div className="bg-[#050505] min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sor7ed-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!tool) {
        return (
            <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center px-6">
                <h1 className="text-4xl font-league-gothic text-white uppercase mb-4">Tool Not Found</h1>
                <button onClick={() => navigate('/tools')} className="text-sor7ed-yellow uppercase tracking-[0.15em] text-xs">Return to Lab</button>
            </div>
        )
    }

    const handleDeploy = () => {
        const whatsappUrl = `https://wa.me/447360277713?text=${encodeURIComponent(tool.whatsappKeyword || tool.name)}`
        window.open(whatsappUrl, '_blank')
    }

    // Mapping keyword to specialized interactive components
    const renderInteractiveTool = () => {
        const k = tool.whatsappKeyword?.toUpperCase()

        switch (k) {
            case 'TIME':
                return <FocusTimer onDeploy={handleDeploy} />
            case 'DOPAMINE':
                return <DopamineMenu onDeploy={handleDeploy} />
            case 'DOUBLE':
                return <BodyDouble onDeploy={handleDeploy} />
            case 'ENERGY':
                return <MoodTracker onDeploy={handleDeploy} />
            case 'BREAK':
                return <TaskBreaker onDeploy={handleDeploy} />
            case 'FIDGET':
                return <SensoryFidget onDeploy={handleDeploy} />
            default:
                // If the tool has a template, use DynamicTool
                if (tool.template) {
                    return <DynamicTool tool={tool} onDeploy={handleDeploy} />
                }
                // Fallback for tools without an interactive version yet
                return (
                    <div className="stealth-card p-12 text-center max-w-2xl mx-auto border-dashed border-white/10 opacity-80">
                        <div className="text-5xl mb-8 grayscale opacity-50">{tool.emoji || '⚙️'}</div>
                        <h2 className="text-4xl font-league-gothic text-white uppercase mb-4">{tool.name}</h2>
                        <p className="text-zinc-500 font-light leading-relaxed mb-12">{tool.description}</p>
                        <button onClick={handleDeploy} className="btn-primary">
                            Deploy to WhatsApp
                        </button>
                        <p className="text-[10px] font-mono-headline text-zinc-700 uppercase tracking-[0.15em] mt-8">
                             // WEB_INTERFACE_IN_DEVELOPMENT
                        </p>
                    </div>
                )
        }
    }

    return (
        <div className="bg-black min-h-screen bg-grid relative overflow-hidden text-white font-roboto">
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
            </div>

            <div className="relative z-10 pt-32 pb-40 px-6 container mx-auto max-w-7xl">
                <div className="mb-12 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-zinc-500 hover:text-white transition-colors flex items-center gap-4 text-[10px] font-mono-headline uppercase tracking-[0.15em]"
                    >
                        <span>← Back</span>
                    </button>
                    {tool && <FavoriteButton itemId={tool.id} itemType="tool" />}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000">
                    {renderInteractiveTool()}
                </div>
            </div>
        </div>
    )
}

export default ToolDetail
