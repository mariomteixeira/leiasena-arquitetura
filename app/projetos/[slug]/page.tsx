import { notFound } from "next/navigation";
import Image from "next/image";
import ProjectGallery from "../../_components/gallery";
import { projects } from "../../_lib/projects";

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) notFound();

    const coverSrc = project.images[0];
    const galleryImages = project.images.slice(1);

    return (
        <div className="min-h-screen bg-ice-white">
            <div className="fixed top-0 left-0 w-full z-40 bg-ice-white/60 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5">
                <div className="px-4 sm:px-6 min-[1020px]:px-8 py-3">
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

            <div className="mx-auto max-w-7xl px-4 sm:px-6 min-[1020px]:px-8 -mt-16 relative z-10">
                <div className="grid grid-cols-1 min-[1020px]:grid-cols-12 gap-8 min-[1020px]:gap-12">
                    <aside className="min-[1020px]:col-span-4 xl:col-span-3">
                        <div className="min-[1020px]:sticky min-[1020px]:top-20">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
                                {project.title}
                            </h1>
                        </div>
                    </aside>

                    <div className="min-[1020px]:col-span-8 xl:col-span-9">
                        <ProjectGallery images={galleryImages} title={project.title} />
                    </div>
                </div>
            </div>

            <div className="h-24" />
        </div>
    );
}
