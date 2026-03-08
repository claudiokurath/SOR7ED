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
            className={`relative rounded-3xl p-6 flex flex-col justify-between h-[300px] md:h-full min-h-[220px] transition-all duration-500 bg-sor7ed-yellow group block shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(245,198,20,0.4)] hover:-translate-y-1 ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-5xl md:text-5xl text-black break-words font-fuel-decay uppercase flex items-center gap-4">
                    {section.name}
                </h3>
            </div>

            <div className="flex-grow flex flex-col justify-end">
                <div className="mb-6">
                    <p className="text-[9px] font-mono-headline text-black/60 uppercase tracking-[0.15em] mb-1">{`// OVERVIEW`}</p>
                    <p className="text-black/90 font-roboto text-xs md:text-sm line-clamp-3">{section.description}</p>
                </div>

                <div className="inline-flex items-center justify-center border border-black bg-black text-sor7ed-yellow font-fuel-decay uppercase tracking-[0.2em] text-[10px] py-3 px-5 rounded-full group-hover:bg-zinc-900 transition-colors w-max">
                    EXPLORE SECTION
                </div>
            </div>
        </Link>
    )
}
