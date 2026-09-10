"use client";

import { useEffect, useState } from "react";

/**
 * Fixed mono index bottom-right: which scene of the film is on screen.
 * Reads the same flow probes the scroll-driven animations use, so it never
 * disagrees with what is pinned at the top of the viewport.
 */
export default function SceneIndex({ total }: { total: number }) {
    const [n, setN] = useState(1);
    const [inFilm, setInFilm] = useState(false);
    const [overLight, setOverLight] = useState(false);

    useEffect(() => {
        const probes = Array.from(document.querySelectorAll<HTMLElement>(".cin-probe"));
        if (!probes.length) return;
        if (!("IntersectionObserver" in window)) {
            setInFilm(true);
            return;
        }
        const hits = new Set<number>();
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    const i = Number((e.target as HTMLElement).dataset.i ?? "0");
                    if (e.isIntersecting) hits.add(i);
                    else hits.delete(i);
                }
                if (!hits.size) {
                    setInFilm(false);
                    return;
                }
                setInFilm(true);
                setN(Math.min(total, Math.max(1, ...hits)));
            },
            // a thin band at the very top of the viewport: whichever scene is pinned there
            { rootMargin: "0px 0px -99% 0px", threshold: 0 },
        );
        probes.forEach((p) => io.observe(p));

        // the index is white: retire it before a light section reaches it
        const lights = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-light]"));
        const lit = new Set<Element>();
        const io2 = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) lit.add(e.target);
                    else lit.delete(e.target);
                }
                setOverLight(lit.size > 0);
            },
            { rootMargin: "-84% 0px 0px 0px", threshold: 0 },
        );
        lights.forEach((l) => io2.observe(l));

        return () => {
            io.disconnect();
            io2.disconnect();
        };
    }, [total]);

    return (
        <div className={`cin-index${inFilm && !overLight ? " is-on" : ""}`} aria-hidden="true">
            <span className="cin-index-n">{String(n).padStart(2, "0")}</span>
            <span>—</span>
            <span>{String(total).padStart(2, "0")}</span>
        </div>
    );
}
