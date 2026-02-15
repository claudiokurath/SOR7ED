import { useState } from 'react'

interface SocialSimulatorProps {
    onDeploy: () => void;
}

interface Scene {
    text: string;
    choices: { text: string; next: string; feedback: string }[];
}

export default function SocialSimulator({ onDeploy }: SocialSimulatorProps) {
    const [currentScene, setCurrentScene] = useState('start')
    const [feedback, setFeedback] = useState('')

    const scenarios: Record<string, Scene> = {
        start: {
            text: "You're at a networking event. Someone approaches you and says: \"Interesting keynote, didn't you think?\"",
            choices: [
                { text: "Agree and ask their favorite part", next: "flow_1", feedback: "Excellent. Reciprocating interest builds rapport." },
                { text: "Short answer and look away", next: "stuck_1", feedback: "Avoidance detected. This might signal disinterest." },
                { text: "Detailed analytical critique", next: "deep_1", feedback: "Bold approach. Ensure they share your level of technical interest." }
            ]
        },
        flow_1: {
            text: "They smile: \"I loved the bit about ADHD systems!\" They ask what you do for a living.",
            choices: [
                { text: "Give a 30-second elevator pitch", next: "win", feedback: "Perfect. concise and professional." },
                { text: "Tell a very long life story", next: "drift", feedback: "Watch for social cues—long stories can lose the audience." }
            ]
        },
        stuck_1: {
            text: "There is an awkward silence. They are waiting for more input.",
            choices: [
                { text: "Recover: Ask them the same question", next: "flow_1", feedback: "Good recovery. Deflection is a valid social tool." },
                { text: "Excuse yourself to get a drink", next: "exit", feedback: "Graceful exit. Useful when overstimulated." }
            ]
        },
        deep_1: {
            text: "They look impressed but a bit overwhelmed by the detail.",
            choices: [
                { text: "Notice the cue and simplify", next: "win", feedback: "Great awareness. Reading the room is key." },
                { text: "Keep going deep into the data", next: "drift", feedback: "Data dumping can be a form of masking or hyperfocus." }
            ]
        },
        win: {
            text: "Protocol Successful: Connection established efficiently.",
            choices: []
        },
        drift: {
            text: "Protocol Drift: The connection has lost synchronization.",
            choices: []
        },
        exit: {
            text: "Manual Override: Graceful dissociation applied.",
            choices: []
        }
    }

    const scene = scenarios[currentScene] || scenarios.start

    const handleChoice = (choice: any) => {
        setFeedback(choice.feedback)
        setCurrentScene(choice.next)
    }

    const reset = () => {
        setCurrentScene('start')
        setFeedback('')
    }

    return (
        <div className="space-y-12 py-8 flex flex-col items-center">
            <div className="text-center mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-sor7ed-yellow mb-2">Social Simulator</h3>
                <p className="text-zinc-500 font-mono-headline text-[10px]">Interaction mapping // Scripted response practice</p>
            </div>

            <div className="w-full max-w-2xl space-y-8">
                <div className="stealth-card p-12 bg-black/60 backdrop-blur-3xl border-white/5 relative overflow-hidden h-[400px] flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-4 font-mono-headline text-[8px] text-zinc-800 uppercase tracking-[0.5em]">Simulation_Runtime</div>

                    <p className="text-xl font-light leading-relaxed text-zinc-300 mb-12 text-center">
                        {scene.text}
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        {scene.choices.map((choice, i) => (
                            <button
                                key={i}
                                onClick={() => handleChoice(choice)}
                                className="w-full p-4 stealth-card border-white/10 hover:border-sor7ed-yellow hover:bg-sor7ed-yellow/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all text-left"
                            >
                                <span className="text-sor7ed-yellow mr-4">{i + 1}.</span> {choice.text}
                            </button>
                        ))}
                    </div>

                    {scene.choices.length === 0 && (
                        <button
                            onClick={reset}
                            className="btn-primary mt-8 self-center"
                        >
                            Reset Simulation
                        </button>
                    )}
                </div>

                {feedback && (
                    <div className="stealth-card p-6 bg-white/5 border-sor7ed-yellow/20 animate-in fade-in zoom-in duration-500">
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 bg-sor7ed-yellow rounded-full animate-pulse" />
                            <p className="text-[10px] font-mono-headline text-zinc-400 uppercase tracking-widest">System Feedback: <span className="text-white">{feedback}</span></p>
                        </div>
                    </div>
                )}

                <div className="pt-12 text-center">
                    <button onClick={onDeploy} className="btn-primary">
                        Sync to WhatsApp
                    </button>
                    <p className="mt-4 text-[9px] text-zinc-700 font-mono-headline uppercase tracking-[0.2em]">Deploy social scripts and templates to mobile</p>
                </div>
            </div>
        </div>
    )
}
