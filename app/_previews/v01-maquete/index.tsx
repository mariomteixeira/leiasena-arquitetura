import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "../_shared/reveal";
import { brand, copy, projects } from "../_shared/content";
import ContactForm from "../../_components/contact-form";
import Header from "./header";
import HeroModel from "./hero-model";
import "./maquete.css";

function Arrow() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
        </svg>
    );
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Maquete() {
    const first = projects[0];

    const staticModel = (
        <div className="mq-static">
            <div className="mq-static-model">
                <div className="mq-static-card">
                    <Image src={first.cover} alt={`Projeto ${first.title}`} fill sizes="(min-width: 1024px) 45vw, 90vw" priority />
                </div>
                <div className="mq-static-plinth" />
            </div>
        </div>
    );

    return (
        <main className="mq">
            <style href="preview-maquete" precedence="default">{`body{background:#DDD9CE}`}</style>
            <Header />

            <section id="home" className="mq-hero">
                <div className="mq-hero-copy">
                    <h1 className="mq-hero-title">{copy.heroTitle}</h1>
                    <p className="mq-hero-role">{copy.roleLine}</p>
                    <div className="mq-actions">
                        <a href="#projects" className="mq-btn mq-btn-fill">
                            Ver projetos <Arrow />
                        </a>
                        <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer" className="mq-btn mq-btn-line">
                            Fale comigo
                        </a>
                    </div>
                </div>
                <div className="mq-stage" role="img" aria-label={`Maquete com a fachada do projeto ${first.title}`}>
                    <HeroModel fallback={staticModel} />
                </div>
            </section>

            <section id="projects" className="mq-section">
                <Reveal className="reveal">
                    <div className="mq-sec-head">
                        <h2 className="mq-sec-title">Projetos</h2>
                        <p className="mq-sec-aside">{copy.heroSubtitle}</p>
                    </div>
                </Reveal>
                <ul className="mq-grid">
                    {projects.map((p, i) => (
                        <Reveal as="li" key={p.slug} className="reveal" style={delay((i % 2) * 90)}>
                            <Link href={`/projetos/${p.slug}`} className="mq-tile">
                                <div className="mq-tile-img">
                                    <Image src={p.cover} alt={`Projeto ${p.title}`} fill sizes="(min-width: 768px) 50vw, 100vw" />
                                </div>
                                <div className="mq-tile-meta">
                                    <span className="mq-tile-title">{p.title}</span>
                                    <span className="mq-tile-cta">
                                        Ver projeto <Arrow />
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </ul>
            </section>

            <section id="about" className="mq-section">
                <Reveal className="reveal">
                    <div className="mq-sec-head">
                        <h2 className="mq-sec-title">Sobre</h2>
                        <p className="mq-sec-aside">{brand.role}</p>
                    </div>
                </Reveal>
                <div className="mq-about">
                    <Reveal as="figure" className="reveal mq-portrait">
                        <Image src={brand.portrait} alt={brand.shortName} fill sizes="(min-width: 1024px) 40vw, 420px" />
                    </Reveal>
                    <Reveal className="reveal mq-about-text" style={delay(120)}>
                        <p className="mq-about-lead">{copy.aboutP1}</p>
                        <p className="mq-about-p">{copy.aboutP2}</p>
                        <ul className="mq-services">
                            {copy.services.map((s) => (
                                <li key={s}>{s}</li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            <section id="contact" className="mq-section">
                <Reveal className="reveal">
                    <div className="mq-sec-head">
                        <h2 className="mq-sec-title">Contato</h2>
                        <p className="mq-sec-aside">{brand.city}</p>
                    </div>
                </Reveal>
                <div className="mq-contact">
                    <Reveal className="reveal">
                        <ul className="mq-biglinks">
                            <li>
                                <a className="mq-biglink" href={`mailto:${brand.email}`}>
                                    <small>E-mail</small>
                                    <span>{brand.email}</span>
                                </a>
                            </li>
                            <li>
                                <a className="mq-biglink" href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer">
                                    <small>WhatsApp</small>
                                    <span>{brand.whatsapp.display}</span>
                                </a>
                            </li>
                            <li>
                                <a className="mq-biglink" href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                                    <small>Instagram</small>
                                    <span>{brand.instagram.handle}</span>
                                </a>
                            </li>
                            <li>
                                <div className="mq-biglink is-text">
                                    <small>Cidade</small>
                                    <span>{brand.city}</span>
                                </div>
                            </li>
                        </ul>
                    </Reveal>
                    <Reveal className="reveal mq-form" style={delay(120)}>
                        <ContactForm />
                    </Reveal>
                </div>
            </section>

            <footer className="mq-footer">
                <a href="#home" className="mq-footer-brand">
                    <Image src={brand.logos.symbolNeg1} alt="" width={36} height={40} />
                    <span className="mq-footer-name">{brand.name}</span>
                </a>
                <p className="mq-footer-meta">
                    <span>© {brand.name}</span>
                    <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                        {brand.instagram.handle}
                    </a>
                </p>
            </footer>
        </main>
    );
}
