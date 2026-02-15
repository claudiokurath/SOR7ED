import { useState } from 'react'

interface TaskBreakerProps {
    onDeploy: () => void;
}

export default function TaskBreaker({ onDeploy }: TaskBreakerProps) {
    const [bigTask, setBigTask] = useState('')
    const [steps, setSteps] = useState<{ text: string, done: boolean }[]>([])

    const breakTask = () => {
        if (!bigTask.trim()) return;

        let newSteps: string[] = [`Initial Setup: Gather necessary materials for "${bigTask}"`];
        const lowerTask = bigTask.toLowerCase();

        if (lowerTask.includes('clean')) {
            newSteps.push("Visual Sweep: Pick up all items from the floor",
                "Surface Action: Wipe down all horizontal surfaces",
                "Floor Protocol: Vacuum or sweep the central area",
                "Detail Phase: Address one corner specifically",
                "Final Pass: Empty the trash and reset tools");
        } else if (lowerTask.includes('write') || lowerTask.includes('essay') || lowerTask.includes('report')) {
            newSteps.push("Outline Phase: Draft 3 key bullet points",
                "Data Collection: Open all necessary tabs or documents",
                "Drafting: Write without editing for 10 minutes",
                "Refining: Fix grammar/flow in the first paragraph only",
                "Citation Protocol: Check all sources and links");
        } else if (lowerTask.includes('code') || lowerTask.includes('program') || lowerTask.includes('software')) {
            newSteps.push("Logic Mapping: Comment out the desired pseudo-code",
                "Module Setup: Create necessary files and imports",
                "Core Logic: Implement the primary function only",
                "Debugger Loop: Run the code and fix the first error found",
                "Refactor Phase: Clean up variable names and formatting");
        } else {
            // Generic dynamic split for unknown tasks
            for (let i = 1; i <= 5; i++) {
                newSteps.push(`Sub-Objective ${i}: Execute the next logical component of "${bigTask}"`);
            }
        }

        newSteps.push("Recovery: Take 5 minutes for sensory reset");

        setSteps(newSteps.map(s => ({ text: s, done: false })));
    }

    const toggleStep = (index: number) => {
        const updated = [...steps];
        updated[index].done = !updated[index].done;
        setSteps(updated);
    }

    return (
        <div className="space-y-12 py-8 flex flex-col items-center">
            <div className="text-center mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-sor7ed-yellow mb-2">Task Deconstructor</h3>
                <p className="text-zinc-500 font-mono-headline text-[10px]">Overwhelming objective // Atomic breakdown</p>
            </div>

            <div className="w-full max-w-2xl space-y-8">
                <div className="stealth-card p-8 bg-black/40 backdrop-blur-xl border-white/5">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={bigTask}
                            onChange={(e) => setBigTask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && breakTask()}
                            placeholder="Enter a complex task..."
                            className="flex-grow bg-white/5 border border-white/10 rounded-sm p-4 text-white focus:border-sor7ed-yellow transition-colors outline-none font-mono-headline text-xs tracking-widest"
                        />
                        <button
                            onClick={breakTask}
                            className="btn-primary whitespace-nowrap"
                        >
                            Break It Down
                        </button>
                    </div>
                </div>

                {steps.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                onClick={() => toggleStep(i)}
                                className={`stealth-card p-6 flex items-center space-x-6 cursor-pointer transition-all duration-500 group ${step.done ? 'opacity-30 border-transparent saturate-0' : 'hover:border-sor7ed-yellow'}`}
                            >
                                <div className={`w-6 h-6 rounded-sm border flex items-center justify-center transition-all ${step.done ? 'bg-sor7ed-yellow border-sor7ed-yellow' : 'border-white/20 group-hover:border-sor7ed-yellow'}`}>
                                    {step.done && <span className="text-black font-black text-xs">✓</span>}
                                </div>
                                <span className={`text-sm tracking-wide transition-all ${step.done ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
                                    {step.text}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-12 text-center">
                    <button onClick={onDeploy} className="btn-primary">
                        Sync to WhatsApp
                    </button>
                    <p className="mt-4 text-[9px] text-zinc-700 font-mono-headline uppercase tracking-[0.2em]">Deploy automated breakdown triggers to mobile</p>
                </div>
            </div>
        </div>
    )
}
