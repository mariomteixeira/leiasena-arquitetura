import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { brand, copy, projects } from "../_shared/content";
import Reveal from "../_shared/reveal";
import ContactForm from "./contact-form";
import Header from "./header";
import HeroWall from "./hero-wall";
import { IconArrow, IconInstagram, IconMail, IconPin, IconWhatsapp } from "./icons";
import "./marquise.css";

const d = (ms: number) => ({ ["--d"]: `${ms}ms` }) as CSSProperties;

export default function Marquise() {
    const [anny, debora, felipe, gustavo] = projects;

    return (
        <main className="mrq min-h-dvh bg-cream text-navy antialiased">
            <style href="preview-marquise" precedence="default">{`body{background:#F4F1EA}`}</style>

            <Header />

            {/* ---------------------------------------------------------------- hero */}
            <section id="home" className="flex min-h-dvh flex-col pt-16 sm:pt-20">
                <div className="mrq-hero-stage relative w-full">
                    <HeroWall />
                </div>

                <div className="mx-auto flex w-full max-w-[86rem] flex-1 flex-col items-center justify-center px-5 pb-9 pt-6 text-center sm:px-8 sm:pt-7">
                    <h1 className="max-w-[19ch] text-balance font-serif text-[2.35rem] leading-[0.98] tracking-[-0.03em] sm:text-[3.4rem] lg:text-[4.8rem]">
                        Arquitetura que <em className="italic">transforma</em> espaços
                    </h1>
                    <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-navy/70 sm:text-[0.74rem]">
                        {copy.roleLine}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                        <a
                            href="#contact"
                            className="mrq-cta group inline-flex h-13 items-center gap-3 rounded-full bg-navy px-8 text-[0.78rem] font-light uppercase tracking-[0.18em] text-cream hover:bg-navy/90 sm:h-14 sm:px-9"
                        >
                            Fale comigo
                            <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                        </a>
                        <a
                            href="#projects"
                            className="mrq-link text-[0.78rem] font-light uppercase tracking-[0.18em] text-navy/80 hover:text-navy"
                        >
                            Ver projetos
                        </a>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------ projetos */}
            <section id="projects" className="scroll-mt-24 px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28">
                <div className="mx-auto max-w-[86rem]">
                    <div className="mrq-hair pt-7">
                        <h2 className="font-serif text-[2.6rem] leading-none tracking-[-0.02em] sm:text-[3.4rem]">
                            Projetos
                        </h2>
                    </div>

                    <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-16 sm:mt-20 sm:gap-y-24">
                        {/* 1 — grande, arco pleno */}
                        <Reveal as="div" className="reveal col-span-12">
                            <Link
                                href={`/projetos/${anny.slug}`}
                                className="mrq-card group grid grid-cols-12 items-end gap-x-6 gap-y-6"
                            >
                                <div className="col-span-12 md:col-span-7">
                                    <div className="mrq-arch mrq-zoom relative aspect-square w-full bg-ice-white">
                                        <Image
                                            src={anny.cover}
                                            alt={`Projeto ${anny.title}`}
                                            fill
                                            sizes="(max-width: 767px) 92vw, 55vw"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-4 md:col-start-9 md:pb-12">
                                    <h3 className="font-serif text-[2.2rem] leading-none tracking-[-0.02em] sm:text-[3rem]">
                                        {anny.title}
                                    </h3>
                                    <span className="mt-5 inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-navy/70">
                                        Ver projeto
                                        <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </Link>
                        </Reveal>

                        {/* 2 — menor, deslocado à direita, arco largo */}
                        <Reveal as="div" className="reveal col-span-12" style={d(60)}>
                            <Link
                                href={`/projetos/${debora.slug}`}
                                className="mrq-card group grid grid-cols-12 items-end gap-x-6 gap-y-6"
                            >
                                <div className="order-2 col-span-12 md:order-1 md:col-span-4 md:col-start-1 md:pb-10 md:text-right">
                                    <h3 className="font-serif text-[2.2rem] leading-none tracking-[-0.02em] sm:text-[3rem]">
                                        {debora.title}
                                    </h3>
                                    <span className="mt-5 inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-navy/70">
                                        Ver projeto
                                        <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                                    </span>
                                </div>
                                <div className="order-1 col-span-12 md:order-2 md:col-span-7 md:col-start-6">
                                    <div className="mrq-arch-wide mrq-zoom relative aspect-[16/10] w-full bg-ice-white">
                                        <Image
                                            src={debora.cover}
                                            alt={`Projeto ${debora.title}`}
                                            fill
                                            sizes="(max-width: 767px) 92vw, 50vw"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </Link>
                        </Reveal>

                        {/* 3 e 4 — par */}
                        {[felipe, gustavo].map((p, i) => (
                            <Reveal
                                as="div"
                                key={p.slug}
                                className="reveal col-span-12 md:col-span-6"
                                style={d(i * 90)}
                            >
                                <Link href={`/projetos/${p.slug}`} className="mrq-card group block">
                                    <div className="mrq-arch mrq-zoom relative aspect-[4/5] w-full bg-ice-white">
                                        <Image
                                            src={p.cover}
                                            alt={`Projeto ${p.title}`}
                                            fill
                                            sizes="(max-width: 767px) 92vw, 45vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="mt-6 flex items-baseline justify-between gap-4">
                                        <h3 className="font-serif text-[2rem] leading-none tracking-[-0.02em] sm:text-[2.4rem]">
                                            {p.title}
                                        </h3>
                                        <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-navy/70">
                                            Ver projeto
                                            <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* --------------------------------------------------------------- sobre */}
            <section id="about" className="scroll-mt-24 bg-ice-white px-5 py-24 sm:px-8 sm:py-32">
                <div className="mx-auto grid max-w-[86rem] grid-cols-12 gap-x-6 gap-y-12">
                    <Reveal as="div" className="reveal col-span-12 md:col-span-5">
                        <div className="mrq-arch relative aspect-[3/4] w-full bg-cream">
                            <Image
                                src={brand.portrait}
                                alt={`${brand.name} — retrato`}
                                fill
                                sizes="(max-width: 767px) 92vw, 40vw"
                                className="object-cover"
                            />
                        </div>
                    </Reveal>

                    <Reveal
                        as="div"
                        className="reveal col-span-12 flex flex-col justify-center md:col-span-6 md:col-start-7"
                        style={d(90)}
                    >
                        <h2 className="font-serif text-[2.6rem] leading-none tracking-[-0.02em] sm:text-[3.4rem]">
                            Sobre
                        </h2>
                        <p className="mt-9 max-w-[54ch] text-[1.05rem] font-light leading-[1.7] text-navy sm:text-[1.15rem]">
                            {copy.aboutP1}
                        </p>
                        <p className="mt-6 max-w-[54ch] text-[1.05rem] font-light leading-[1.7] text-navy/85 sm:text-[1.15rem]">
                            {copy.aboutP2}
                        </p>

                        <ul className="mrq-hair-b mt-12">
                            {copy.services.map((s) => (
                                <li
                                    key={s}
                                    className="mrq-hair py-4 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-navy/80"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* ------------------------------------------------------------- contato */}
            <section id="contact" className="scroll-mt-24 bg-white px-5 pb-24 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
                <div className="mx-auto max-w-[86rem]">
                    <div className="mrq-hair pt-7">
                        <h2 className="font-serif text-[2.6rem] leading-none tracking-[-0.02em] sm:text-[3.4rem]">
                            Contato
                        </h2>
                    </div>

                    <Reveal as="div" className="reveal mrq-panel mrq-arch-panel mt-14 sm:mt-20">
                        <div className="grid grid-cols-12 gap-x-6 gap-y-14 px-6 pb-14 pt-[6.5rem] sm:px-12 sm:pb-20 sm:pt-[9.5rem] lg:px-20">
                            <div className="col-span-12 md:col-span-5">
                                <ul className="flex flex-col gap-7">
                                    <li>
                                        <a
                                            href={`mailto:${brand.email}`}
                                            className="mrq-link inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none sm:text-[1.45rem]"
                                        >
                                            <IconMail className="h-5 w-5 shrink-0 text-navy/60" />
                                            {brand.email}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={brand.instagram.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mrq-link inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none sm:text-[1.45rem]"
                                        >
                                            <IconInstagram className="h-5 w-5 shrink-0 text-navy/60" />
                                            {brand.instagram.handle}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={brand.whatsapp.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mrq-link inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none sm:text-[1.45rem]"
                                        >
                                            <IconWhatsapp className="h-5 w-5 shrink-0 text-navy/60" />
                                            {brand.whatsapp.display}
                                        </a>
                                    </li>
                                    <li className="inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none text-navy/85 sm:text-[1.45rem]">
                                        <IconPin className="h-5 w-5 shrink-0 text-navy/60" />
                                        {brand.city}
                                    </li>
                                </ul>
                            </div>

                            <div className="col-span-12 md:col-span-6 md:col-start-7">
                                <ContactForm />
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* -------------------------------------------------------------- rodapé */}
            <footer className="bg-cream px-5 pb-14 pt-14 sm:px-8 sm:pb-16">
                <div className="mrq-hair mx-auto max-w-[86rem] pt-12 text-center">
                    <a
                        href="#home"
                        className="font-serif text-[2.4rem] italic leading-none tracking-[-0.01em] sm:text-[3.2rem]"
                    >
                        {brand.shortName}
                    </a>
                    <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-navy/70">
                        {brand.role} · {brand.city}
                    </p>
                </div>
            </footer>
        </main>
    );
}
