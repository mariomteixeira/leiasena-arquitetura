"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps the hero + project scenes + "Sobre".
 * Scroll-driven scene stacking is CSS-first (animation-timeline in cinema.css).
 * When the browser lacks scroll-driven animations, this sets `--p` (0..1, how far
 * the next scene has covered this one) on every `.cin-scene` from window.scrollY.
 */
export default function Film({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const film = ref.current;
        if (!film) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            film.dataset.timeline = "off";
            return;
        }
        if (
            typeof CSS !== "undefined" &&
            CSS.supports("animation-timeline: view()") &&
            CSS.supports("timeline-scope: --a")
        ) {
            film.dataset.timeline = "css";
            return;
        }
        film.dataset.timeline = "js";

        const scenes = Array.from(film.querySelectorAll<HTMLElement>(".cin-scene"));
        const about = film.querySelector<HTMLElement>(".cin-about");
        if (!scenes.length) return;

        const tops = new Map<HTMLElement, number>();
        let vh = 1;
        let raf = 0;

        const measure = () => {
            vh = window.innerHeight;
            let y = film.getBoundingClientRect().top + window.scrollY;
            for (const child of Array.from(film.children) as HTMLElement[]) {
                if (child.dataset.probe !== undefined) continue; // out of flow
                tops.set(child, y);
                y += child.offsetHeight;
            }
        };

        const update = () => {
            raf = 0;
            const sy = window.scrollY;
            const filmTop = tops.get(scenes[0]) ?? 0;
            const filmEnd = about ? (tops.get(about) ?? 0) + about.offsetHeight : filmTop;
            if (sy + vh < filmTop || sy > filmEnd) return;
            for (let i = 0; i < scenes.length; i++) {
                const next = scenes[i + 1] ?? about;
                const nextTop = next ? (tops.get(next) ?? Infinity) : Infinity;
                const p = Math.min(1, Math.max(0, (sy + vh - nextTop) / vh));
                scenes[i].style.setProperty("--p", p.toFixed(4));
            }
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        const onResize = () => {
            measure();
            onScroll();
        };

        measure();
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        return () => {
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div ref={ref} className="cin-film">
            {children}
        </div>
    );
}
