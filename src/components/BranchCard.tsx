import { branches } from '../data/branches'
type Branch = typeof branches[number]

interface BranchCardProps {
    branch: Branch;
    delay?: number;
    className?: string;
}

export default function BranchCard({ branch, delay = 0, className = "" }: BranchCardProps) {
    return (
        <div
            className={`bg-sor7ed-yellow rounded-2xl p-6 md:p-10 group cursor-default transition-transform duration-500 hover:-translate-y-2 flex flex-col justify-between h-full ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-6 md:mb-12">
                <h3 className="text-4xl text-black break-words">
                    {branch.name}
                </h3>
            </div>
            <div>
                <div className="mb-4">
                    <p className="text-[10px] font-mono-headline text-black/40 uppercase tracking-[0.15em] mb-1 md:mb-2">// THE_PROBLEM</p>
                    <p className="text-black font-league-gothic font-normal text-lg md:text-xl uppercase ">{branch.problem}</p>
                </div>
                <div>
                    <p className="text-[10px] font-mono-headline text-black/40 uppercase tracking-[0.15em] mb-1 md:mb-2">// THE_FIX</p>
                    <p className="text-black font-roboto font-normal text-xs md:text-sm  opacity-80">{branch.description}</p>
                </div>
            </div>
        </div>
    )
}
