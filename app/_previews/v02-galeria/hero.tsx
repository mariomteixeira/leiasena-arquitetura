"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { brand, copy } from "../_shared/content";
import GalleryCanvas from "./gallery-canvas";
import { clamp, cssBox, printsFor } from "./gallery-config";

function Arrow() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

/** Static collage: the same prints as plain images. Shown under the canvas and when WebGL is unavailable. */
function Collage({ compact }: { compact: boolean }) {
    const prints = printsFor(compact);
    return (
        <div className={`g-collage ${compact ? "g-collage--m" : "g-collage--d"}`}>
            {prints.map((p, i) => {
                const b = cssBox(p, compact);
                return (
                    <figure
                        key={p.id}
                        className="g-print"
                        style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, opacity: b.opacity, zIndex: b.z }}
                    >
                        <div className="g-print__img" style={{ aspectRatio: String(p.aspect) }}>
                            <Image
                                src={p.src}
                                alt={p.alt}
                                fill
                                sizes={compact ? "70vw" : "40vw"}
                                priority={!compact && i === 0}
                            />
                        </div>
                    </figure>
                );
            })}
        </div>
    );
}

export default function Hero() {
    const section = useRef<HTMLElement>(null);
    const progress = useRef(0);
    const pointer = useRef({ x: 0, y: 0 });
    const activeRef = useRef(false);
    const [active, setActive] = useState(false);
    const [reduced, setReduced] = useState(false);
    const [compact, setCompact] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
        const cm = window.matchMedia("(max-width: 767px)");
        const sync = () => {
            setReduced(rm.matches);
            setCompact(cm.matches);
        };
        sync();
        setMounted(true);
        rm.addEventListener("change", sync);
        cm.addEventListener("change", sync);
        return () => {
            rm.removeEventListener("change", sync);
            cm.removeEventListener("change", sync);
        };
    }, []);

    // Scroll progress is read only while the hero is on screen.
    useEffect(() => {
        const el = section.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                const on = entries.some((e) => e.isIntersecting);
                activeRef.current = on;
                setActive(on);
            },
            { threshold: 0 },
        );
        io.observe(el);
        const onScroll = () => {
            if (!activeRef.current) return;
            const stage = el.firstElementChild as HTMLElement | null;
            const max = el.offsetHeight - (stage?.offsetHeight ?? window.innerHeight);
            const p = max > 0 ? clamp(-el.getBoundingClientRect().top / max, 0, 1) : 0;
            progress.current = p;
            el.style.setProperty("--p", p.toFixed(4));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            io.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    useEffect(() => {
        if (compact || reduced) return;
        const onMove = (e: PointerEvent) => {
            if (!activeRef.current) return;
            pointer.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -((e.clientY / window.innerHeight) * 2 - 1),
            };
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [compact, reduced]);

    const onReady = useCallback(() => setReady(true), []);
    const onFail = useCallback(() => setFailed(true), []);

    return (
        <section id="home" ref={section} className={`g-hero${ready ? " is-3d" : ""}`}>
            <div className="g-hero__stage">
                <Collage compact={false} />
                <Collage compact />
                {mounted && !failed && (
                    <GalleryCanvas
                        compact={compact}
                        reduced={reduced}
                        active={active}
                        progress={progress}
                        pointer={pointer}
                        onReady={onReady}
                        onFail={onFail}
                    />
                )}
                <div className="g-hero__overlay">
                    <h1 className="g-hero__title">
                        {brand.shortName}
                        <em>Arquitetura</em>
                    </h1>
                    <div className="g-hero__bottom">
                        <div className="g-hero__lines">
                            <p className="g-hero__role">{copy.roleLine}</p>
                            <p className="g-hero__sub">{copy.heroSubtitle}</p>
                        </div>
                        <div className="g-scrollhint" aria-hidden="true" />
                        <div className="g-hero__cta-wrap">
                            <a className="g-cta" href="#projects">
                                Ver projetos
                                <Arrow />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
