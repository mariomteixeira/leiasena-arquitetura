import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "../_shared/reveal";
import { brand, copy, projects, type Project } from "../_shared/content";
import Nav from "./nav";
import Film from "./film";
import SceneIndex from "./scene-index";
import CinemaForm from "./contact-form";
import "./cinema.css";

/** The hero still: the Felipe facade, full-bleed, on a slow push-in. */
const HERO_IMAGE = "/assets/projetos/Felipe/01.png";

/** Felipe's cover opens the film, so its own scene runs a different frame. */
const sceneImage = (p: Project) => (p.slug === "felipe" ? p.images[3] : p.cover);
const stillImage = (p: Project) => (p.slug === "felipe" ? p.images[1] : p.images[2]) ?? p.cover;

function Arrow() {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 8h12M9 3l5 5-5 5" />
        </svg>
    );
}

/**
 * v04 — Cinema. The renders are the film: one full-viewport scene at a time,
 * each stacking over the last as you scroll, titles receding in depth.
 * Olson Kundig · Bernardes · MVRDV · Heatherwick.
 */
export default function Cinema() {
    return (
        <main className="v04">
            <style href="preview-cinema" precedence="default">{`body{background:#171717}`}</style>
            <Nav />
            <SceneIndex total={projects.length} />

            <Film>
                {/* flow probes: they never move, so the scroll-driven scenes read their position */}
                {Array.from({ length: projects.length + 1 }, (_, i) => (
                    <span key={i} className="cin-probe" data-probe="" data-i={i} style={{ "--n": i } as CSSProperties} aria-hidden="true" />
                ))}

                {/* ---------------------------------------------------------- hero */}
                <section id="home" className="cin-scene cin-hero" data-n={0} aria-label={brand.name}>
                    <div className="cin-media">
                        <div className="cin-ken">
                            <Image
                                src={HERO_IMAGE}
                                alt="Projeto Felipe — fachada"
                                fill
                                priority
                                sizes="100vw"
                                className="cin-img"
                            />
                        </div>
                    </div>
                    <div className="cin-scrim" />
                    <div className="cin-scrim-top" />

                    <div className="cin-hero-copy">
                        <p className="cin-role">{copy.roleLine} —</p>
                        <h1 className="cin-title">{copy.heroTitle}</h1>
                        <div className="cin-acts">
                            <a className="cin-link" href="#projects">
                                Ver projetos <Arrow />
                            </a>
                            <a className="cin-link" href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer">
                                WhatsApp <Arrow />
                            </a>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------- project scenes */}
                {projects.map((p, i) => (
                    <section
                        key={p.slug}
                        id={i === 0 ? "projects" : undefined}
                        className="cin-scene"
                        data-n={i + 1}
                        aria-labelledby={`cin-t-${p.slug}`}
                    >
                        <div className="cin-media">
                            <Image
                                src={sceneImage(p)}
                                alt={`Projeto ${p.title}`}
                                fill
                                sizes="100vw"
                                className="cin-img"
                            />
                        </div>
                        <div className="cin-scrim" />

                        <div className="cin-still-wrap" aria-hidden="true">
                            <div className="cin-still">
                                <Image
                                    src={stillImage(p)}
                                    alt=""
                                    fill
                                    sizes="(max-width: 900px) 1px, 26vw"
                                    className="cin-img"
                                />
                            </div>
                        </div>

                        <div className="cin-plane">
                            <div className="cin-depth">
                                <h2 className="cin-scene-title" id={`cin-t-${p.slug}`}>
                                    {p.title}
                                </h2>
                                <p className="cin-meta">
                                    Projeto · {p.images.length} imagens
                                </p>
                                <Link className="cin-link" href={`/projetos/${p.slug}`}>
                                    Ver projeto <Arrow />
                                </Link>
                            </div>
                        </div>
                    </section>
                ))}

                {/* --------------------------------------------------------- sobre */}
                <section id="about" className="cin-about" data-nav-light>
                    <div className="cin-about-grid">
                        <div className="cin-portrait">
                            <Image
                                src={brand.portrait}
                                alt={`${brand.shortName}, ${brand.role.toLowerCase()}`}
                                fill
                                sizes="(max-width: 900px) 100vw, 42vw"
                                className="cin-img"
                            />
                        </div>
                        <div className="cin-about-body">
                            <Reveal className="reveal">
                                <h2 className="cin-h2">{brand.shortName}</h2>
                                <p className="cin-h2-line">
                                    {brand.role} — {brand.city}
                                </p>
                                <p className="cin-body">{copy.aboutP1}</p>
                                <p className="cin-body">{copy.aboutP2}</p>
                                <ul className="cin-services">
                                    {copy.services.map((s) => (
                                        <li key={s}>{s}</li>
                                    ))}
                                </ul>
                            </Reveal>
                        </div>
                    </div>
                </section>
            </Film>

            {/* ------------------------------------------------------------ contato */}
            <section id="contact" className="cin-contact" data-nav-light>
                <Reveal className="reveal">
                    <h2 className="cin-h2">Contato</h2>
                </Reveal>
                <div className="cin-contact-grid">
                    <ul className="cin-reach">
                        <li>
                            <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer">
                                <span className="cin-reach-k">WhatsApp</span>
                                <span className="cin-reach-v">{brand.whatsapp.display}</span>
                            </a>
                        </li>
                        <li>
                            <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                                <span className="cin-reach-k">Instagram</span>
                                <span className="cin-reach-v">{brand.instagram.handle}</span>
                            </a>
                        </li>
                        <li>
                            <a href={`mailto:${brand.email}`}>
                                <span className="cin-reach-k">Email</span>
                                <span className="cin-reach-v">{brand.email}</span>
                            </a>
                        </li>
                        <li>
                            <span>
                                <span className="cin-reach-k">Cidade</span>
                                <span className="cin-reach-v">{brand.city}</span>
                            </span>
                        </li>
                    </ul>
                    <CinemaForm />
                </div>
            </section>

            {/* ------------------------------------------------------------- footer */}
            <footer className="cin-foot">
                <div className="cin-foot-logo">
                    <Image
                        src={encodeURI(brand.logos.horizontalNeg1)}
                        alt={brand.name}
                        width={280}
                        height={70}
                        unoptimized
                    />
                </div>
                <div className="cin-foot-right">
                    <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                        {brand.instagram.handle}
                    </a>
                    <a href={`mailto:${brand.email}`}>{brand.email}</a>
                    <span>{brand.city}</span>
                </div>
            </footer>
        </main>
    );
}
