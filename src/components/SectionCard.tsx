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
            className={`relative rounded-2xl overflow-hidden group cursor-pointer transition-transform duration-500 hover:-translate-y-2 h-full block ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <img
                    src={section.image}
                    alt={section.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 mix-blend-multiply"
                    style={{ backgroundColor: `${section.color}20` }}
                />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-10 min-h-[300px]">
                <div className="flex justify-between items-start mb-6 md:mb-12">
                    <h3 className="text-6xl md:text-7xl text-white break-words font-fuel-decay uppercase flex items-center gap-4 drop-shadow-md">
                        {section.name}
                    </h3>
                </div>
                <div>
                    <div>
                        <p className="text-[10px] font-mono-headline text-white/50 uppercase tracking-[0.15em] mb-1 md:mb-2">{`// OVERVIEW`}</p>
                        <p className="text-white font-roboto font-medium text-sm md:text-base opacity-95 drop-shadow-md">{section.description}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
