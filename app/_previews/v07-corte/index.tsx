import Image from "next/image";
import type { CSSProperties } from "react";
import ContactForm from "../../_components/contact-form";
import { brand, copy, projects } from "../_shared/content";
import Reveal from "../_shared/reveal";
import Bands from "./bands";
import { Arrow } from "./icons";
import Nav from "./nav";
import "./corte.css";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** v07 — Corte: the building section as the page. */
export default function Corte() {
    const hero = projects[0];
    return (
        <main className="corte">
            <style href="preview-corte" precedence="default">{`body{background:#171717}`}</style>
            <Nav />

            <section id="home" className="c-hero" data-tone="dark" aria-label="Início">
                <div className="c-hero-img">
                    <Image src={hero.cover} alt={`Projeto ${hero.title}`} fill priority sizes="100vw" />
                    <div className="c-hero-scrim" />
                </div>
                <div className="c-hero-cut" aria-hidden="true" />
                <div className="c-hero-copy">
                    <div>
                        <h1 className="c-hero-title">{copy.heroTitle}</h1>
                        <p className="c-hero-role c-mono">{copy.roleLine}</p>
                        <div className="c-hero-actions">
                            <a className="c-cta c-mono" href="#projects">
                                Ver projetos
                                <Arrow />
                            </a>
                            <a className="c-cta c-mono" href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer">
                                WhatsApp
                                <Arrow />
                            </a>
                        </div>
                    </div>
                    <a className="c-hero-tab c-mono" href={`/projetos/${hero.slug}`}>
                        <i className="c-sq" aria-hidden="true" />
                        Projeto {hero.title}
                    </a>
                </div>
            </section>

            <section id="projects" className="c-projects" data-tone="dark" aria-labelledby="projects-h">
                <div className="c-projects-head c-mono">
                    <h2 id="projects-h">Projetos</h2>
                    <span>{brand.city}</span>
                </div>
                <Bands />
            </section>

            <section id="about" className="c-light c-about" data-tone="light" aria-labelledby="about-h">
                <div className="c-cut" aria-hidden="true" />
                <div className="c-about-grid">
                    <figure className="c-about-fig">
                        <Image src={brand.portrait} alt={`${brand.shortName}, ${brand.role.toLowerCase()}`} fill sizes="(min-width: 768px) 42vw, 100vw" />
                        <span className="c-about-strip" aria-hidden="true" />
                    </figure>
                    <div className="c-about-body">
                        <Reveal className="reveal">
                            <h2 id="about-h" className="c-h2">{brand.shortName}</h2>
                            <p className="c-sub c-mono">
                                {brand.role} · {brand.city}
                            </p>
                        </Reveal>
                        <Reveal className="reveal" style={delay(120)}>
                            <p className="c-lead">{copy.aboutP1}</p>
                            <p className="c-p">{copy.aboutP2}</p>
                        </Reveal>
                        <Reveal className="reveal" style={delay(200)}>
                            <ul className="c-services c-mono">
                                {copy.services.map((s) => (
                                    <li key={s}>
                                        <i className="c-sq" aria-hidden="true" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    </div>
                </div>
            </section>

            <section id="contact" className="c-light c-contact" data-tone="light" aria-labelledby="contact-h">
                <div className="c-cut" aria-hidden="true" />
                <div className="c-contact-grid">
                    <Reveal className="reveal">
                        <h2 id="contact-h" className="c-h2">Contato</h2>
                        <p className="c-sub c-mono">{brand.city}</p>
                        <ul className="c-links">
                            <li>
                                <span className="k c-mono">WhatsApp</span>
                                <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer">
                                    {brand.whatsapp.display}
                                </a>
                            </li>
                            <li>
                                <span className="k c-mono">E-mail</span>
                                <a href={`mailto:${brand.email}`}>{brand.email}</a>
                            </li>
                            <li>
                                <span className="k c-mono">Instagram</span>
                                <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                                    {brand.instagram.handle}
                                </a>
                            </li>
                        </ul>
                    </Reveal>
                    <Reveal className="reveal c-form" style={delay(120)}>
                        <ContactForm />
                    </Reveal>
                </div>
            </section>

            <footer className="c-foot" data-tone="dark">
                <div className="c-cut c-cut--dark" aria-hidden="true" />
                <div className="c-foot-grid">
                    <Image src={brand.logos.horizontalNeg2} alt={brand.name} width={128} height={32} unoptimized />
                    <div className="c-foot-links c-mono">
                        <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                            {brand.instagram.handle}
                        </a>
                        <a href={`mailto:${brand.email}`}>{brand.email}</a>
                        <span>{brand.city}</span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
