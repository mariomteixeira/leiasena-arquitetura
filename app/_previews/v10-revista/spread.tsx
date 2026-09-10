"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Reveal from "../_shared/reveal";
import type { Project } from "../_shared/content";
import Tilt from "./tilt";

/** A two-page spread. The right page is a 3D leaf: lifts on hover, turns fully on click to show its back. */
export default function Spread({
    project,
    second,
    third,
    coverAspect,
    titleBelow = false,
}: {
    project: Project;
    second: string;
    third: string;
    coverAspect: string;
    titleBelow?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen((o) => !o);
    const mono = "font-mono text-[12px] uppercase tracking-[0.08em]";
    const href = `/projetos/${project.slug}`;

    const title = (
        <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-[2.4rem] leading-none tracking-[-0.02em] text-foreground md:text-[3rem]">{project.title}</h3>
            <button
                type="button"
                aria-pressed={open}
                onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                }}
                className={`${mono} text-foreground/65 transition-colors duration-300 hover:text-navy`}
            >
                {open ? "Voltar" : "Virar"}
            </button>
        </div>
    );

    return (
        <Reveal as="article" className="rv-spread rv-reveal grid md:grid-cols-2">
            <div className="rv-leaf">
                <Tilt className={`${coverAspect} overflow-hidden`}>
                    <Image src={project.cover} alt={project.title} fill sizes="(min-width: 768px) 46vw, 100vw" className="object-cover" />
                </Tilt>
            </div>

            <div className="rv-slot aspect-[4/5] md:aspect-auto">
                <div className="rv-under flex flex-col justify-between p-6 md:p-8 md:pl-10" aria-hidden>
                    <span className={`${mono} text-navy`}>Projeto</span>
                    <span className="font-serif text-[2.4rem] leading-none tracking-[-0.02em] md:text-[3rem]">{project.title}</span>
                    <span className={`${mono} text-navy`}>Ver projeto →</span>
                </div>

                <div className={`rv-page ${open ? "is-open" : ""}`} onClick={toggle}>
                    <div className="rv-face rv-front flex flex-col p-5 md:py-0 md:pl-10 md:pr-0">
                        {!titleBelow && title}
                        <div className={`relative min-h-0 flex-1 ${titleBelow ? "mb-5" : "mt-5"}`}>
                            <Image src={second} alt="" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
                        </div>
                        {titleBelow && title}
                        <div className={`${mono} flex items-center justify-between pt-4`}>
                            <Link href={href} onClick={(e) => e.stopPropagation()} className="text-navy underline-offset-4 hover:underline">
                                Ver projeto →
                            </Link>
                            <span className="text-foreground/65">Projeto</span>
                        </div>
                    </div>
                    <div className="rv-face rv-back">
                        <Image src={third} alt="" fill sizes="(min-width: 768px) 46vw, 100vw" className="object-cover" />
                        <span className={`${mono} absolute bottom-4 left-4 bg-white px-2.5 py-1.5 text-foreground`}>{project.title}</span>
                    </div>
                </div>
            </div>

            <div className={`${mono} mt-4 flex items-center justify-between border-t rv-hair pt-2.5 text-foreground/65 md:col-span-2`}>
                <span>Projetos</span>
                <Link href={href} className="transition-colors duration-300 hover:text-navy">
                    {project.title}
                </Link>
            </div>
        </Reveal>
    );
}
