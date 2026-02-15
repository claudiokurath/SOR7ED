import { useState } from 'react'

interface TimeVisualizerProps {
    onDeploy: () => void;
}

export default function TimeVisualizer({ onDeploy }: TimeVisualizerProps) {
    const [task, setTask] = useState('')
    const [duration, setDuration] = useState(30)
    const [buffer, setBuffer] = useState(15)

    const totalTime = duration + buffer
    const durationPercent = (duration / totalTime) * 100

    return (
        <div className="space-y-12 py-8">
            <div className="text-center mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-sor7ed-yellow mb-2">Time Blindness Visualizer</h3>
                <p className="text-zinc-500 font-mono-headline text-[10px]">Real-world duration mapping // Buffer inclusion</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
                <div className="stealth-card p-8">
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-widest mb-2 block">Current Objective</label>
                            <input
                                type="text"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                placeholder="e.g. Write report"
                                className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white focus:border-sor7ed-yellow transition-colors outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-widest mb-2 block">Base Duration (Min)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                                    className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white focus:border-sor7ed-yellow transition-colors outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-widest mb-2 block">ADHD Buffer (Min)</label>
                                <input
                                    type="number"
                                    value={buffer}
                                    onChange={(e) => setBuffer(parseInt(e.target.value) || 0)}
                                    className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-white focus:border-sor7ed-yellow transition-colors outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stealth-card p-8 border-sor7ed-yellow/20">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-8">System Prediction</h4>

                    <div className="relative h-12 w-full bg-white/5 rounded-full overflow-hidden mb-8">
                        <div
                            className="absolute top-0 left-0 h-full bg-sor7ed-yellow transition-all duration-700"
                            style={{ width: `${durationPercent}%` }}
                        />
                        <div
                            className="absolute top-0 h-full bg-white/20 transition-all duration-700"
                            style={{ left: `${durationPercent}%`, width: `${(buffer / totalTime) * 100}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono-headline uppercase tracking-widest">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-sor7ed-yellow rounded-full" />
                            <span className="text-zinc-400">Task: {duration}m</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-white/20 rounded-full" />
                            <span className="text-zinc-600">Buffer: {buffer}m</span>
                        </div>
                        <div className="text-white font-bold">
                            Total: {totalTime}m
                        </div>
                    </div>
                </div>

                <div className="pt-12 text-center">
                    <button onClick={onDeploy} className="btn-primary">
                        Sync to WhatsApp
                    </button>
                    <p className="mt-4 text-[9px] text-zinc-700 font-mono-headline uppercase">Download protocol for mobile recurring reminders</p>
                </div>
            </div>
        </div>
    )
}
