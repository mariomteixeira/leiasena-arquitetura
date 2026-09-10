import Image from "next/image";
import ContactForm from "../../_components/contact-form";
import { brand, copy, projects } from "../_shared/content";
import Reveal from "../_shared/reveal";
import Masthead from "./masthead";
import Spread from "./spread";
import Tilt from "./tilt";
import "./revista.css";

/** Second / third image per spread (1-based image numbers) and cover crop. */
const picks: Record<string, { second: number; third: number; aspect: string }> = {
    anny: { second: 3, third: 7, aspect: "aspect-[4/3]" },
    debora: { second: 4, third: 5, aspect: "aspect-[4/3]" },
    felipe: { second: 4, third: 8, aspect: "aspect-[4/3]" },
    gustavo: { second: 8, third: 3, aspect: "aspect-[7/6]" },
};

const mono = "font-mono text-[12px] uppercase tracking-[0.08em]";
const h2 = "font-serif text-[2.75rem] leading-none tracking-[-0.02em] text-foreground md:text-[3.5rem]";

export default function Revista() {
    const cover = projects.find((p) => p.slug === "anny") ?? projects[0];
    const inset = projects.find((p) => p.slug === "gustavo") ?? projects[3];
    const year = new Date().getFullYear();

    return (
        <main id="home" className="rv min-h-dvh bg-white px-5 text-foreground md:px-12">
            <style href="preview-revista" precedence="default">{`body{background:#FFFFFF}`}</style>

            <Masthead />

            {/* Cover spread */}
            <section className="grid gap-x-10 gap-y-10 pb-24 pt-6 md:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] md:pb-36 md:pt-7">
                <div className="relative mb-[14%] md:mb-[10%]">
                    <Tilt className="aspect-[4/3] overflow-hidden">
                        <Image src={cover.cover} alt={`Projeto ${cover.title}`} fill priority sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
                    </Tilt>
                    <div className="absolute bottom-0 left-0 max-w-[78%] bg-navy px-5 py-4 text-white md:max-w-[56%] md:px-7 md:py-6">
                        <h2 className="font-serif text-[1.6rem] leading-[1.05] tracking-[-0.01em] text-balance md:text-[2.4rem]">{copy.heroTitle}</h2>
                    </div>
                    <Tilt className="absolute bottom-0 right-0 aspect-[7/6] w-[42%] translate-y-[28%] overflow-hidden md:w-[34%] md:translate-x-[20%] md:translate-y-[20%]">
                        <Image src={inset.cover} alt={`Projeto ${inset.title}`} fill sizes="(min-width: 768px) 22vw, 42vw" className="object-cover" />
                    </Tilt>
                </div>

                <div className="flex flex-col md:pt-1">
                    <p className={`${mono} text-navy`}>{copy.roleLine}</p>
                    <p className="mt-5 max-w-[34ch] text-[1.125rem] leading-[1.5] text-foreground md:text-[1.25rem]">{copy.bioShort}</p>
                    <div className={`${mono} mt-8 flex flex-wrap gap-x-8 gap-y-3`}>
                        <a href="#projects" className="text-navy underline-offset-4 hover:underline">Ver projetos →</a>
                        <a href="#contact" className="text-navy underline-offset-4 hover:underline">Fale comigo →</a>
                    </div>
                </div>
            </section>

            {/* Projetos — four spreads */}
            <section id="projects" className="border-t rv-hair pb-24 pt-8 md:pb-36 md:pt-10">
                <div className="flex items-end justify-between gap-6">
                    <h2 className={h2}>Projetos</h2>
                    <span className={`${mono} hidden text-foreground/65 md:block`}>{brand.city}</span>
                </div>
                <div className="mt-12 flex flex-col gap-24 md:mt-20 md:gap-32">
                    {projects.map((p, i) => {
                        const pick = picks[p.slug] ?? { second: 2, third: 3, aspect: "aspect-[4/3]" };
                        return (
                            <Spread
                                key={p.slug}
                                project={p}
                                second={p.images[pick.second - 1] ?? p.cover}
                                third={p.images[pick.third - 1] ?? p.cover}
                                coverAspect={pick.aspect}
                                titleBelow={i % 2 === 1}
                            />
                        );
                    })}
                </div>
            </section>

            {/* Sobre — feature */}
            <section id="about" className="border-t rv-hair pb-24 pt-8 md:pb-36 md:pt-10">
                <h2 className={h2}>Sobre</h2>
                <div className="mt-12 grid gap-x-12 gap-y-12 md:mt-20 md:grid-cols-2">
                    <Reveal as="figure" className="reveal order-first md:order-last">
                        <Tilt className="aspect-[4/5] overflow-hidden">
                            <Image src={brand.portrait} alt="Léia Sena" fill sizes="(min-width: 768px) 46vw, 100vw" className="object-cover" />
                        </Tilt>
                        <figcaption className={`${mono} mt-3 text-foreground/65`}>Léia Sena, arquiteta e urbanista</figcaption>
                    </Reveal>

                    <div className="max-w-[60ch]">
                        <p className="rv-dropcap text-[17px] leading-[1.6] text-foreground">{copy.aboutP1}</p>
                        <p className="mt-6 text-[17px] leading-[1.6] text-foreground">{copy.aboutP2}</p>

                        <Reveal className="reveal mt-12 border rv-hair bg-ice-white p-6 md:p-8">
                            <p className={`${mono} text-navy`}>Serviços</p>
                            <ul className="mt-4">
                                {copy.services.map((s) => (
                                    <li key={s} className="flex items-baseline justify-between gap-4 border-t rv-hair py-3 text-[17px] text-foreground">
                                        <span>{s}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className={`${mono} mt-4 text-foreground/65`}>{brand.role} · {brand.city}</p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Contato — back page */}
            <section id="contact" className="border-t rv-hair pb-16 pt-8 md:pb-24 md:pt-10">
                <h2 className={h2}>Contato</h2>
                <div className="mt-12 grid gap-x-12 gap-y-12 md:mt-20 md:grid-cols-[minmax(0,35fr)_minmax(0,65fr)]">
                    <div className="flex flex-col">
                        <dl className={`${mono} grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 normal-case tracking-normal`}>
                            <dt className="text-foreground/65">E-mail</dt>
                            <dd><a href={`mailto:${brand.email}`} className="text-navy underline-offset-4 hover:underline">{brand.email}</a></dd>
                            <dt className="text-foreground/65">Instagram</dt>
                            <dd><a href={brand.instagram.href} target="_blank" rel="noreferrer" className="text-navy underline-offset-4 hover:underline">{brand.instagram.handle}</a></dd>
                            <dt className="text-foreground/65">WhatsApp</dt>
                            <dd><a href={brand.whatsapp.href} target="_blank" rel="noreferrer" className="text-navy underline-offset-4 hover:underline">{brand.whatsapp.display}</a></dd>
                            <dt className="text-foreground/65">Cidade</dt>
                            <dd className="text-foreground">{brand.city}</dd>
                        </dl>
                        <a href={brand.whatsapp.href} target="_blank" rel="noreferrer" className={`${mono} mt-8 inline-flex w-fit items-center gap-3 bg-navy px-5 py-3 text-white transition-colors duration-300 hover:bg-foreground`}>
                            Chamar no WhatsApp →
                        </a>
                        <div className="mt-14 hidden md:block">
                            <Image src={brand.logos.horizontalNeg1} alt={brand.name} width={240} height={60} className="h-auto w-[240px]" />
                        </div>
                    </div>
                    <div className="rv-form">
                        <ContactForm />
                    </div>
                </div>
            </section>

            <footer className={`${mono} flex flex-col gap-3 border-t rv-hair py-6 text-foreground/65 md:flex-row md:items-center md:justify-between`}>
                <span>© {year} {brand.name}</span>
                <Image src={brand.logos.horizontalNeg1} alt="" width={160} height={40} className="h-auto w-[160px] md:hidden" />
                <span>{brand.city}</span>
            </footer>
        </main>
    );
}
