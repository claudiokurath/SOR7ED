import { useState, useEffect, useRef } from 'react'

interface MoodTrackerProps {
    onDeploy: () => void;
}

export default function MoodTracker({ onDeploy }: MoodTrackerProps) {
    const [energy, setEnergy] = useState(5)
    const [entries, setEntries] = useState<{ date: string, mood: string, energy: number }[]>([])
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const moods = [
        { emoji: '😄', label: 'Very Happy' },
        { emoji: '🙂', label: 'Balanced' },
        { emoji: '😐', label: 'Neutral' },
        { emoji: '😔', label: 'Low' },
        { emoji: '😢', label: 'Overwhelmed' }
    ]

    const moodMap: Record<string, number> = { '😄': 5, '🙂': 4, '😐': 3, '😔': 2, '😢': 1 }

    useEffect(() => {
        const saved = localStorage.getItem('moodLogs')
        if (saved) setEntries(JSON.parse(saved))
    }, [])

    useEffect(() => {
        drawChart()
    }, [entries])

    const saveEntry = (mood: string) => {
        const entry = {
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mood,
            energy
        }
        const updated = [...entries, entry].slice(-10)
        setEntries(updated)
        localStorage.setItem('moodLogs', JSON.stringify(updated))
    }

    const drawChart = () => {
        const canvas = canvasRef.current
        if (!canvas || entries.length < 2) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const padding = 40
        const width = canvas.width - padding * 2
        const height = canvas.height - padding * 2
        const stepX = width / (entries.length - 1)

        // Energy Line
        ctx.beginPath()
        entries.forEach((entry, i) => {
            const x = padding + i * stepX
            const y = canvas.height - padding - (entry.energy / 10) * height
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })
        ctx.strokeStyle = '#fad64a'
        ctx.lineWidth = 3
        ctx.stroke()

        // Mood Line (Inverted, 5 is best)
        ctx.beginPath()
        entries.forEach((entry, i) => {
            const x = padding + i * stepX
            const y = canvas.height - padding - (moodMap[entry.mood] / 5) * height
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })
        ctx.strokeStyle = '#ffffff33'
        ctx.setLineDash([5, 5])
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.setLineDash([])
    }

    return (
        <div className="space-y-12 py-8 flex flex-col items-center">
            <div className="text-center mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-sor7ed-yellow mb-2">Biometric Tracker</h3>
                <p className="text-zinc-500 font-mono-headline text-[10px]">Internal state monitoring // Energy mapping</p>
            </div>

            <div className="w-full max-w-2xl space-y-12">
                <div className="stealth-card p-10 space-y-10">
                    <div className="flex justify-around">
                        {moods.map(m => (
                            <button
                                key={m.emoji}
                                onClick={() => saveEntry(m.emoji)}
                                className="text-4xl hover:scale-125 transition-transform"
                                title={m.label}
                            >
                                {m.emoji}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-mono-headline uppercase tracking-widest text-zinc-500">
                            <span>Depleted</span>
                            <span>Peak Energy: {energy}</span>
                        </div>
                        <input
                            type="range"
                            min="1" max="10"
                            value={energy}
                            onChange={(e) => setEnergy(parseInt(e.target.value))}
                            className="w-full accent-sor7ed-yellow h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="stealth-card p-4 border-white/5 bg-black/40 relative">
                    <div className="absolute top-4 left-4 text-[8px] font-mono-headline text-zinc-700 uppercase tracking-widest">/ History_Visualizer</div>
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={200}
                        className="w-full h-auto mt-8"
                    />
                    <div className="flex justify-center space-x-8 mt-4 text-[9px] font-mono-headline uppercase tracking-widest">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-0.5 bg-sor7ed-yellow" />
                            <span className="text-zinc-500">Energy Level</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-0.5 bg-white/20 border-b border-white/20 border-dashed" />
                            <span className="text-zinc-500">Mood Correlation</span>
                        </div>
                    </div>
                </div>

                <div className="pt-12 text-center">
                    <button onClick={onDeploy} className="btn-primary">
                        Sync to WhatsApp
                    </button>
                    <p className="mt-4 text-[9px] text-zinc-700 font-mono-headline uppercase tracking-[0.2em]">Deploy automated state logging to your device</p>
                </div>
            </div>
        </div>
    )
}
