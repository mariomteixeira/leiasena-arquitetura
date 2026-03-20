import Image from "next/image";
import Link from "next/link";

const projects = [
    {
        slug: "anny",
        title: "Residência Anny",
        category: "Residencial",
        cover: "/assets/projetos/Anny/01.png",
    },
    {
        slug: "samara",
        title: "Residência Samara",
        category: "Residencial",
        cover: "/assets/projetos/Samara/varanda.jpg",
    },
];

export default function Projects() {
    return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
                    Projetos
                </h2>
                <p className="mt-2 text-sm sm:text-base text-foreground/50">
                    Conheça nossos trabalhos
                </p>

                <div className="mt-10 sm:mt-14 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                    {projects.map(project => (
                        <Link
                            key={project.slug}
                            href={`/projetos/${project.slug}`}
                            className="group relative block overflow-hidden rounded-lg"
                        >
                            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                                <Image
                                    src={project.cover}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
                            </div>

                            <div className="mt-3">
                                <p className="text-xs uppercase tracking-widest text-foreground/40">
                                    {project.category}
                                </p>
                                <h3 className="mt-1 text-base sm:text-lg font-light tracking-tight text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                                    {project.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
