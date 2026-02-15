import { useRef, useEffect, useState } from 'react'

interface SensoryFidgetProps {
    onDeploy: () => void;
}

export default function SensoryFidget({ onDeploy }: SensoryFidgetProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [bubbles, setBubbles] = useState<{ x: number, y: number, popped: boolean }[]>([])
    const bubbleSize = 40
    const spacing = 15
    const columns = 8
    const rows = 10

    const createBubbles = () => {
        const newBubbles = []
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                const x = c * (bubbleSize + spacing) + bubbleSize / 2 + spacing
                const y = r * (bubbleSize + spacing) + bubbleSize / 2 + spacing
                newBubbles.push({ x, y, popped: false })
            }
        }
        setBubbles(newBubbles)
    }

    useEffect(() => {
        createBubbles()
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        bubbles.forEach(b => {
            if (!b.popped) {
                // Main Bubble
                ctx.beginPath()
                ctx.arc(b.x, b.y, bubbleSize / 2, 0, Math.PI * 2)
                ctx.fillStyle = '#1e1e1e'
                ctx.fill()
                ctx.strokeStyle = '#fad64a33'
                ctx.lineWidth = 1
                ctx.stroke()

                // Highlight/Glow
                const gradient = ctx.createRadialGradient(b.x - 5, b.y - 5, 2, b.x, b.y, bubbleSize / 2)
                gradient.addColorStop(0, 'rgba(250, 214, 74, 0.2)')
                gradient.addColorStop(1, 'rgba(250, 214, 74, 0.05)')
                ctx.fillStyle = gradient
                ctx.fill()
            } else {
                // Popped state (subtle crater)
                ctx.beginPath()
                ctx.arc(b.x, b.y, bubbleSize / 2 - 5, 0, Math.PI * 2)
                ctx.strokeStyle = '#fad64a11'
                ctx.lineWidth = 1
                ctx.stroke()
            }
        })
    }, [bubbles])

    const handleInteraction = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const x = clientX - rect.left
        const y = clientY - rect.top

        let playedSound = false
        const newBubbles = bubbles.map(b => {
            if (!b.popped) {
                const dx = b.x - x
                const dy = b.y - y
                if (Math.sqrt(dx * dx + dy * dy) < bubbleSize / 2 + 5) {
                    if (!playedSound) {
                        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-bubble-pop-773.mp3').play().catch(() => { })
                        playedSound = true
                    }
                    return { ...b, popped: true }
                }
            }
            return b
        })

        if (playedSound) {
            setBubbles(newBubbles)
        }
    }

    return (
        <div className="space-y-12 py-8 flex flex-col items-center">
            <div className="text-center mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-sor7ed-yellow mb-2">Sensory Fidget</h3>
                <p className="text-zinc-500 font-mono-headline text-[10px]">Tactile regulation // Bubble Wrap Simulator</p>
            </div>

            <div className="relative group p-4 stealth-card border-white/5 bg-black/60 rounded-3xl backdrop-blur-xl">
                <div className="absolute -top-4 -left-4 text-[10px] font-mono-headline text-zinc-800 uppercase tracking-widest -rotate-90 origin-bottom-left">
                    / Physical_Input_Simulation
                </div>
                <canvas
                    ref={canvasRef}
                    width={460}
                    height={580}
                    className="max-w-full h-auto cursor-crosshair touch-none"
                    onClick={(e) => handleInteraction(e.clientX, e.clientY)}
                    onTouchStart={(e) => {
                        e.preventDefault()
                        handleInteraction(e.touches[0].clientX, e.touches[0].clientY)
                    }}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={createBubbles} className="btn-secondary text-[10px]">
                    Reset Sheet
                </button>
                <button onClick={onDeploy} className="btn-primary">
                    Sync to WhatsApp
                </button>
            </div>

            <p className="text-zinc-700 font-mono-headline text-[8px] uppercase tracking-[0.5em]">
                High-fidelity tactile response system active.
            </p>
        </div>
    )
}
