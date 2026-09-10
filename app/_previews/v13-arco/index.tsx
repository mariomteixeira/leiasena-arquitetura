import Image from "next/image";
import type { CSSProperties } from "react";
import { brand, copy } from "../_shared/content";
import Reveal from "../_shared/reveal";
import ArchCarousel from "./arch-carousel";
import ContactForm from "./contact-form";
import Header from "./header";
import { IconArrow, IconInstagram, IconMail, IconPin, IconWhatsapp } from "./icons";
import "./arco.css";

const d = (ms: number) => ({ ["--d"]: `${ms}ms` }) as CSSProperties;

const HERO_SHOT = "/assets/projetos/Anny/01.png";

export default function Arco() {
    return (
        <main className="ac min-h-dvh bg-cream text-navy antialiased">
            <style href="preview-arco" precedence="default">{`body{background:#F4F1EA}`}</style>

            <Header />

            {/* ---------------------------------------------------------------- hero */}
            <section id="home" className="px-5 pt-16 sm:px-8 sm:pt-20">
                <div className="mx-auto grid max-w-[86rem] grid-cols-12 items-center gap-x-6 gap-y-12 pb-16 pt-8 sm:pb-24 lg:min-h-[calc(100dvh-5rem)] lg:gap-y-0 lg:pb-20 lg:pt-4">
                    <div className="order-1 col-span-12 lg:order-2 lg:col-span-5 lg:col-start-8">
                        <div className="ac-hero-arch ac-figure ac-zoom relative w-full bg-ice-white">
                            <Image
                                src={HERO_SHOT}
                                alt="Projeto Anny"
                                fill
                                priority
                                sizes="(max-width: 1023px) 92vw, 36vw"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="order-2 col-span-12 lg:order-1 lg:col-span-6">
                        <h1 className="max-w-[15ch] text-balance font-serif text-[2.6rem] leading-[0.97] tracking-[-0.03em] sm:text-[3.6rem] lg:text-[4.8rem]">
                            Arquitetura que <em className="italic">transforma</em> espaços
                        </h1>
                        <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-navy/70 sm:text-[0.76rem]">
                            {copy.roleLine}
                        </p>
                        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                            <a
                                href="#contact"
                                className="ac-cta group inline-flex h-13 items-center gap-3 rounded-full bg-navy px-8 text-[0.78rem] font-light uppercase tracking-[0.18em] text-cream hover:bg-navy/90 sm:h-14 sm:px-9"
                            >
                                Fale comigo
                                <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                            </a>
                            <a
                                href="#projects"
                                className="ac-link text-[0.78rem] font-light uppercase tracking-[0.18em] text-navy/80 hover:text-navy"
                            >
                                Ver projetos
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------ projetos */}
            <section
                id="projects"
                className="ac-projects scroll-mt-24 overflow-x-clip bg-ice-white px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-24"
            >
                <div className="mx-auto max-w-[86rem]">
                    <div className="ac-hair flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pt-7">
                        <h2 className="font-serif text-[2.6rem] leading-none tracking-[-0.02em] sm:text-[3.4rem]">
                            Projetos
                        </h2>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-navy/65">
                            Anny · Débora · Felipe · Gustavo
                        </p>
                    </div>
                </div>

                <ArchCarousel />
            </section>

            {/* --------------------------------------------------------------- sobre */}
            <section id="about" className="scroll-mt-24 bg-cream px-5 py-24 sm:px-8 sm:py-32">
                <div className="mx-auto grid max-w-[86rem] grid-cols-12 gap-x-6 gap-y-12">
                    <Reveal as="div" className="reveal col-span-12 md:col-span-5">
                        <div className="ac-arch ac-figure ac-zoom relative aspect-[3/4] w-full bg-ice-white">
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

                        <ul className="ac-hair-b mt-12">
                            {copy.services.map((s) => (
                                <li
                                    key={s}
                                    className="ac-hair py-4 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-navy/80"
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
                    <div className="ac-hair pt-7">
                        <h2 className="font-serif text-[2.6rem] leading-none tracking-[-0.02em] sm:text-[3.4rem]">
                            Contato
                        </h2>
                    </div>

                    <Reveal as="div" className="reveal ac-panel mt-14 sm:mt-20">
                        <div className="grid grid-cols-12 gap-x-6 gap-y-14 px-6 pb-14 pt-[6.5rem] sm:px-12 sm:pb-20 sm:pt-[9.5rem] lg:px-20">
                            <div className="col-span-12 md:col-span-5">
                                <ul className="flex flex-col gap-7">
                                    <li>
                                        <a
                                            href={`mailto:${brand.email}`}
                                            className="ac-link inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none sm:text-[1.45rem]"
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
                                            className="ac-link inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none sm:text-[1.45rem]"
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
                                            className="ac-link inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none sm:text-[1.45rem]"
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
                <div className="ac-hair mx-auto max-w-[86rem] pt-12 text-center">
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
