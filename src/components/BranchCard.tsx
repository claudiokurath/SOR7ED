import { Branch } from '../data/branches'

interface BranchCardProps {
    branch: Branch;
    delay?: number;
}

export default function BranchCard({ branch, delay = 0 }: BranchCardProps) {
    return (
        <div
            className="stealth-card p-12 group"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-8 flex items-center">
                <span className="w-8 h-px bg-white/10 mr-4" />
                Vector {branch.name}
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-white mb-6 group-hover:text-sor7ed-yellow transition-colors leading-tight">
                {branch.name}
            </h3>
            <p className="text-zinc-500 font-light text-sm leading-relaxed mb-8">
                {branch.description}
            </p>

            <div className="pt-8 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Protocol 07</span>
                <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full group-hover:bg-sor7ed-yellow transition-colors" />
            </div>
        </div>
    )
}
