import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "../_shared/reveal";
import {
    brand,
    copy,
    coverSize,
    pad,
    portraitSize,
    projects,
    px,
    ratio,
    sheetNo,
    totalImages,
} from "./data";
import { DownIcon } from "./icons";
import PranchaForm from "./form";
import Nav from "./nav";
import { ArrowIcon, Dimension, Hatch, HatchDefs, SheetFrame, TitleBlock, type TbCell } from "./sheet";
import Stack from "./stack";
import "./prancha.css";

const anny = projects[0];
const annySize = coverSize[anny.slug];

const titleBlockRows: TbCell[][] = [
    [{ node: brand.name, fill: true }],
    [{ node: brand.role, grow: 1.2 }, { node: brand.city }],
    [
        { node: brand.email, href: `mailto:${brand.email}`, external: true, grow: 1.7 },
        { node: brand.instagram.handle, href: brand.instagram.href, external: true },
    ],
];

const legendKeys = ["pr-hatch", "pr-cross", "pr-dots"] as const;

export default function Prancha() {
    return (
        <main className="pr">
            <style href="preview-prancha" precedence="default">{`body{background:#DDD9CE}`}</style>
            <HatchDefs />
            <Nav />

            {/* ---------- prancha 01 — capa ---------- */}
            <section id="home" className="pr-sheet pr-hero">
                <div className="pr-sheet-in">
                    <SheetFrame />
                    <div className="pr-hatch-strip">
                        <Hatch />
                    </div>

                    <div className="pr-hero-in">
                        <div className="pr-hero-top">
                            <a className="pr-logo" href="#home" aria-label={brand.name}>
                                <Image src={brand.logos.horizontalNeg1} alt={brand.name} width={168} height={42} priority unoptimized />
                            </a>
                            <span className="pr-mono pr-run">
                                Prancha {sheetNo("home")} · Projeto {anny.title}
                            </span>
                            <nav className="pr-hero-nav pr-mono" aria-label="Seções">
                                {copy.sections.map((s) => (
                                    <a key={s.id} href={`#${s.id}`}>
                                        {s.label}
                                    </a>
                                ))}
                            </nav>
                            <span className="pr-hair-rule" aria-hidden="true" />
                        </div>

                        <div className="pr-hero-mid">
                            <Dimension className="pr-hero-ydim" label={ratio(annySize)} axis="y" />

                            <div className="pr-hero-mount">
                                <Dimension className="pr-hero-xdim" label={px(annySize)} axis="x" />
                                <div className="pr-hero-fig">
                                    <Image
                                        src={anny.cover}
                                        alt={`Projeto ${anny.title} — imagem 3D autoral`}
                                        fill
                                        priority
                                        sizes="(max-width: 980px) 100vw, 74vw"
                                    />
                                    <span className="pr-hero-caption pr-mono">
                                        {anny.title} · 01.png
                                    </span>
                                </div>

                                <div className="pr-title-label">
                                    <h1>{copy.heroTitle}</h1>
                                    <p className="pr-title-sub pr-mono">{copy.roleLine}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pr-hero-bot">
                            <div>
                                <p className="pr-hero-note">{copy.heroSubtitle}</p>
                                <div className="pr-cta-row" style={{ marginTop: 18 }}>
                                    <a className="pr-btn pr-btn-fill" href={brand.whatsapp.href} target="_blank" rel="noreferrer">
                                        Falar no WhatsApp
                                        <ArrowIcon />
                                    </a>
                                    <a className="pr-btn" href="#projects">
                                        Ver projetos
                                        <DownIcon />
                                    </a>
                                </div>
                            </div>
                            <TitleBlock rows={titleBlockRows} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- prancha 02 — projetos ---------- */}
            <section id="projects" className="pr-sheet pr-sec">
                <div className="pr-sheet-in">
                    <SheetFrame />
                    <div className="pr-sec-in">
                        <div className="pr-sec-top">
                            <h2 className="pr-sec-title">Projetos</h2>
                            <div className="pr-sec-meta pr-mono">
                                <span>Prancha {sheetNo("projects")}</span>
                                <span>
                                    {pad(projects.length)} pranchas · {totalImages} imagens
                                </span>
                            </div>
                        </div>

                        <Stack />

                        <ul className="pr-list pr-mono">
                            {projects.map((p, i) => (
                                <li key={p.slug}>
                                    <Link href={`/projetos/${p.slug}`}>
                                        <span>{pad(i + 1)}</span>
                                        <span className="pr-list-name">{p.title}</span>
                                        <span className="pr-list-end">
                                            {p.images.length} imagens
                                            <ArrowIcon />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ---------- prancha 03 — memorial ---------- */}
            <section id="about" className="pr-sheet pr-sec">
                <div className="pr-sheet-in">
                    <SheetFrame />
                    <div className="pr-sec-in">
                        <div className="pr-sec-top">
                            <h2 className="pr-sec-title">Memorial</h2>
                            <div className="pr-sec-meta pr-mono">
                                <span>Prancha {sheetNo("about")}</span>
                                <span>Sobre</span>
                            </div>
                        </div>

                        <div className="pr-about">
                            <Reveal className="reveal pr-portrait-wrap">
                                <Dimension className="pr-portrait-dim" label={px(portraitSize)} axis="y" />
                                <div className="pr-portrait">
                                    <Image
                                        src={brand.portrait}
                                        alt={brand.shortName}
                                        fill
                                        sizes="(max-width: 980px) 320px, 320px"
                                    />
                                </div>
                                <span className="pr-portrait-cap pr-mono">
                                    {brand.shortName} · {ratio(portraitSize)}
                                </span>
                            </Reveal>

                            <div>
                                <Reveal className="reveal pr-para">
                                    <span className="pr-para-label pr-mono">01 · Formação</span>
                                    <p>{copy.aboutP1}</p>
                                </Reveal>
                                <Reveal className="reveal pr-para" style={{ "--d": "90ms" } as CSSProperties}>
                                    <span className="pr-para-label pr-mono">02 · Método</span>
                                    <p>{copy.aboutP2}</p>
                                </Reveal>

                                <div className="pr-legend">
                                    <span className="pr-mono">Legenda</span>
                                    <div className="pr-legend-grid">
                                        {copy.services.map((s, i) => (
                                            <div className="pr-legend-item pr-mono" key={s}>
                                                <span className={`pr-key-sq${i === 0 ? " pr-key-solid" : ""}`} aria-hidden="true">
                                                    {i > 0 && <Hatch id={legendKeys[i - 1]} />}
                                                </span>
                                                <span>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- prancha 04 — contato ---------- */}
            <section id="contact" className="pr-sheet pr-sec">
                <div className="pr-sheet-in">
                    <SheetFrame />
                    <div className="pr-sec-in">
                        <div className="pr-sec-top">
                            <h2 className="pr-sec-title">Contato</h2>
                            <div className="pr-sec-meta pr-mono">
                                <span>Prancha {sheetNo("contact")}</span>
                                <span>{brand.city}</span>
                            </div>
                        </div>

                        <div className="pr-contact">
                            <div>
                                <ul className="pr-contact-lines pr-mono">
                                    <li>
                                        <a href={`mailto:${brand.email}`}>
                                            <b>E-mail</b>
                                            <span className="pr-contact-val">{brand.email}</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={brand.whatsapp.href} target="_blank" rel="noreferrer">
                                            <b>WhatsApp</b>
                                            <span className="pr-contact-val">{brand.whatsapp.display}</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={brand.instagram.href} target="_blank" rel="noreferrer">
                                            <b>Instagram</b>
                                            <span className="pr-contact-val">{brand.instagram.handle}</span>
                                        </a>
                                    </li>
                                    <li>
                                        <div className="pr-static">
                                            <b>Local</b>
                                            <span className="pr-contact-val">{brand.city}</span>
                                        </div>
                                    </li>
                                </ul>
                                <a className="pr-btn pr-btn-fill" href={brand.whatsapp.href} target="_blank" rel="noreferrer">
                                    Falar no WhatsApp
                                    <ArrowIcon />
                                </a>
                            </div>

                            <PranchaForm />
                        </div>
                    </div>
                </div>
            </section>

            <footer className="pr-foot">
                <div className="pr-foot-in">
                    <div className="pr-foot-left">
                        <Image
                            src={brand.logos.horizontalNeg1}
                            alt={brand.name}
                            width={160}
                            height={40}
                            style={{ height: 20, width: "auto" }}
                            unoptimized
                        />
                        <nav className="pr-foot-nav pr-mono" aria-label="Rodapé">
                            {copy.sections.map((s) => (
                                <a key={s.id} href={`#${s.id}`}>
                                    {s.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <TitleBlock className="pr-tb-sm" rows={titleBlockRows} />
                </div>
            </footer>
        </main>
    );
}
