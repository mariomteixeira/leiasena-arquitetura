import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjetoBody from "../../_components/projeto/page-body";
import { projects } from "../../_lib/projects";
import { byProject } from "../../_lib/gallery";

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return {};
    const count = byProject(slug).length || project.images.length;
    return {
        title: `${project.title} — Léia Sena Arquitetura`,
        description: `${count} imagens 3D do projeto ${project.title}, por Léia Sena Arquitetura, em Brasília-DF.`,
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);
    if (!project) notFound();

    return <ProjetoBody project={project} />;
}
