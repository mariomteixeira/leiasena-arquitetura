import Image from "next/image";
import Link from "next/link";
import { brand, projects } from "../../_lib/content";
import type { Project } from "../../_lib/projects";
import { byProject } from "../../_lib/gallery";
import { IconArrowLeft, IconArrowRight } from "./icons";
import Wordmark from "../home/wordmark";
import Sheet from "./sheet";
import "./projeto.css";

export default function ProjetoBody({ project }: { project: Project }) {
    const shots = byProject(project.slug);
    const others = projects.filter((p) => p.slug !== project.slug);

    return (
        <main className="ix min-h-dvh bg-cream text-navy antialiased">
            <style href="ix-bg" precedence="default">{`body{background:#F4F1EA}`}</style>

            {/* ------------------------------------------------------ cabeçalho */}
            <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
                <div className="flex items-center justify-between gap-6 py-3.5 sm:py-4">
                    <Link
                        href="/#projects"
                        className="ix-link group inline-flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-navy/80 hover:text-navy"
                    >
                        <IconArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
                        Voltar aos projetos
                    </Link>
                    <Link href="/" className="text-navy" aria-label="Léia Sena Arquitetura — início">
                        <Wordmark className="w-[7.4rem] sm:w-[8.8rem]" />
                    </Link>
                </div>

                <div className="ix-hair flex flex-col gap-2 pb-4 pt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:pb-5 sm:pt-5">
                    <h1 className="font-serif text-[2.4rem] leading-[0.9] tracking-[-0.03em] sm:text-[3rem]">
                        {project.title}
                    </h1>
                    <div className="flex flex-col gap-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-navy/80 sm:items-end sm:text-[0.74rem]">
                        <span className="tabular-nums text-navy">{shots.length} imagens</span>
                        <span>Imagens 3D por {brand.name}</span>
                    </div>
                </div>
            </div>

            {/* --------------------------------------------------- folha de contato */}
            <div className="ix-hair mx-auto max-w-[86rem] px-5 pt-4 sm:px-8 sm:pt-5">
                <Sheet shots={shots} title={project.title} />
            </div>

            {/* --------------------------------------------------- outros projetos */}
            <section className="mx-auto max-w-[86rem] px-5 pb-12 pt-10 sm:px-8 sm:pb-14 sm:pt-14">
                <ul className="ix-hair-soft">
                    {others.map((p) => (
                        <li key={p.slug} className="ix-hair">
                            <Link href={`/projetos/${p.slug}`} className="ix-other">
                                <span className="ix-other-thumb ix-arch relative block h-16 w-12 shrink-0 bg-ice-white sm:h-20 sm:w-14">
                                    <Image
                                        src={p.cover}
                                        alt=""
                                        fill
                                        sizes="56px"
                                        className="object-cover object-[50%_58%]"
                                    />
                                </span>
                                <span className="font-serif text-[1.5rem] leading-none tracking-[-0.02em] sm:text-[1.9rem]">
                                    {p.title}
                                </span>
                                <span className="font-mono text-[0.7rem] uppercase tabular-nums tracking-[0.18em] text-navy/80 sm:text-[0.74rem]">
                                    {p.images.length} imagens
                                </span>
                                <IconArrowRight className="ix-arrow h-4 w-4 text-navy/70" />
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="ix-hair mt-12 flex flex-col gap-3 pt-6 sm:mt-16 sm:flex-row sm:items-baseline sm:justify-between">
                    <p className="font-serif text-[1.35rem] italic leading-none tracking-[-0.01em] sm:text-[1.6rem]">
                        {brand.shortName}
                    </p>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-navy/80 sm:text-[0.74rem] sm:tracking-[0.18em]">
                        <a
                            href={brand.whatsapp.href}
                            target="_blank"
                            rel="noreferrer"
                            className="ix-link tabular-nums hover:text-navy"
                        >
                            {brand.whatsapp.display}
                        </a>
                        <span aria-hidden="true" className="hidden text-navy/40 sm:inline">·</span>
                        <a href={`mailto:${brand.email}`} className="ix-link normal-case tracking-[0.12em] hover:text-navy">
                            {brand.email}
                        </a>
                        <span aria-hidden="true" className="hidden text-navy/40 sm:inline">·</span>
                        <a
                            href={brand.instagram.href}
                            target="_blank"
                            rel="noreferrer"
                            className="ix-link normal-case tracking-[0.12em] hover:text-navy"
                        >
                            {brand.instagram.handle}
                        </a>
                        <span aria-hidden="true" className="hidden text-navy/40 sm:inline">·</span>
                        <span>{brand.city}</span>
                    </p>
                </div>
            </section>
        </main>
    );
}
