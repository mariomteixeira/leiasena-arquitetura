"use client";

import { useEffect, useState } from "react";
import { brand, copy } from "../_shared/content";

const symbol = brand.logos.symbolNeg1;

export default function Header() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const root = document.documentElement;
        const prev = root.style.overflow;
        root.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            root.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            <header className="vt-header">
                <div className="vt-wrap vt-header-in">
                    <a href="#home" className="vt-logo" aria-label={brand.name}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={symbol} alt="" width={48} height={53} />
                    </a>
                    <nav className="vt-nav" aria-label="Seções">
                        {copy.sections.map((s) => (
                            <a key={s.id} href={`#${s.id}`}>
                                {s.label}
                            </a>
                        ))}
                    </nav>
                    <button
                        type="button"
                        className="vt-burger"
                        aria-label="Abrir menu"
                        aria-expanded={open}
                        aria-controls="vt-menu"
                        onClick={() => setOpen(true)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M3 7h18M3 12h18M3 17h18" />
                        </svg>
                    </button>
                </div>
            </header>

            {open && (
                <div id="vt-menu" className="vt-menu" role="dialog" aria-modal="true" aria-label="Menu">
                    <div className="vt-menu-top">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={symbol} alt={brand.name} width={44} height={49} style={{ height: 44, width: "auto" }} />
                        <button type="button" className="vt-burger" aria-label="Fechar menu" onClick={() => setOpen(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M5 5l14 14M19 5L5 19" />
                            </svg>
                        </button>
                    </div>
                    <ul className="vt-menu-links">
                        {copy.sections.map((s, i) => (
                            <li key={s.id}>
                                <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                                    {s.label}
                                    <span className="vt-mono">0{i + 1}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="vt-menu-foot">
                        <a href={brand.whatsapp.href} target="_blank" rel="noreferrer" className="vt-btn vt-btn-primary">
                            <WhatsIcon />
                            Chamar no WhatsApp
                        </a>
                        <div className="vt-mono" style={{ color: "rgba(23,23,23,.6)", display: "flex", justifyContent: "space-between" }}>
                            <a href={brand.instagram.href} target="_blank" rel="noreferrer">
                                {brand.instagram.handle}
                            </a>
                            <span>{brand.city}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export function WhatsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 20l1.3-3.8A8 8 0 1 1 8.2 19L4 20z" />
            <path d="M9.5 9.2c0 2.4 2.9 5.3 5.3 5.3l1.2-1.2-1.8-1-1 .8c-.8-.3-1.9-1.4-2.2-2.2l.8-1-1-1.8-1.3 1.1z" />
        </svg>
    );
}
