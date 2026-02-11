import { Branch } from '../data/branches'

interface BranchCardProps {
    branch: Branch;
    delay?: number;
}

export default function BranchCard({ branch, delay = 0 }: BranchCardProps) {
    return (
        <div
            className={`glass p-8 rounded-2xl card-hover border-t-4 border-sor7ed-yellow/20`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="text-5xl mb-6">{branch.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-3">{branch.name}</h3>
            <p className="text-zinc-400 leading-relaxed">{branch.description}</p>
        </div>
    )
}
