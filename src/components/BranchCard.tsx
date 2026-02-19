import { Branch } from '../data/branches'

interface BranchCardProps {
    branch: Branch;
    delay?: number;
    className?: string;
}

export default function BranchCard({ branch, delay = 0, className = "" }: BranchCardProps) {
    return (
        <div
            className={`bg-sor7ed-yellow p-8 md:p-12 group transition-all duration-700 hover:-translate-y-2 flex flex-col justify-between h-full ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black mb-4 leading-[0.85]">
                {branch.name}
            </h3>
            <p className="text-black/80 font-medium text-sm md:text-base leading-relaxed max-w-sm">
                {branch.description}
            </p>
        </div>
    )
}
