import { useState } from 'react'

interface RoutineBuilderProps {
    onDeploy: () => void;
}

export default function RoutineBuilder({ onDeploy }: RoutineBuilderProps) {
    const palette = [
        { id: '1', text: 'Wake Up', icon: '🌅' },
        { id: '2', text: 'Hydrate', icon: '💧' },
        { id: '3', text: 'Deep Work', icon: '📚' },
        { id: '4', text: 'Movement', icon: '🏃' },
        { id: '5', text: 'Nutrition', icon: '🍲' },
        { id: '6', text: 'Review', icon: '📝' },
        { id: '7', text: 'Sensory Reset', icon: '🧘' },
        { id: '8', text: 'Sleep', icon: '🌙' }
    ]

    const [routine, setRoutine] = useState<{ id: string, text: string, icon: string }[]>([])

    const addToRoutine = (item: any) => {
        setRoutine([...routine, { ...item, instanceId: Math.random().toString() }])
    }

    const removeFromRoutine = (instanceId: string) => {
        setRoutine(routine.filter((item: any) => item.instanceId !== instanceId))
    }

    return (
        <div className="space-y-12 py-8 flex flex-col items-center">
            <div className="text-center mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-sor7ed-yellow mb-2">Routine Architect</h3>
                <p className="text-zinc-500 font-mono-headline text-[10px]">Sequential protocol building // Daily structure mapping</p>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Palette */}
                <div className="stealth-card p-8 space-y-8">
                    <h4 className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-4">Activity Palette</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {palette.map(item => (
                            <button
                                key={item.id}
                                onClick={() => addToRoutine(item)}
                                className="p-4 stealth-card bg-white/5 border-white/5 hover:border-sor7ed-yellow transition-all flex flex-col items-center group"
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                                <span className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-white transition-colors">{item.text}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="stealth-card p-8 space-y-8 bg-sor7ed-yellow/[0.02]">
                    <h4 className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-widest border-b border-sor7ed-yellow/10 pb-4">Active Protocol Timeline</h4>
                    <div className="space-y-4 min-h-[300px]">
                        {routine.length > 0 ? routine.map((item: any, i) => (
                            <div
                                key={item.instanceId}
                                className="flex items-center space-x-4 p-4 stealth-card border-white/10 animate-in slide-in-from-right-4 duration-500"
                            >
                                <div className="text-[10px] font-mono-headline text-zinc-700 w-8">{String(i + 1).padStart(2, '0')}</div>
                                <div className="text-xl">{item.icon}</div>
                                <div className="flex-grow text-[11px] font-bold uppercase tracking-widest text-white">{item.text}</div>
                                <button
                                    onClick={() => removeFromRoutine(item.instanceId)}
                                    className="text-zinc-600 hover:text-red-500 transition-colors px-2"
                                >
                                    ×
                                </button>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center space-y-4 py-20 grayscale opacity-20">
                                <div className="text-4xl">⚙️</div>
                                <p className="text-[9px] font-mono-headline uppercase tracking-widest">Awaiting Sequence Input</p>
                            </div>
                        )}
                    </div>

                    {routine.length > 0 && (
                        <button
                            onClick={() => setRoutine([])}
                            className="w-full py-4 text-[9px] font-mono-headline text-zinc-600 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            [ Clear Architecture ]
                        </button>
                    )}
                </div>
            </div>

            <div className="pt-12 text-center">
                <button onClick={onDeploy} className="btn-primary">
                    Sync to WhatsApp
                </button>
                <p className="mt-4 text-[9px] text-zinc-700 font-mono-headline uppercase tracking-[0.2em]">Deploy sequentially timed notifications to mobile</p>
            </div>
        </div>
    )
}
