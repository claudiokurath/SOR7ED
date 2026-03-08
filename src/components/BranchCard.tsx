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
                <h3 className="text-6xl md:text-7xl text-black break-words font-fuel-decay uppercase">
                    {branch.name}
                </h3>
            </div>
            <div>
                <p className="text-black font-roboto font-normal text-sm md:text-base opacity-80 leading-relaxed">
                    {branch.description}
                </p>
            </div>
        </div>
    )
}
