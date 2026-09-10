import Image from "next/image";
import ContactForm from "../../_components/contact-form";
import Reveal from "../_shared/reveal";
import { brand, copy, projects } from "../_shared/content";
import Header, { WhatsIcon } from "./header";
import RingStage from "./ring";
import "./vitrine.css";

function DragIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12h18" />
            <path d="M7 8l-4 4 4 4" />
            <path d="M17 8l4 4-4 4" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

export default function Vitrine() {
    return (
        <main className="vt">
            <style href="preview-vitrine" precedence="default">{`body{background:#DDD9CE}`}</style>
            <Header />

            {/* ---------- hero ---------- */}
            <section id="home" className="vt-wrap vt-hero" aria-label="Início">
                <div className="vt-hero-copy">
                    <h1 className="vt-hero-title">{copy.heroTitle}</h1>
                    <p className="vt-hero-bio">
                        <strong>{copy.roleLine}.</strong> {copy.bioShort}
                    </p>
                    <div className="vt-hero-cta">
                        <a href="#projects" className="vt-btn vt-btn-primary">
                            Ver projetos
                        </a>
                        <a href="#contact" className="vt-btn vt-btn-outline">
                            Fale comigo
                        </a>
                    </div>
                    <p className="vt-hint vt-mono">
                        <DragIcon />
                        arraste para girar
                    </p>
                </div>
                <div>
                    <RingStage />
                    <p className="vt-hint-m vt-mono">
                        <DragIcon />
                        arraste para girar
                    </p>
                </div>
            </section>

            {/* ---------- projetos ---------- */}
            <section id="projects" className="vt-section" aria-labelledby="vt-projects-h">
                <div className="vt-wrap">
                    <Reveal className="reveal vt-section-head">
                        <h2 id="vt-projects-h" className="vt-h2">
                            Projetos
                        </h2>
                        <span className="vt-mono">{brand.city}</span>
                    </Reveal>
                    <Reveal className="reveal vt-shelf" style={{ "--d": "120ms" } as React.CSSProperties}>
                        <ul className="vt-grid">
                            {projects.map((p) => (
                                <li key={p.slug}>
                                    <a href={`/projetos/${p.slug}`} className="vt-cell">
                                        <div className="vt-cover">
                                            <div className="vt-cover-img">
                                                <Image src={p.cover} alt={`Projeto ${p.title}`} fill sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 90vw" />
                                            </div>
                                            <div className="vt-still">
                                                <Image src={p.images[2]} alt="" fill sizes="(min-width: 1024px) 16vw, 35vw" />
                                            </div>
                                        </div>
                                        <div className="vt-cell-meta">
                                            <h3 className="vt-cell-title">{p.title}</h3>
                                            <span className="vt-cell-link vt-mono">
                                                Ver projeto
                                                <ArrowIcon />
                                            </span>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* ---------- sobre ---------- */}
            <section id="about" className="vt-section" aria-labelledby="vt-about-h">
                <div className="vt-wrap">
                    <Reveal className="reveal vt-section-head">
                        <h2 id="vt-about-h" className="vt-h2">
                            Sobre
                        </h2>
                        <span className="vt-mono">{brand.role}</span>
                    </Reveal>
                    <div className="vt-about">
                        <Reveal className="reveal">
                            <div className="vt-portrait">
                                <Image src={brand.portrait} alt={`${brand.shortName}, ${brand.role.toLowerCase()}`} fill sizes="(min-width: 1024px) 300px, (min-width: 768px) 280px, 90vw" />
                            </div>
                            <div className="vt-portrait-meta">
                                <em>{brand.shortName}</em>
                                <span className="vt-mono">{brand.city}</span>
                            </div>
                        </Reveal>
                        <Reveal className="reveal vt-about-text" style={{ "--d": "120ms" } as React.CSSProperties}>
                            <p className="vt-about-lead">{copy.aboutP1}</p>
                            <p className="vt-about-body">{copy.aboutP2}</p>
                        </Reveal>
                        <Reveal as="div" className="reveal" style={{ "--d": "240ms" } as React.CSSProperties}>
                            <ul className="vt-services vt-mono">
                                {copy.services.map((s) => (
                                    <li key={s}>
                                        {s}
                                        <i aria-hidden="true" />
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ---------- contato ---------- */}
            <section id="contact" className="vt-section" aria-labelledby="vt-contact-h">
                <div className="vt-wrap">
                    <Reveal className="reveal vt-section-head">
                        <h2 id="vt-contact-h" className="vt-h2">
                            Contato
                        </h2>
                        <span className="vt-mono">{brand.city}</span>
                    </Reveal>
                    <div className="vt-contact">
                        <Reveal className="reveal">
                            <p className="vt-contact-lead">Vamos conversar sobre o seu projeto.</p>
                            <a href={brand.whatsapp.href} target="_blank" rel="noreferrer" className="vt-btn vt-btn-primary">
                                <WhatsIcon />
                                Chamar no WhatsApp
                            </a>
                            <ul className="vt-links">
                                <li>
                                    <a href={`mailto:${brand.email}`}>
                                        <span className="vt-mono">E-mail</span>
                                        <span>{brand.email}</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={brand.whatsapp.href} target="_blank" rel="noreferrer">
                                        <span className="vt-mono">WhatsApp</span>
                                        <span>{brand.whatsapp.display}</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={brand.instagram.href} target="_blank" rel="noreferrer">
                                        <span className="vt-mono">Instagram</span>
                                        <span>{brand.instagram.handle}</span>
                                    </a>
                                </li>
                                <li>
                                    <div>
                                        <span className="vt-mono">Cidade</span>
                                        <span>{brand.city}</span>
                                    </div>
                                </li>
                            </ul>
                        </Reveal>
                        <Reveal className="reveal vt-form" style={{ "--d": "120ms" } as React.CSSProperties}>
                            <ContactForm />
                        </Reveal>
                    </div>
                </div>
            </section>

            <footer className="vt-footer">
                <div className="vt-wrap vt-footer-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={brand.logos.horizontalNeg1} alt={brand.name} width={160} height={36} />
                    <div className="vt-footer-links vt-mono">
                        <a href={brand.instagram.href} target="_blank" rel="noreferrer">
                            {brand.instagram.handle}
                        </a>
                        <span>{brand.city}</span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
