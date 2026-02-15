import { useState, useEffect, useRef } from 'react'

interface FocusTimerProps {
    onDeploy: () => void;
}

export default function FocusTimer({ onDeploy }: FocusTimerProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [isWork, setIsWork] = useState(true)
    const timerRef = useRef<any>(null)

    const toggleTimer = () => setIsActive(!isActive)

    const resetTimer = () => {
        setIsActive(false)
        setIsWork(true)
        setTimeLeft(25 * 60)
    }

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-buzzer-989.mp3').play().catch(() => { })
            const nextMode = !isWork
            setIsWork(nextMode)
            setTimeLeft(nextMode ? 25 * 60 : 5 * 60)
            setIsActive(false)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isActive, timeLeft, isWork])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
        const secs = (seconds % 60).toString().padStart(2, '0')
        return `${mins}:${secs}`
    }

    return (
        <div className="space-y-12 py-8 flex flex-col items-center">
            <div className="text-center mb-8">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-sor7ed-yellow mb-2">Focus Engine</h3>
                <p className="text-zinc-500 font-mono-headline text-[10px]">Strategic deep work // Sensory interval management</p>
            </div>

            <div className="relative group">
                {/* Visual Progress Ring (Simulated with text shadows/borders for minimal Lab aesthetic) */}
                <div className={`stealth-card w-80 h-80 rounded-full flex flex-col items-center justify-center border-4 transition-colors duration-1000 ${isWork ? 'border-sor7ed-yellow/20' : 'border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]'}`}>
                    <div className="text-[10px] font-mono-headline text-zinc-600 uppercase tracking-[0.3em] mb-4">
                        {isWork ? '/ Deep_Focus_Active' : '/ Sensory_Recovery'}
                    </div>
                    <div className={`text-7xl font-black tracking-tighter tabular-nums ${isWork ? 'text-white' : 'text-blue-400 animate-pulse'}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="mt-8 flex space-x-4">
                        <button onClick={toggleTimer} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-zinc-800 text-zinc-400' : 'bg-sor7ed-yellow text-black hover:scale-105'}`}>
                            {isActive ? 'Pause' : 'Start'}
                        </button>
                        <button onClick={resetTimer} className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                            Reset
                        </button>
                    </div>
                </div>

                {/* Status Indicator */}
                {!isWork && (
                    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full text-center animate-in slide-in-from-top duration-700">
                        <div className="stealth-card p-4 border-blue-500/30 bg-blue-500/5">
                            <h4 className="text-blue-400 font-bold uppercase text-[10px] tracking-widest mb-1">Break Active</h4>
                            <p className="text-zinc-400 text-[11px] font-light italic">Try the Sensory Fidget or a quick stretch.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-24 text-center">
                <button onClick={onDeploy} className="btn-primary">
                    Sync to WhatsApp
                </button>
                <p className="mt-4 text-[9px] text-zinc-700 font-mono-headline uppercase tracking-[0.2em]">Deploy recurring focus pulses to your device</p>
            </div>
        </div>
    )
}
