import { notFound } from "next/navigation";
import Image from "next/image";
import fs from "fs";
import path from "path";
import ProjectGallery from "./gallery";

interface ProjectMeta {
    title: string;
    category: string;
    description: string;
    details: string[];
    folder: string;
    cover: string;
}

const projects: Record<string, ProjectMeta> = {
    anny: {
        title: "Residência Anny",
        category: "Residencial",
        folder: "Anny",
        cover: "01.png",
        description:
            "Projeto residencial que busca a harmonia entre os espaços internos e a paisagem natural, com linhas contemporâneas e materiais nobres.",
        details: [
            "Área: 320m²",
            "Localização: Brasília, DF",
            "Ano: 2024",
            "Tipologia: Residencial",
        ],
    },
    samara: {
        title: "Residência Samara",
        category: "Residencial",
        folder: "Samara",
        cover: "varanda.jpg",
        description:
            "Projeto que valoriza a integração dos ambientes com a área externa, criando espaços fluidos e iluminados naturalmente.",
        details: [
            "Localização: Brasília, DF",
            "Ano: 2024",
            "Tipologia: Residencial",
        ],
    },
};

const placeholderProject = (title: string, folder: string, category: string): ProjectMeta => ({
    title,
    category,
    folder,
    cover: "cover.svg",
    description: "Projeto em desenvolvimento. Mais detalhes em breve.",
    details: ["Localização: Brasília, DF", `Tipologia: ${category}`],
});

Object.assign(projects, {
    aurora: placeholderProject("Aurora", "Aurora", "Comercial"),
    helena: placeholderProject("Residência Helena", "Helena", "Residencial"),
    vitoria: placeholderProject("Edifício Vitória", "Vitoria", "Corporativo"),
    clara: placeholderProject("Residência Clara", "Clara", "Residencial"),
    luna: placeholderProject("Studio Luna", "Luna", "Interiores"),
    marina: placeholderProject("Residência Marina", "Marina", "Residencial"),
    olivia: placeholderProject("Espaço Olivia", "Olivia", "Comercial"),
    sofia: placeholderProject("Residência Sofia", "Sofia", "Residencial"),
    isabel: placeholderProject("Studio Isabel", "Isabel", "Interiores"),
    alice: placeholderProject("Residência Alice", "Alice", "Residencial"),
});

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg"]);

function getProjectImages(folder: string, cover: string): string[] {
    const dir = path.join(process.cwd(), "public", "assets", "projetos", folder);

    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir)
        .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
        .sort((a, b) => {
            if (a === cover) return -1;
            if (b === cover) return 1;
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            if (!isNaN(numA)) return -1;
            if (!isNaN(numB)) return 1;
            return a.localeCompare(b);
        });

    return files.map((f) => `/assets/projetos/${folder}/${f}`);
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = projects[slug];

    if (!project) notFound();

    const images = getProjectImages(project.folder, project.cover);
    const coverSrc = images[0] ?? `/assets/projetos/${project.folder}/${project.cover}`;
    const galleryImages = images.slice(1);

    return (
        <div className="min-h-screen bg-ice-white">
            <div className="fixed top-0 left-0 w-full z-40 bg-ice-white/60 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5">
                <div className="px-4 sm:px-6 lg:px-8 py-3">
                    <a
                        href="/#projects"
                        className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-foreground/50 hover:text-foreground transition-colors duration-300"
                    >
                        <span className="text-lg leading-none">&larr;</span>
                        Voltar
                    </a>
                </div>
            </div>

            <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh]">
                <Image
                    src={coverSrc}
                    alt={project.title}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ice-white via-transparent to-transparent" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <aside className="lg:col-span-4 xl:col-span-3">
                        <div className="lg:sticky lg:top-20">
                            <p className="text-xs uppercase tracking-widest text-foreground/40">
                                {project.category}
                            </p>
                            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
                                {project.title}
                            </h1>
                            <p className="mt-4 sm:mt-6 text-base sm:text-lg font-light leading-relaxed text-foreground/70">
                                {project.description}
                            </p>

                            <div className="mt-6 sm:mt-8 space-y-2">
                                {project.details.map((detail, i) => (
                                    <p key={i} className="text-sm text-foreground/50 font-light">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div className="lg:col-span-8 xl:col-span-9">
                        <ProjectGallery images={galleryImages} title={project.title} />
                    </div>
                </div>
            </div>

            <div className="h-24" />
        </div>
    );
}
