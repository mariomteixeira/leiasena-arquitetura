import Image from "next/image";
import type { CSSProperties } from "react";
import { brand, copy, projects } from "./_lib/content";
import Reveal from "./_components/reveal";
import ContactForm from "./_components/home/contact-form";
import "./_components/home/home.css";
import Header from "./_components/home/header";
import { IconArrow, IconInstagram, IconMail, IconPin, IconWhatsapp } from "./_components/home/icons";
import Ribbon from "./_components/home/ribbon";

const d = (ms: number) => ({ ["--d"]: `${ms}ms` }) as CSSProperties;

export default function Home() {
    const [anny] = projects;

    return (
        <main className="ft min-h-dvh bg-cream text-navy antialiased">
            <style href="home-bg" precedence="default">{`body{background:#F4F1EA}`}</style>

            <Header />

            {/* ---------------------------------------------------------------- hero */}
            <section id="home" className="px-5 pt-[5rem] sm:px-8 sm:pt-[5.75rem]">
                <div className="mx-auto max-w-[86rem] text-center">
                    <div className="ft-arch-wide ft-zoom relative mx-auto h-[8.5rem] w-full max-w-[52rem] bg-ice-white sm:h-[10.5rem]">
                        <Image
                            src={anny.cover}
                            alt={`Projeto ${anny.title}`}
                            fill
                            priority
                            sizes="(max-width: 767px) 92vw, 52rem"
                            className="object-cover object-[50%_62%]"
                        />
                    </div>

                    <h1 className="mx-auto mt-7 max-w-[19ch] text-balance font-serif text-[2.35rem] leading-[0.98] tracking-[-0.03em] sm:text-[3.4rem] lg:text-[4rem]">
                        Arquitetura que <em className="italic">transforma</em> espaços
                    </h1>
                    <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-navy/80 sm:text-[0.74rem]">
                        {copy.roleLine}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                        <a
                            href="#contact"
                            className="ft-cta group inline-flex h-13 items-center gap-3 rounded-full bg-navy px-8 text-[0.78rem] font-light uppercase tracking-[0.18em] text-cream hover:bg-navy/90 sm:h-14 sm:px-9"
                        >
                            Fale comigo
                            <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                        </a>
                        <a
                            href="#projects"
                            className="ft-link text-[0.78rem] font-light uppercase tracking-[0.18em] text-navy/80 hover:text-navy"
                        >
                            Ver projetos
                        </a>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------ projetos */}
            <section id="projects" className="scroll-mt-24 pb-20 pt-7 sm:pb-28 sm:pt-8">
                <div className="mx-auto max-w-[86rem] px-5 sm:px-8">
                    <div className="ft-hair flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pt-6">
                        <h2 className="font-serif text-[2rem] leading-none tracking-[-0.02em] sm:text-[2.4rem]">
                            Projetos
                        </h2>
                    </div>
                </div>

                <div className="mt-6 sm:mt-8">
                    <Ribbon />
                </div>
            </section>

            {/* --------------------------------------------------------------- sobre */}
            <section id="about" className="scroll-mt-24 bg-ice-white px-5 py-24 sm:px-8 sm:py-32">
                <div className="mx-auto grid max-w-[86rem] grid-cols-12 gap-x-6 gap-y-12">
                    <Reveal as="div" className="reveal col-span-12 md:col-span-5">
                        <div className="ft-arch ft-zoom relative aspect-[3/4] w-full bg-cream">
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

                        <ul className="ft-hair-b mt-12">
                            {copy.services.map((s) => (
                                <li
                                    key={s}
                                    className="ft-hair py-4 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-navy/80"
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
                    <div className="ft-hair pt-7">
                        <h2 className="font-serif text-[2.6rem] leading-none tracking-[-0.02em] sm:text-[3.4rem]">
                            Contato
                        </h2>
                    </div>

                    <Reveal as="div" className="reveal ft-panel ft-arch-panel mt-14 sm:mt-20">
                        <div className="grid grid-cols-12 gap-x-6 gap-y-14 px-6 pb-14 pt-[6.5rem] sm:px-12 sm:pb-20 sm:pt-[9.5rem] lg:px-20">
                            <div className="col-span-12 md:col-span-5">
                                <ul className="flex flex-col gap-7">
                                    <li>
                                        <a
                                            href={`mailto:${brand.email}`}
                                            className="ft-link inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none sm:text-[1.45rem]"
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
                                            className="ft-link inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none sm:text-[1.45rem]"
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
                                            className="ft-link inline-flex items-center gap-3 font-serif text-[1.25rem] leading-none sm:text-[1.45rem]"
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
                <div className="ft-hair mx-auto max-w-[86rem] pt-12 text-center">
                    <a
                        href="#home"
                        className="font-serif text-[2.4rem] italic leading-none tracking-[-0.01em] sm:text-[3.2rem]"
                    >
                        {brand.shortName}
                    </a>
                    <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-navy/80">
                        {brand.role} · {brand.city}
                    </p>
                </div>
            </footer>
        </main>
    );
}
