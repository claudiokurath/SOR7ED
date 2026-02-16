import { useState, useEffect } from 'react'

interface DynamicToolProps {
    tool: {
        name: string
        slug: string
        desc: string
        template: string
        keyword: string
        price?: number
    }
    onDeploy: (keyword: string) => void
}

export default function DynamicTool({ tool, onDeploy }: DynamicToolProps) {
    const [config, setConfig] = useState<any>(null)
    const [values, setValues] = useState<Record<string, any>>({})
    const [result, setResult] = useState<any>(null)

    useEffect(() => {
        if (tool.template) {
            try {
                const parsed = JSON.parse(tool.template)
                setConfig(parsed)

                // Initialize default values
                const initial: Record<string, any> = {}
                parsed.fields?.forEach((f: any) => {
                    initial[f.id] = f.default || (f.type === 'number' ? 0 : '')
                })
                setValues(initial)
            } catch (e) {
                console.error("Failed to parse tool template:", e)
            }
        }
    }, [tool.template])

    const calculate = () => {
        if (!config?.logic) return
        try {
            // Very basic sandboxed evaluation (using Function constructor for simple math)
            // In a real app, use a safer math parser
            const vars = Object.keys(values).map(k => `const ${k} = ${values[k]};`).join(' ')
            const fn = new Function(`${vars} return ${config.logic};`)
            setResult(fn())
        } catch (e) {
            setResult("Error in calculation")
        }
    }

    if (!config) {
        return (
            <div className="p-12 border border-white/10 bg-black/40 backdrop-blur-xl rounded-sm">
                <h2 className="text-4xl font-black text-white uppercase mb-6">{tool.name}</h2>
                <div className="text-zinc-400 font-light leading-relaxed whitespace-pre-wrap mb-12">
                    {tool.desc}
                </div>
                <button onClick={() => onDeploy(tool.keyword)} className="btn-primary">
                    Deploy Protocol to WhatsApp
                </button>
            </div>
        )
    }

    return (
        <div className="p-12 border border-sor7ed-yellow/20 bg-black/40 backdrop-blur-3xl rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-mono-headline text-[8px] text-sor7ed-yellow/30 uppercase tracking-widest">
                / Operational System v1.0
            </div>

            <header className="mb-12 border-b border-white/5 pb-12">
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">{tool.name}</h2>
                <p className="text-zinc-500 font-mono-headline text-[10px] tracking-[0.3em] uppercase underline decoration-sor7ed-yellow/40 underline-offset-8">
                    {tool.slug.replace(/-/g, ' ')}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Inputs */}
                <div className="space-y-10">
                    {config.fields?.map((field: any) => (
                        <div key={field.id}>
                            <label className="block text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.2em] mb-4">
                                [ {field.label} ]
                            </label>
                            {field.type === 'number' ? (
                                <input
                                    type="number"
                                    value={values[field.id]}
                                    onChange={(e) => setValues({ ...values, [field.id]: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-white/5 border border-white/10 p-6 text-2xl font-black text-white focus:border-sor7ed-yellow outline-none transition-all rounded-sm"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={values[field.id]}
                                    onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 p-6 text-xl text-white focus:border-sor7ed-yellow outline-none transition-all rounded-sm"
                                />
                            )}
                        </div>
                    ))}

                    <button
                        onClick={calculate}
                        className="w-full p-6 border border-sor7ed-yellow text-sor7ed-yellow font-black uppercase tracking-widest hover:bg-sor7ed-yellow hover:text-black transition-all"
                    >
                        Execute Analysis
                    </button>
                </div>

                {/* Results & Guide */}
                <div className="flex flex-col">
                    <div className="p-8 bg-sor7ed-yellow/5 border border-sor7ed-yellow/20 rounded-sm mb-12">
                        <div className="text-[10px] font-mono-headline text-sor7ed-yellow/60 uppercase tracking-widest mb-6 border-b border-sor7ed-yellow/10 pb-4">
                            System Output Buffer
                        </div>
                        <div className="text-6xl font-black text-white tracking-tighter py-6">
                            {result !== null ? (
                                <div className="animate-in slide-in-from-bottom-4 duration-500">
                                    {result} <span className="text-2xl text-sor7ed-yellow font-light tracking-normal opacity-60 ml-4">{config.unit}</span>
                                </div>
                            ) : (
                                <span className="text-zinc-900 select-none">DATA_NULL</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-zinc-900/30 p-10 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="text-[120px] font-black leading-none select-none">07</span>
                        </div>

                        <div className="relative z-10">
                            <div className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] mb-8 flex items-center">
                                <span className="w-4 h-px bg-sor7ed-yellow mr-4" />
                                Operational Guide
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none text-zinc-400 font-light leading-relaxed">
                                <div className="whitespace-pre-wrap font-sans text-base leading-loose tracking-wide">
                                    {tool.desc}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center space-x-12">
                    <button
                        onClick={() => window.print()}
                        className="group flex items-center space-x-4 text-[10px] font-mono-headline text-zinc-500 hover:text-white uppercase tracking-widest transition-all"
                    >
                        <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-sor7ed-yellow group-hover:text-sor7ed-yellow transition-all">↓</span>
                        <span>[ EXPORT SYSTEM DOCUMENTATION • £{tool.price || 19} ]</span>
                    </button>
                </div>
                <div className="flex flex-col items-end gap-4">
                    <span className="text-[8px] font-mono-headline text-zinc-700 uppercase tracking-widest">Immediate Deployment Required?</span>
                    <button onClick={() => onDeploy(tool.keyword)} className="btn-primary">
                        Deploy to WhatsApp
                    </button>
                </div>
            </footer>
        </div>
    )
}
