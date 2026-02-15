import { useState } from 'react'

interface TaskTriageProps {
    onDeploy: () => void;
}

export default function TaskTriage({ onDeploy }: TaskTriageProps) {
    const [urgency, setUrgency] = useState(50)
    const [interest, setInterest] = useState(50)
    const [energy, setEnergy] = useState(50)

    const getRecommendation = () => {
        if (energy < 20) return { title: "Regeneration Protocol", desc: "Low capacity detected. Prioritize rest or low-stimulation dopamine starters." }
        if (interest > 80 && urgency > 50) return { title: "Hyperfocus Engine", desc: "Optimal conditions. Initialize high-impact objectives now." }
        if (interest < 30 && urgency > 70) return { title: "Body Doubling Required", desc: "Low interest / High pressure. Use external accountability to overcome friction." }
        return { title: "Standard Execution", desc: "Balanced state. Select a 'Main' from your Dopamine Menu to build momentum." }
    }

    const rec = getRecommendation()

    return (
        <div className="space-y-12 py-8">
            <div className="text-center mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-sor7ed-yellow mb-2">EF Triage Tool</h3>
                <p className="text-zinc-500 font-mono-headline text-[10px]">Executive Function matching // Priority sorting</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-12">
                <div className="stealth-card p-10 space-y-10">
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-mono-headline uppercase tracking-widest text-zinc-500">
                            <span>Boredom</span>
                            <span>Interest / Novelty</span>
                        </div>
                        <input
                            type="range"
                            value={interest}
                            onChange={(e) => setInterest(parseInt(e.target.value))}
                            className="w-full accent-sor7ed-yellow hover:accent-white transition-colors h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-mono-headline uppercase tracking-widest text-zinc-500">
                            <span>Low Energy</span>
                            <span>Peak Capacity</span>
                        </div>
                        <input
                            type="range"
                            value={energy}
                            onChange={(e) => setEnergy(parseInt(e.target.value))}
                            className="w-full accent-sor7ed-yellow hover:accent-white transition-colors h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-mono-headline uppercase tracking-widest text-zinc-500">
                            <span>Low Pressure</span>
                            <span>Critical Urgency</span>
                        </div>
                        <input
                            type="range"
                            value={urgency}
                            onChange={(e) => setUrgency(parseInt(e.target.value))}
                            className="w-full accent-sor7ed-yellow hover:accent-white transition-colors h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="stealth-card p-10 border-sor7ed-yellow bg-sor7ed-yellow/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 font-mono-headline text-[8px] text-sor7ed-yellow/30 uppercase tracking-[0.5em]">Triage Active</div>
                    <h4 className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-widest mb-4">Recommended Protocol:</h4>
                    <h5 className="text-2xl font-black text-white uppercase mb-4">{rec.title}</h5>
                    <p className="text-zinc-400 font-light leading-relaxed">{rec.desc}</p>
                </div>

                <div className="pt-12 text-center">
                    <button onClick={onDeploy} className="btn-primary">
                        Sync to WhatsApp
                    </button>
                    <p className="mt-4 text-[9px] text-zinc-700 font-mono-headline uppercase">Download this strategy to your mobile concierge</p>
                </div>
            </div>
        </div>
    )
}
