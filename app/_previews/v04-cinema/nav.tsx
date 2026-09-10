"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { brand, copy } from "../_shared/content";

export default function Nav() {
    const [open, setOpen] = useState(false);
    const [light, setLight] = useState(false);

    // Nav turns near-black while a light section sits under the bar.
    useEffect(() => {
        const targets = document.querySelectorAll<HTMLElement>("[data-nav-light]");
        if (!targets.length || !("IntersectionObserver" in window)) return;
        const hits = new Set<Element>();
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) hits.add(e.target);
                    else hits.delete(e.target);
                }
                setLight(hits.size > 0);
            },
            { rootMargin: "0px 0px -93% 0px", threshold: 0 },
        );
        targets.forEach((t) => io.observe(t));
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const close = () => setOpen(false);

    return (
        <>
            <header className={`cin-nav${light && !open ? " is-light" : ""}`}>
                <a href="#home" className="cin-logo" aria-label="Léia Sena Arquitetura — início" onClick={close}>
                    <Image src={encodeURI(brand.logos.symbolNeg1)} alt="" width={36} height={40} unoptimized />
                </a>
                <nav className="cin-nav-links" aria-label="Seções">
                    {copy.sections.map((s) => (
                        <a key={s.id} href={`#${s.id}`}>
                            {s.label}
                        </a>
                    ))}
                </nav>
                <button
                    type="button"
                    className="cin-burger"
                    aria-expanded={open}
                    aria-controls="cin-menu"
                    onClick={() => setOpen((o) => !o)}
                >
                    <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                        {open ? (
                            <>
                                <path d="M5 5l14 14" />
                                <path d="M19 5L5 19" />
                            </>
                        ) : (
                            <>
                                <path d="M3 8h18" />
                                <path d="M3 16h18" />
                            </>
                        )}
                    </svg>
                </button>
            </header>

            <div id="cin-menu" className="cin-menu" hidden={!open}>
                <nav aria-label="Seções">
                    {copy.sections.map((s, i) => (
                        <a key={s.id} href={`#${s.id}`} onClick={close} style={{ "--i": i } as React.CSSProperties}>
                            <span className="cin-menu-n">{String(i + 1).padStart(2, "0")}</span>
                            {s.label}
                        </a>
                    ))}
                </nav>
                <div className="cin-menu-foot">
                    <a href={brand.whatsapp.href} target="_blank" rel="noreferrer">
                        WhatsApp {brand.whatsapp.display}
                    </a>
                    <a href={brand.instagram.href} target="_blank" rel="noreferrer">
                        {brand.instagram.handle}
                    </a>
                    <a href={`mailto:${brand.email}`}>{brand.email}</a>
                    <span>{brand.city}</span>
                </div>
            </div>
        </>
    );
}
