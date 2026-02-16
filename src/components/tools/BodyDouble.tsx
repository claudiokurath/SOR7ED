import React, { useState, useEffect } from 'react';

interface BodyDoubleProps {
    onDeploy: () => void;
}

export default function BodyDouble({ onDeploy }: BodyDoubleProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState("Waiting for task initiation...");
    const [task, setTask] = useState("");

    // Virtual messages during session
    const messages = [
        "Are you still on track?",
        "Don't get stuck on the details.",
        "Just make it 'good enough' for now.",
        "Take a breath. Keep going.",
        "I'm working right here with you.",
        "Focus on the next smallest step."
    ];

    const [currentMsg, setCurrentMsg] = useState(messages[0]);

    useEffect(() => {
        let interval: any;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                // Change message every 5 minutes
                if (timeLeft % 300 === 0) {
                    setCurrentMsg(messages[Math.floor(Math.random() * messages.length)]);
                }
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            setStatus("Session Complete. Good work.");
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
        if (!isRunning) setStatus("Session Active. I'm watching.");
        else setStatus("Session Paused.");
    };

    return (
        <div className="p-12 border border-sor7ed-yellow/20 bg-black/40 backdrop-blur-3xl rounded-sm relative overflow-hidden flex flex-col h-full justify-between">
            <div className="absolute top-0 right-0 p-4 font-mono-headline text-[8px] text-zinc-600 uppercase tracking-widest">
                / PRESENCE ENGINE v1.0
            </div>

            {/* Header / Avatar Area */}
            <div className="flex flex-col items-center mb-12 relative">
                <div className={`w-32 h-32 rounded-full border-2 ${isRunning ? 'border-sor7ed-yellow animate-pulse' : 'border-zinc-800'} flex items-center justify-center mb-6 relative`}>
                    <div className="absolute inset-0 rounded-full border border-sor7ed-yellow/20 animate-ping opacity-20" />
                    <span className="text-4xl">👀</span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                    VIRTUAL BODY DOUBLE
                </h2>
                <p className={`font-mono-headline text-[10px] tracking-widest uppercase ${isRunning ? 'text-sor7ed-yellow' : 'text-zinc-500'}`}>
                    {status}
                </p>
            </div>

            {/* Task Input */}
            <div className="mb-10 text-center w-full">
                {!isRunning ? (
                    <input
                        type="text"
                        placeholder="What are we working on?"
                        className="w-full bg-transparent border-b border-zinc-800 text-center text-xl text-white placeholder-zinc-700 py-2 focus:border-sor7ed-yellow outline-none transition-colors"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                ) : (
                    <div className="text-2xl text-white font-light opacity-80 animate-pulse">
                        "{task}"
                    </div>
                )}
            </div>

            {/* Timer Display */}
            <div className="flex justify-center mb-12">
                <div className="text-[6rem] font-black text-white leading-none tracking-tighter tabular-nums text-center">
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Chat Bubble Simulation */}
            {isRunning && (
                <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 mb-8 animate-in slide-in-from-bottom-2">
                    <p className="text-zinc-400 text-sm italic text-center">
                        "{currentMsg}"
                    </p>
                </div>
            )}

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={toggleTimer}
                    className={`p-4 font-black uppercase tracking-widest transition-all ${isRunning
                        ? 'border border-red-500/50 text-red-500 hover:bg-red-500/10'
                        : 'bg-sor7ed-yellow text-black hover:scale-[1.02]'}`}
                >
                    {isRunning ? 'PAUSE' : 'START SESSION'}
                </button>
                <button
                    onClick={() => {
                        setIsRunning(false);
                        setTimeLeft(25 * 60);
                        setTask("");
                        setStatus("Reset Complete.");
                    }}
                    className="p-4 border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 font-black uppercase tracking-widest transition-all"
                >
                    RESET
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                <button onClick={onDeploy} className="text-[10px] font-mono-headline text-zinc-500 hover:text-sor7ed-yellow uppercase tracking-widest flex items-center gap-2">
                    <span>Need a text buddy?</span>
                    <span className="border-b border-sor7ed-yellow/50">Deploy to WhatsApp</span>
                </button>
            </div>
        </div>
    );
}
