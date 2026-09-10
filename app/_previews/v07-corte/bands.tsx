"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "../_shared/content";
import { Arrow } from "./icons";

/**
 * Project bands as slabs. The tilt is driven by CSS scroll-driven animations
 * (`animation-timeline: view()`); where unsupported, this sets `--p` (0..1 view progress)
 * per band on scroll and the CSS derives the same rotateX / slide from it.
 */
export default function Bands() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;
        if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()")) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const slabs = Array.from(root.querySelectorAll<HTMLElement>(".c-slab"));
        let raf = 0;
        const update = () => {
            raf = 0;
            const vh = window.innerHeight;
            for (const slab of slabs) {
                const r = slab.getBoundingClientRect();
                const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
                const band = slab.firstElementChild as HTMLElement | null;
                band?.style.setProperty("--p", p.toFixed(4));
            }
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="c-bands" ref={ref}>
            {projects.map((p) => (
                <div className="c-slab" key={p.slug}>
                    <Link className="c-band" href={`/projetos/${p.slug}`} aria-label={`Projeto ${p.title} — ver projeto`}>
                        <div className="c-band-img">
                            <Image src={p.cover} alt="" fill sizes="100vw" />
                            <div className="c-band-scrim" />
                        </div>
                        <div className="c-band-copy">
                            <h3 className="c-band-title">{p.title}</h3>
                            <span className="c-band-link c-cta c-mono">
                                Ver projeto
                                <Arrow />
                            </span>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
