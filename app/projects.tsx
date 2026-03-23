import Image from "next/image";
import Link from "next/link";

const projects = [
    { slug: "anny", title: "Anny", cover: "/assets/projetos/Anny/01.png" },
    { slug: "debora", title: "Debora", cover: "/assets/projetos/Debora/01.png" },
    { slug: "felipe", title: "Felipe", cover: "/assets/projetos/Felipe/01.png" },
];

export default function Projects() {
    return (
        <div className="flex flex-col items-center px-4 sm:px-8 min-[1020px]:px-12 pt-20 sm:pt-32 min-[1020px]:pt-8">
            <div className="w-full max-w-7xl min-[1020px]:max-w-5xl xl:max-w-6xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl min-[1020px]:text-4xl font-light tracking-tight mb-6 sm:mb-8 min-[1020px]:mb-10">
                    Projetos
                </h2>

                <div className="project-grid grid grid-cols-3 sm:grid-cols-4 gap-0.5 sm:gap-1">
                    {projects.map((project) => (
                        <Link
                            key={project.slug}
                            href={`/projetos/${project.slug}`}
                            className="project-card group relative block overflow-hidden aspect-square"
                        >
                            <Image
                                src={project.cover}
                                alt={project.title}
                                fill
                                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/80 transition-colors duration-500" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <h3 className="text-sm sm:text-sm md:text-base font-medium tracking-widest text-foreground uppercase">
                                    {project.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
