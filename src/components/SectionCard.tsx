import { Link } from 'react-router-dom'
import { sections } from '../data/sections'
type Section = typeof sections[number]

interface SectionCardProps {
    section: Section;
    delay?: number;
    className?: string;
}

export default function SectionCard({ section, delay = 0, className = "" }: SectionCardProps) {
    return (
        <Link
            to={`/section/${section.id}`}
            className={`bg-sor7ed-yellow rounded-2xl p-6 md:p-10 group cursor-pointer transition-transform duration-500 hover:-translate-y-2 flex flex-col justify-between h-full block ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-6 md:mb-12">
                <h3 className="text-6xl md:text-7xl text-black break-words font-fuel-decay uppercase flex items-center gap-4">
                    {section.emoji} {section.name}
                </h3>
            </div>
            <div>
                <div>
                    <p className="text-[10px] font-mono-headline text-black/40 uppercase tracking-[0.15em] mb-1 md:mb-2">// DOMAIN</p>
                    <p className="text-black font-roboto font-medium text-sm md:text-base opacity-90">{section.description}</p>
                </div>
            </div>
        </Link>
    )
}
