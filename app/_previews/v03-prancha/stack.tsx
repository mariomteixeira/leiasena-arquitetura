"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";
import { coverSize, pad, projects, px, ratio, TOTAL } from "./data";
import { ArrowIcon, Dimension } from "./sheet";

const STEP = 15;
const DEPTH = 24;

function cardTransform(offset: number) {
    if (offset >= 0) {
        return `translate3d(${offset * STEP}px, ${offset * STEP}px, ${-offset * DEPTH}px)`;
    }
    const f = -offset;
    return `translate3d(${-f * STEP}px, ${-f * STEP}px, ${-(TOTAL - 1 + f) * DEPTH}px) rotateY(-180deg)`;
}

export default function Stack() {
    const [index, setIndex] = useState(0);
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 981px)");
        const apply = () => setFlip(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    const go = (n: number) => setIndex(Math.min(projects.length - 1, Math.max(0, n)));

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!flip) return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            go(index + 1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            go(index - 1);
        }
    };

    const current = projects[index];
    const size = coverSize[current.slug];

    return (
        <div className="pr-stack-wrap">
            <div
                className="pr-stage"
                tabIndex={flip ? 0 : -1}
                role={flip ? "group" : undefined}
                aria-label={flip ? "Pilha de pranchas — use as setas para folhear" : undefined}
                onKeyDown={onKeyDown}
            >
                <ul className="pr-stack">
                    {projects.map((p, i) => {
                        const offset = i - index;
                        const flipped = flip && offset < 0;
                        const style = flip
                            ? ({ transform: cardTransform(offset), zIndex: TOTAL - Math.abs(offset) } as CSSProperties)
                            : undefined;
                        const s = coverSize[p.slug];
                        const hidden = flip && i !== index;
                        return (
                            <li key={p.slug} className={`pr-card${flipped ? " is-flipped" : ""}`} style={style}>
                                <div className="pr-face pr-face-front" aria-hidden={hidden || undefined}>
                                    <div className="pr-card-top">
                                        <span className="pr-mono">
                                            Prancha {pad(i + 1)}/{pad(TOTAL)}
                                        </span>
                                        <span className="pr-mono">{p.images.length} imagens</span>
                                    </div>
                                    <div className="pr-card-fig">
                                        <Image
                                            src={p.cover}
                                            alt={`Projeto ${p.title}`}
                                            fill
                                            sizes="(max-width: 980px) 84vw, 60vw"
                                        />
                                    </div>
                                    <Dimension label={px(s)} axis="x" />
                                    <div className="pr-card-foot">
                                        <span className="pr-card-name">{p.title}</span>
                                        <Link
                                            className="pr-card-link pr-mono"
                                            href={`/projetos/${p.slug}`}
                                            tabIndex={hidden ? -1 : undefined}
                                        >
                                            Ver projeto
                                            <ArrowIcon />
                                        </Link>
                                    </div>
                                </div>

                                <div className="pr-face pr-face-back" aria-hidden="true">
                                    <div>
                                        <span className="pr-mono">
                                            Verso · prancha {pad(i + 1)}/{pad(TOTAL)}
                                        </span>
                                        <div className="pr-back-no">{pad(i + 1)}</div>
                                    </div>
                                    <div className="pr-card-foot">
                                        <span className="pr-card-name">{p.title}</span>
                                        <Link className="pr-card-link pr-mono" href={`/projetos/${p.slug}`} tabIndex={-1}>
                                            Ver projeto
                                            <ArrowIcon />
                                        </Link>
                                    </div>
                                </div>

                                {flip && offset > 0 && (
                                    <button type="button" className="pr-hit" onClick={() => go(i)}>
                                        <span className="pr-sr">
                                            Folhear até a prancha {pad(i + 1)} — {p.title}
                                        </span>
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="pr-rail">
                <div className="pr-idx">
                    {projects.map((p, i) => (
                        <button
                            key={p.slug}
                            type="button"
                            aria-current={i === index ? "true" : undefined}
                            aria-label={`Prancha ${pad(i + 1)} — ${p.title}`}
                            onClick={() => go(i)}
                        >
                            {pad(i + 1)}
                        </button>
                    ))}
                </div>

                <div className="pr-arrows">
                    <button
                        type="button"
                        className="pr-arrow"
                        onClick={() => go(index - 1)}
                        disabled={index === 0}
                        aria-label="Prancha anterior"
                    >
                        <ArrowIcon dir="left" />
                    </button>
                    <button
                        type="button"
                        className="pr-arrow"
                        onClick={() => go(index + 1)}
                        disabled={index === projects.length - 1}
                        aria-label="Próxima prancha"
                    >
                        <ArrowIcon />
                    </button>
                </div>

                <div className="pr-rail-meta pr-mono">
                    <dl>
                        <dt>Projeto</dt>
                        <dd>{current.title}</dd>
                        <dt>Arquivo</dt>
                        <dd>01.png</dd>
                        <dt>Dimensão</dt>
                        <dd>{px(size)}</dd>
                        <dt>Proporção</dt>
                        <dd>{ratio(size)}</dd>
                        <dt>Imagens</dt>
                        <dd>{pad(current.images.length)}</dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}
