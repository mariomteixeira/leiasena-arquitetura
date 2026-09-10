import Image from "next/image";
import type { CSSProperties } from "react";
import ContactForm from "../../_components/contact-form";
import Reveal from "../_shared/reveal";
import { brand, copy, projects } from "../_shared/content";
import Header from "./header";
import Cube from "./cube";
import "./concreto.css";

const heroProject = projects.find((p) => p.slug === "felipe") ?? projects[0];

function heroLines(title: string): string[] {
    const words = title.split(" ");
    if (words.length < 3) return [title];
    return [words[0], words.slice(1, -1).join(" "), words[words.length - 1]];
}

export default function Concreto() {
    const lines = heroLines(copy.heroTitle);

    return (
        <main className="c-main bg-ice-white text-foreground">
            <style href="preview-concreto" precedence="default">{`body{background:#DDD9CE}`}</style>
            <Header />

            {/* ---------- HERO ---------- */}
            <section
                id="home"
                className="relative grid min-h-[calc(100svh-4rem)] grid-rows-[auto_1fr] scroll-mt-16 md:min-h-[calc(100svh-72px)] md:grid-cols-2 md:grid-rows-1 md:scroll-mt-[72px]"
            >
                <div className="c-lines-cream flex flex-col justify-between gap-12 bg-navy p-6 pb-8 text-cream md:gap-16 md:p-12">
                    <h1 className="c-hero-title">
                        {lines.map((l) => (
                            <span key={l} className="block">
                                {l}
                            </span>
                        ))}
                    </h1>
                    <div>
                        <p className="font-mono text-[0.8rem] uppercase tracking-[0.12em] text-cream/75">{copy.roleLine}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a href="#projects" className="c-btn c-btn-cream">
                                Ver projetos
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
                                    <path d="M12 5v14" />
                                    <path d="M6 13l6 6 6-6" />
                                </svg>
                            </a>
                            <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-outline">
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[300px] overflow-hidden bg-navy">
                    <Image
                        src={heroProject.cover}
                        alt={`Projeto ${heroProject.title}`}
                        fill
                        priority
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                    />
                    <span className="c-initials" aria-hidden="true">
                        LS
                    </span>
                </div>

                <div className="c-slab pointer-events-none absolute inset-x-0 top-[62%] z-[2] h-[3px] bg-cream" aria-hidden="true" />
            </section>

            {/* ---------- PROJETOS ---------- */}
            <section id="projects" className="relative scroll-mt-16 bg-ice-white px-5 py-16 md:scroll-mt-[72px] md:px-12 md:py-28">
                <div className="flex items-end justify-between gap-6 border-b-[6px] border-navy pb-4">
                    <h2 className="c-h2">Projetos</h2>
                    <p className="hidden font-mono text-[0.75rem] uppercase tracking-[0.12em] text-navy md:block">{brand.city}</p>
                </div>
                <ul className="mt-12 grid gap-x-16 gap-y-16 md:mt-20 md:grid-cols-2 md:gap-y-24">
                    {projects.map((p, i) => (
                        <Reveal as="li" key={p.slug} className="c-skew" style={{ "--d": `${(i % 2) * 140}ms` } as CSSProperties}>
                            <Cube project={p} sizes="(min-width: 768px) 45vw, 100vw" />
                        </Reveal>
                    ))}
                </ul>
            </section>

            {/* ---------- SERVIÇOS (marquee) ---------- */}
            <section aria-label="Serviços" className="c-marquee c-lines-cream bg-navy py-10 md:py-14">
                <div className="c-marquee-track">
                    {[0, 1].map((k) => (
                        <div key={k} className="c-marquee-set" aria-hidden={k === 1 ? "true" : undefined}>
                            {copy.services.map((s) => (
                                <span key={s} className="c-marquee-item">
                                    {s}
                                    <span className="c-marquee-sq" />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- SOBRE ---------- */}
            <section id="about" className="relative scroll-mt-16 bg-cream px-5 py-16 md:scroll-mt-[72px] md:px-12 md:py-28">
                <div className="grid items-start gap-14 md:grid-cols-12 md:gap-8">
                    <Reveal className="c-skew md:col-span-5">
                        <figure className="c-frame relative aspect-[4/5] overflow-hidden bg-navy">
                            <Image
                                src={brand.portrait}
                                alt={`${brand.shortName}, ${brand.role.toLowerCase()}`}
                                fill
                                sizes="(min-width: 768px) 40vw, 100vw"
                                className="object-cover"
                            />
                        </figure>
                    </Reveal>
                    <div className="md:col-span-6 md:col-start-7">
                        <h2 className="c-h2">{brand.shortName}</h2>
                        <p className="mt-4 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-navy">
                            {brand.role} · {brand.city}
                        </p>
                        <div className="mt-10 max-w-[60ch] space-y-5 text-[1.0625rem] leading-[1.6] text-foreground/85">
                            <p>{copy.aboutP1}</p>
                            <p>{copy.aboutP2}</p>
                        </div>
                        <a href="#contact" className="c-btn c-btn-navy mt-10">
                            Entrar em contato
                        </a>
                    </div>
                </div>
            </section>

            {/* ---------- CONTATO ---------- */}
            <section id="contact" className="relative scroll-mt-16 bg-ice-white px-5 py-16 md:scroll-mt-[72px] md:px-12 md:py-28">
                <div className="flex items-end justify-between gap-6 border-b-[6px] border-navy pb-4">
                    <h2 className="c-h2">Contato</h2>
                    <p className="hidden font-mono text-[0.75rem] uppercase tracking-[0.12em] text-navy md:block">{brand.city}</p>
                </div>
                <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-8">
                    <Reveal className="c-skew md:col-span-7">
                        <div className="c-form c-frame-sm bg-cream p-6 md:p-10">
                            <ContactForm />
                        </div>
                    </Reveal>
                    <ul className="flex flex-col gap-1 md:col-span-5">
                        <li>
                            <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer" className="c-slab-link">
                                <small>WhatsApp</small>
                                <strong>{brand.whatsapp.display}</strong>
                            </a>
                        </li>
                        <li>
                            <a href={`mailto:${brand.email}`} className="c-slab-link">
                                <small>E-mail</small>
                                <strong className="c-keepcase">{brand.email}</strong>
                            </a>
                        </li>
                        <li>
                            <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer" className="c-slab-link">
                                <small>Instagram</small>
                                <strong className="c-keepcase">{brand.instagram.handle}</strong>
                            </a>
                        </li>
                        <li>
                            <div className="c-slab-link">
                                <small>Cidade</small>
                                <strong>{brand.city}</strong>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            {/* ---------- FOOTER ---------- */}
            <footer className="c-lines-cream bg-navy px-5 py-10 text-cream md:px-12 md:py-12">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="w-fit bg-cream p-4">
                        <Image src={brand.logos.horizontalNeg1} alt={brand.name} width={220} height={70} className="h-auto w-[200px] md:w-[220px]" />
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-cream/75">
                        <span>{brand.city}</span>
                        <a href={`mailto:${brand.email}`} className="normal-case hover:text-cream">
                            {brand.email}
                        </a>
                        <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer" className="normal-case hover:text-cream">
                            {brand.instagram.handle}
                        </a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
