import { useState } from 'react'


interface DopamineMenuProps {
    onDeploy: () => void;
}

export default function DopamineMenu({ onDeploy }: DopamineMenuProps) {
    const [starter, setStarter] = useState<string[]>([])
    const [main, setMain] = useState<string[]>([])
    const [dessert, setDessert] = useState<string[]>([])

    const addStarter = () => {
        const item = prompt("Add a 5-minute Dopamine Starter (e.g. stretch, drink water, quick song):")
        if (item) setStarter([...starter, item])
    }

    const addMain = () => {
        const item = prompt("Add a 20-30 minute Dopamine Main (e.g. walk, reading, shower):")
        if (item) setMain([...main, item])
    }

    const addDessert = () => {
        const item = prompt("Add a Dopamine Dessert/Reward (e.g. gaming, favorite show):")
        if (item) setDessert([...dessert, item])
    }

    return (
        <div className="space-y-12 py-8">
            <div className="text-center mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-sor7ed-yellow mb-2">The Dopamine Menu</h3>
                <p className="text-zinc-500 font-mono-headline text-[10px]">Strategic stimulation for the ADHD brain</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Starters */}
                <div className="stealth-card p-4 border-blue-500/30">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-lg font-bold uppercase tracking-widest text-white">Starters</h4>
                            <p className="text-[9px] text-blue-400 uppercase font-mono-headline">5 Minutes // Quick Hit</p>
                        </div>
                        <button onClick={addStarter} className="w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all">+</button>
                    </div>
                    <ul className="space-y-3">
                        {starter.length > 0 ? starter.map((s, i) => (
                            <li key={i} className="text-sm text-zinc-300 border-l-2 border-blue-500/50 pl-4 py-1">{s}</li>
                        )) : (
                            <p className="text-xs text-zinc-600 italic">No starters added...</p>
                        )}
                    </ul>
                </div>

                {/* Mains */}
                <div className="stealth-card p-4 border-emerald-500/30">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-lg font-bold uppercase tracking-widest text-white">Mains</h4>
                            <p className="text-[9px] text-emerald-400 uppercase font-mono-headline">30 Minutes // Deep Burn</p>
                        </div>
                        <button onClick={addMain} className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">+</button>
                    </div>
                    <ul className="space-y-3">
                        {main.length > 0 ? main.map((m, i) => (
                            <li key={i} className="text-sm text-zinc-300 border-l-2 border-emerald-500/50 pl-4 py-1">{m}</li>
                        )) : (
                            <p className="text-xs text-zinc-600 italic">No mains added...</p>
                        )}
                    </ul>
                </div>

                {/* Desserts */}
                <div className="stealth-card p-4 border-purple-500/30">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h4 className="text-lg font-bold uppercase tracking-widest text-white">Desserts</h4>
                            <p className="text-[9px] text-purple-400 uppercase font-mono-headline">Rewards // End of Task</p>
                        </div>
                        <button onClick={addDessert} className="w-8 h-8 rounded-full border border-purple-500/30 flex items-center justify-center text-purple-500 hover:bg-purple-500 hover:text-white transition-all">+</button>
                    </div>
                    <ul className="space-y-3">
                        {dessert.length > 0 ? dessert.map((d, i) => (
                            <li key={i} className="text-sm text-zinc-300 border-l-2 border-purple-500/50 pl-4 py-1">{d}</li>
                        )) : (
                            <p className="text-xs text-zinc-600 italic">No desserts added...</p>
                        )}
                    </ul>
                </div>
            </div>

            <div className="pt-12 text-center">
                <button onClick={onDeploy} className="btn-primary">
                    Sync to WhatsApp
                </button>
            </div>
        </div>
    )
}
