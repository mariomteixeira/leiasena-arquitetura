"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { brand, copy } from "../_shared/content";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const rootRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        const onDown = (e: PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onDown);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onDown);
        };
    }, [open]);

    return (
        <header ref={rootRef} className={`mq-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
            <div className="mq-header-in">
                <a href="#home" className="mq-logo">
                    <Image src={brand.logos.horizontalNeg1} alt={brand.name} width={160} height={40} priority />
                </a>

                <nav className="mq-nav" aria-label="Principal">
                    <ul>
                        {copy.sections.map((s) => (
                            <li key={s.id}>
                                <a href={`#${s.id}`}>{s.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <button
                    type="button"
                    className="mq-menu-btn"
                    aria-expanded={open}
                    aria-controls="mq-mobile-nav"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="mq-sr">{open ? "Fechar menu" : "Abrir menu"}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                        {open ? (
                            <path d="M5 5l14 14M19 5L5 19" />
                        ) : (
                            <path d="M3 7h18M3 12h18M3 17h18" />
                        )}
                    </svg>
                </button>
            </div>

            <div id="mq-mobile-nav" className="mq-mobile" inert={!open}>
                <nav aria-label="Principal (celular)">
                    <ul>
                        {copy.sections.map((s) => (
                            <li key={s.id}>
                                <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                                    {s.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mq-mobile-foot">
                    <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer">
                        {brand.whatsapp.display}
                    </a>
                    <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                        {brand.instagram.handle}
                    </a>
                </div>
            </div>
        </header>
    );
}
