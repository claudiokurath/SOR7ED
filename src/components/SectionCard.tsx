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
            className={`stealth-card relative rounded-2xl p-6 md:p-10 flex flex-col justify-between h-full border border-white/5 hover:border-white/20 transition-all duration-500 bg-black/40 group block ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-6 md:mb-12">
                <h3 className="text-5xl md:text-6xl text-white break-words font-fuel-decay uppercase flex items-center gap-4 group-hover:text-sor7ed-yellow transition-colors">
                    {section.name}
                </h3>
            </div>

            <div className="flex-grow flex flex-col justify-end">
                <div className="mb-8">
                    <p className="text-[10px] font-mono-headline text-white/40 uppercase tracking-[0.15em] mb-2">{`// OVERVIEW`}</p>
                    <p className="text-white/90 font-roboto font-light text-sm md:text-base">{section.description}</p>
                </div>

                <div className="inline-flex items-center justify-center border border-white/20 bg-transparent text-white font-fuel-decay uppercase tracking-[0.2em] text-[10px] py-4 px-6 rounded-full group-hover:bg-white group-hover:text-black transition-colors w-max">
                    EXPLORE SECTION
                </div>
            </div>
        </Link>
    )
}
