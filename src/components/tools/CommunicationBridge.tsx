import React, { useState } from 'react';

interface CommunicationBridgeProps {
    onDeploy: () => void;
}

export default function CommunicationBridge({ onDeploy }: CommunicationBridgeProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const transform = () => {
        if (!input) return;
        setLoading(true);
        setOutput('');

        // Simulating AI processing with basic logic / templates for now
        // In reality, this would call an API or use more complex regex
        setTimeout(() => {
            let processed = input
                .replace(/I hate doing this/gi, "I would appreciate clarification on the necessity of this task")
                .replace(/this is stupid/gi, "I have concerns regarding the efficiency of this approach")
                .replace(/leave me alone/gi, "I require dedicated focus time to complete this effectively")
                .replace(/I don't care/gi, "I am deferring to your judgment on this matter")
                .replace(/I forgot/gi, "This slipped my radar; rectifying immediately")
                .replace(/stop micromanaging me/gi, "I work best with autonomy and will provide regular updates")
                .replace(/no/gi, "Unfortunately, I do not have the capacity for this at the moment")
                .replace(/I'm overwhelmed/gi, "I am currently at capacity and need to prioritize critical deliverables");

            if (processed === input) {
                // Fallback catch-all if no keywords match
                processed = "Thank you for your patience. I am currently reviewing the requirements and will provide a comprehensive update shortly.";
            }

            setOutput(processed);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="p-12 border border-sor7ed-yellow/20 bg-black/40 backdrop-blur-3xl rounded-sm relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 p-4 font-mono-headline text-[8px] text-zinc-600 uppercase tracking-widest">
                / Email Shield v3.1
            </div>

            <header className="mb-10 border-b border-white/5 pb-8">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Communication Bridge</h2>
                <p className="text-zinc-500 font-mono-headline text-[10px] tracking-[0.2em] uppercase">
                    Raw Thought → Corporate Safe
                </p>
            </header>

            <div className="flex-1 flex flex-col gap-8">
                {/* Input Area */}
                <div className="relative group">
                    <label className="text-[10px] font-mono-headline text-red-400 uppercase tracking-widest mb-2 block group-hover:text-red-300 transition-colors">
                        [ RAW EMOTIONAL INPUT ]
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type what you REALLY want to say... (e.g. 'Leave me alone')"
                        className="w-full bg-red-900/10 border border-red-500/20 p-6 text-xl text-white placeholder-red-300/30 h-40 focus:border-red-500 outline-none transition-all rounded-sm resize-none"
                    />
                </div>

                {/* Arrow */}
                <div className="flex justify-center -my-4 relative z-10">
                    <button
                        onClick={transform}
                        disabled={loading || !input}
                        className={`w-12 h-12 rounded-full border border-white/10 bg-black flex items-center justify-center transition-all ${loading ? 'animate-spin border-sor7ed-yellow text-sor7ed-yellow' : 'hover:border-sor7ed-yellow hover:text-sor7ed-yellow text-zinc-500'}`}
                    >
                        ↓
                    </button>
                </div>

                {/* Output Area */}
                <div className="relative group flex-1">
                    <label className="text-[10px] font-mono-headline text-green-400 uppercase tracking-widest mb-2 block group-hover:text-green-300 transition-colors">
                        [ SCALPEL-CLEAN OUTPUT ]
                    </label>
                    <div className={`w-full bg-green-900/10 border border-green-500/20 p-6 h-40 rounded-sm relative transition-all ${output ? 'opacity-100' : 'opacity-50'}`}>
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-mono-headline text-green-500 animate-pulse text-xs tracking-widest">SANITIZING...</span>
                            </div>
                        ) : (
                            <textarea
                                readOnly
                                value={output}
                                placeholder="Output will appear here..."
                                className="w-full h-full bg-transparent border-none text-xl text-green-100 placeholder-green-700/30 outline-none resize-none"
                            />
                        )}

                        {output && (
                            <button
                                onClick={() => { navigator.clipboard.writeText(output); alert("Copied!"); }}
                                className="absolute bottom-4 right-4 text-[10px] font-mono-headline text-green-500 hover:text-white uppercase tracking-widest border border-green-500/30 px-3 py-1 rounded hover:bg-green-500/20 transition-all"
                            >
                                COPY
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <footer className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="text-[9px] text-zinc-600 font-mono-headline tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    FILTER ACTIVE
                </div>
                <button onClick={onDeploy} className="btn-primary">
                    Deploy to WhatsApp
                </button>
            </footer>
        </div>
    );
}
