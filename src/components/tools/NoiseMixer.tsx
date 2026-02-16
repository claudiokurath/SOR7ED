import { useState, useEffect, useRef } from 'react'

interface NoiseMixerProps {
    onDeploy: () => void
}

export default function NoiseMixer({ onDeploy }: NoiseMixerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volumes, setVolumes] = useState({ brown: 0.5, pink: 0.3, white: 0.1 })

    // Audio Context Refs
    const audioCtxRef = useRef<AudioContext | null>(null)
    const oscillatorsRef = useRef<any[]>([])

    // Initialize Audio Context
    useEffect(() => {
        return () => stopAudio()
    }, [])

    const createNoiseBuffer = (ctx: AudioContext, type: 'white' | 'pink' | 'brown') => {
        const bufferSize = 2 * ctx.sampleRate
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const output = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            if (type === 'white') {
                output[i] = white
            } else if (type === 'pink') {
                const b = [0, 0, 0, 0, 0, 0, 0]
                const white = Math.random() * 2 - 1
                b[0] = 0.99886 * b[0] + white * 0.0555179
                b[1] = 0.99332 * b[1] + white * 0.0750759
                b[2] = 0.96900 * b[2] + white * 0.1538520
                b[3] = 0.86650 * b[3] + white * 0.3104856
                b[4] = 0.55000 * b[4] + white * 0.5329522
                b[5] = -0.7616 * b[5] - white * 0.0168980
                output[i] = b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + white * 0.5362
                output[i] *= 0.11
            } else if (type === 'brown') {
                const lastOut = 0
                const white = Math.random() * 2 - 1
                output[i] = (lastOut + (0.02 * white)) / 1.02
                output[i] *= 3.5
            }
        }
        return buffer
    }

    const startAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        const ctx = audioCtxRef.current

        // Create sources if mostly null
        if (oscillatorsRef.current.length === 0) {
            ['brown', 'pink', 'white'].forEach((type) => {
                const noiseBuffer = createNoiseBuffer(ctx, type as any)
                const noiseSource = ctx.createBufferSource()
                noiseSource.buffer = noiseBuffer
                noiseSource.loop = true

                const gainNode = ctx.createGain()
                // Initial volume set to 0, controlled by effect
                gainNode.gain.value = 0

                noiseSource.connect(gainNode)
                gainNode.connect(ctx.destination)

                noiseSource.start()
                oscillatorsRef.current.push({ source: noiseSource, gain: gainNode, type })
            })
        }

        // Resume if suspended
        if (ctx.state === 'suspended') ctx.resume()

        // Apply current volumes
        oscillatorsRef.current.forEach(osc => {
            osc.gain.gain.rampToValueAtTime(volumes[osc.type as keyof typeof volumes], ctx.currentTime + 0.1)
        })

        setIsPlaying(true)
    }

    const stopAudio = () => {
        if (audioCtxRef.current) {
            oscillatorsRef.current.forEach(osc => {
                osc.gain.gain.rampToValueAtTime(0, audioCtxRef.current!.currentTime + 0.1)
            })
            setTimeout(() => {
                setIsPlaying(false)
                // We don't fully close to allow quick resume, or we could suspend
                audioCtxRef.current?.suspend()
            }, 100)
        }
    }

    const handleVolumeChange = (type: 'brown' | 'pink' | 'white', val: number) => {
        setVolumes(prev => ({ ...prev, [type]: val }))
        if (isPlaying && audioCtxRef.current) {
            const osc = oscillatorsRef.current.find(o => o.type === type)
            if (osc) {
                osc.gain.gain.setTargetAtTime(val, audioCtxRef.current.currentTime, 0.1)
            }
        }
    }

    return (
        <div className="p-10 border border-sor7ed-yellow/20 bg-black/40 backdrop-blur-3xl rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-mono-headline text-[8px] text-sor7ed-yellow/30 uppercase tracking-widest">
                / Audio Synthesis v2.4
            </div>

            <header className="mb-12 border-b border-white/5 pb-10">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Noise Control</h2>
                <div className="flex items-center justify-between">
                    <p className="text-zinc-500 font-mono-headline text-[10px] tracking-[0.2em] uppercase">
                        Sensory Gating System
                    </p>
                    <button
                        onClick={isPlaying ? stopAudio : startAudio}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isPlaying ? 'border-sor7ed-yellow text-sor7ed-yellow animate-pulse' : 'border-white/20 text-zinc-500 hover:border-white hover:text-white'}`}
                    >
                        {isPlaying ? '■' : '▶'}
                    </button>
                </div>
            </header>

            <div className="space-y-12 mb-16">
                {[
                    { type: 'brown', label: 'Brown Noise', desc: 'Deep, rumbling. Good for focus & silencing inner monologue.' },
                    { type: 'pink', label: 'Pink Noise', desc: 'Balanced, waterfall-like. Good for sustained attention.' },
                    { type: 'white', label: 'White Noise', desc: 'Sharp, static. Good for masking external speech.' }
                ].map(channel => (
                    <div key={channel.type} className="group">
                        <div className="flex justify-between mb-4">
                            <label className="text-[10px] font-mono-headline text-zinc-400 uppercase tracking-widest group-hover:text-sor7ed-yellow transition-colors">
                                {channel.label}
                            </label>
                            <span className="text-[10px] font-mono-headline text-zinc-600">
                                {Math.round((volumes[channel.type as keyof typeof volumes] || 0) * 100)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volumes[channel.type as keyof typeof volumes]}
                            onChange={(e) => handleVolumeChange(channel.type as any, parseFloat(e.target.value))}
                            className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-zinc-600 [&::-webkit-slider-thumb]:hover:bg-sor7ed-yellow [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all"
                        />
                        <p className="mt-2 text-[10px] text-zinc-600 font-light">{channel.desc}</p>
                    </div>
                ))}
            </div>

            {/* Visualizer Mockup */}
            <div className="h-24 flex items-end justify-center space-x-1 mb-12 opacity-50">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="w-1 bg-sor7ed-yellow/50 transition-all duration-100 ease-in-out"
                        style={{
                            height: isPlaying ? `${Math.random() * 80 + 10}%` : '5%',
                            transitionDelay: `${i * 10}ms`
                        }}
                    />
                ))}
            </div>

            <footer className="pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="text-[9px] text-zinc-600 font-mono-headline tracking-widest">
                    SYSTEM: {isPlaying ? 'ONLINE' : 'STANDBY'}
                </div>
                <button onClick={onDeploy} className="btn-primary">
                    Deploy to WhatsApp
                </button>
            </footer>
        </div>
    )
}
