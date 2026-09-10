import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ContactForm from "../../_components/contact-form";
import { brand, copy, projects } from "../_shared/content";
import Reveal from "../_shared/reveal";
import Header from "./header";
import Hero from "./hero";
import "./galeria.css";

function Arrow() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Galeria() {
    return (
        <main className="g-root">
            <style href="preview-galeria" precedence="default">{`body{background:#DDD9CE}`}</style>
            <Header />
            <Hero />

            <section id="projects" className="g-section">
                <div className="g-wrap">
                    <Reveal className="reveal g-head">
                        <h2 className="g-h2">Projetos</h2>
                        <p className="g-head__line">{copy.heroTitle}</p>
                    </Reveal>
                    <ul className="g-grid">
                        {projects.map((p, i) => (
                            <Reveal as="li" key={p.slug} className="reveal" style={delay((i % 2) * 120)}>
                                <Link href={`/projetos/${p.slug}`} className="g-card">
                                    <div className="g-frame g-card__cover">
                                        <div className="g-img">
                                            <Image src={p.cover} alt={`Projeto ${p.title}`} fill sizes="(min-width: 768px) 50vw, 100vw" />
                                        </div>
                                    </div>
                                    <div className="g-card__pair">
                                        {p.images.slice(1, 3).map((src, j) => (
                                            <div key={src} className="g-frame">
                                                <div className="g-img">
                                                    <Image src={src} alt={`Projeto ${p.title}, imagem ${j + 2}`} fill sizes="(min-width: 768px) 25vw, 50vw" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <h3 className="g-card__title">
                                        <em>{p.title}</em>
                                        <Arrow />
                                    </h3>
                                </Link>
                            </Reveal>
                        ))}
                    </ul>
                </div>
            </section>

            <section id="about" className="g-section">
                <div className="g-wrap">
                    <Reveal className="reveal">
                        <h2 className="g-h2">Sobre</h2>
                        <p className="g-statement">{copy.aboutP1}</p>
                    </Reveal>
                    <Reveal className="reveal g-about__row" style={delay(120)}>
                        <div className="g-frame g-portrait">
                            <div className="g-img">
                                <Image src={brand.portrait} alt={`${brand.shortName}, ${brand.role.toLowerCase()}`} fill sizes="240px" />
                            </div>
                        </div>
                        <div className="g-about__text">
                            <p>{copy.aboutP2}</p>
                            <ul className="g-services">
                                {copy.services.map((s) => (
                                    <li key={s}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section id="contact" className="g-section">
                <div className="g-wrap">
                    <Reveal className="reveal">
                        <h2 className="g-h2">Contato</h2>
                    </Reveal>
                    <div className="g-contact__grid">
                        <Reveal className="reveal g-form">
                            <ContactForm />
                        </Reveal>
                        <Reveal className="reveal g-links" style={delay(120)}>
                            <a className="g-biglink" href={`mailto:${brand.email}`}>
                                {brand.email}
                            </a>
                            <a className="g-biglink" href={brand.whatsapp.href} target="_blank" rel="noreferrer">
                                {brand.whatsapp.display}
                                <small>WhatsApp</small>
                            </a>
                            <a className="g-biglink" href={brand.instagram.href} target="_blank" rel="noreferrer">
                                {brand.instagram.handle}
                                <small>Instagram</small>
                            </a>
                            <p className="g-city">{brand.city}</p>
                        </Reveal>
                    </div>
                </div>
            </section>

            <footer className="g-footer">
                <div className="g-wrap g-footer__row">
                    <span>{brand.name}</span>
                    <span>{brand.city}</span>
                    <a href={brand.instagram.href} target="_blank" rel="noreferrer">
                        {brand.instagram.handle}
                    </a>
                </div>
            </footer>
        </main>
    );
}
