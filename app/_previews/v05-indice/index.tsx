import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "../_shared/reveal";
import { brand, copy, projects } from "../_shared/content";
import Nav from "./nav";
import IndexList from "./index-list";
import ContactForm from "./contact-form";
import { ArrowIcon } from "./icons";
import "./indice.css";

const rise = (i: number) => ({ "--i": i } as CSSProperties);

/**
 * v05 — Índice. The home is an index: words first, images follow the cursor.
 * BIG (list home) · Morphosis (big-word nav) · Woodcliffe (name enormous) · Jacobsen (text-first).
 */
export default function Indice() {
    return (
        <main className="v05">
            <style href="preview-indice" precedence="default">{`body{background:#FFFFFF}`}</style>
            <Nav />

            {/* ---------- hero: the index ---------- */}
            <section id="home" className="hero" aria-label={brand.name}>
                <div className="idx-col">
                    <h1 className="name rise" style={{ fontStretch: "125%" }}>
                        {brand.shortName}
                    </h1>
                    <p className="role role-m rise" style={rise(1)}>{copy.roleLine}</p>
                    <IndexList projects={projects} />
                </div>

                <div className="cap">
                    <p className="lead rise" style={rise(1)}>{copy.heroTitle}</p>
                    <p className="role role-d rise" style={rise(2)}>{copy.roleLine}</p>
                    <p className="bio rise" style={rise(3)}>{copy.bioShort}</p>
                    <div className="acts rise" style={rise(4)}>
                        <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer">
                            Fale comigo <ArrowIcon />
                        </a>
                        <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                            Instagram <ArrowIcon />
                        </a>
                    </div>
                </div>
            </section>

            {/* ---------- Projetos ---------- */}
            <section id="projects" className="sec">
                <div className="sec-head">
                    <h2>Projetos</h2>
                    <p>{copy.heroSubtitle}</p>
                </div>
                <ol className="plist">
                    {projects.map((p) => (
                        <Reveal as="li" key={p.slug} className="reveal">
                            <Link href={`/projetos/${p.slug}`} className="prow">
                                <div className="ph">
                                    <h3>{p.title}</h3>
                                    <span className="m">Ver projeto <ArrowIcon /></span>
                                </div>
                                <div className="imgs">
                                    <figure className="fig wide">
                                        <Image
                                            src={p.images[0]}
                                            alt={`Projeto ${p.title}`}
                                            fill
                                            sizes="(min-width: 900px) 70vw, 100vw"
                                        />
                                    </figure>
                                    <figure className="fig">
                                        <Image src={p.images[1]} alt="" fill sizes="(min-width: 900px) 35vw, 50vw" />
                                    </figure>
                                    <figure className="fig">
                                        <Image src={p.images[2]} alt="" fill sizes="(min-width: 900px) 35vw, 50vw" />
                                    </figure>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </ol>
            </section>

            {/* ---------- Sobre ---------- */}
            <section id="about" className="sec about">
                <div className="sec-head">
                    <h2>Sobre</h2>
                    <p>{brand.role} · {brand.city}</p>
                </div>
                <div className="about-grid">
                    <Reveal as="figure" className="reveal portrait">
                        <Image
                            src={brand.portrait}
                            alt={`Retrato de ${brand.shortName}`}
                            fill
                            sizes="(min-width: 900px) 38vw, 100vw"
                        />
                        <figcaption>{brand.shortName} · {brand.role}</figcaption>
                    </Reveal>
                    <Reveal className="reveal about-body" style={{ "--d": "120ms" } as CSSProperties}>
                        <p className="p1">{copy.aboutP1}</p>
                        <p className="p2">{copy.aboutP2}</p>
                        <ul className="svc">
                            {copy.services.map((s) => (
                                <li key={s}>
                                    {s}
                                    <ArrowIcon />
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* ---------- Contato ---------- */}
            <section id="contact" className="sec">
                <div className="sec-head">
                    <h2>Contato</h2>
                    <p>{brand.city}</p>
                </div>
                <div className="contact-grid">
                    <Reveal className="reveal cform">
                        <ContactForm />
                    </Reveal>
                    <Reveal className="reveal" style={{ "--d": "120ms" } as CSSProperties}>
                        <ul className="clinks">
                            <li>
                                <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer">
                                    <span className="w">WhatsApp</span>
                                    <span className="d">{brand.whatsapp.display}</span>
                                </a>
                            </li>
                            <li>
                                <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                                    <span className="w">Instagram</span>
                                    <span className="d">{brand.instagram.handle}</span>
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${brand.email}`}>
                                    <span className="w">E-mail</span>
                                    <span className="d">{brand.email}</span>
                                </a>
                            </li>
                        </ul>
                        <p className="city">{brand.city}</p>
                    </Reveal>
                </div>
            </section>

            <footer className="foot">
                <span>© {new Date().getFullYear()} {brand.name}</span>
                <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">{brand.instagram.handle}</a>
            </footer>
        </main>
    );
}
