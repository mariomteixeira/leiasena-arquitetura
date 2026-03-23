import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

function getProjects() {
    const projectsDir = path.join(process.cwd(), "public", "assets", "projetos");

    if (!fs.existsSync(projectsDir)) return [];

    return fs.readdirSync(projectsDir)
        .filter((name) => {
            const full = path.join(projectsDir, name);
            return fs.statSync(full).isDirectory();
        })
        .filter((name) => {
            const files = fs.readdirSync(path.join(projectsDir, name));
            return files.some((f) => /^01\.(png|jpg|jpeg|webp|avif)$/i.test(f));
        })
        .map((name) => {
            const files = fs.readdirSync(path.join(projectsDir, name));
            const cover = files.find((f) => f.startsWith("01.") && IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()));
            return {
                slug: name.toLowerCase(),
                title: name,
                cover: `/assets/projetos/${name}/${cover}`,
            };
        })
        .sort((a, b) => a.title.localeCompare(b.title));
}

export default function Projects() {
    const projects = getProjects();

    return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-8 min-[1020px]:flex min-[1020px]:items-center min-[1020px]:px-12 min-[1020px]:py-8 pt-20 sm:pt-32 min-[1020px]:pt-8">
            <div className="w-full max-w-7xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl min-[1020px]:text-5xl font-light tracking-tight mb-6 sm:mb-8 min-[1020px]:mb-10 font-mono">
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
