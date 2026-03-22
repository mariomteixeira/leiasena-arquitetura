import Image from "next/image";
import Link from "next/link";

const projects = [
    { slug: "anny", title: "Anny", category: "Residencial", cover: "/assets/projetos/Anny/01.png" },
    { slug: "samara", title: "Samara", category: "Residencial", cover: "/assets/projetos/Samara/varanda.jpg" },
    { slug: "aurora", title: "Aurora", category: "Comercial", cover: "/assets/projetos/Aurora/cover.svg" },
    { slug: "helena", title: "Helena", category: "Residencial", cover: "/assets/projetos/Helena/cover.svg" },
    { slug: "vitoria", title: "Vitória", category: "Corporativo", cover: "/assets/projetos/Vitoria/cover.svg" },
    { slug: "clara", title: "Clara", category: "Residencial", cover: "/assets/projetos/Clara/cover.svg" },
    { slug: "luna", title: "Luna", category: "Interiores", cover: "/assets/projetos/Luna/cover.svg" },
    { slug: "marina", title: "Marina", category: "Residencial", cover: "/assets/projetos/Marina/cover.svg" },
    { slug: "olivia", title: "Olivia", category: "Comercial", cover: "/assets/projetos/Olivia/cover.svg" },
    { slug: "sofia", title: "Sofia", category: "Residencial", cover: "/assets/projetos/Sofia/cover.svg" },
    { slug: "isabel", title: "Isabel", category: "Interiores", cover: "/assets/projetos/Isabel/cover.svg" },
    { slug: "alice", title: "Alice", category: "Residencial", cover: "/assets/projetos/Alice/cover.svg" },
];

export default function Projects() {
    return (
        <div className="flex flex-col items-center px-4 sm:px-8 lg:px-12 pt-20 sm:pt-32 lg:pt-8">
            <div className="w-full max-w-7xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight mb-6 sm:mb-8 lg:mb-10">
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
                                <h3 className="text-[10px] sm:text-sm md:text-base font-medium tracking-widest text-foreground uppercase">
                                    {project.title}
                                </h3>
                                <p className="text-[8px] sm:text-[10px] md:text-xs tracking-widest text-foreground/60 uppercase mt-0.5">
                                    {project.category}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
