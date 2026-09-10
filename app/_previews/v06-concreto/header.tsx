"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { brand, copy } from "../_shared/content";

const anchors: Record<string, string> = { home: "#home", projects: "#projects", about: "#about", contact: "#contact" };

export default function Header() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.documentElement.style.overflow = open ? "hidden" : "";
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header className="sticky top-0 z-40 bg-navy text-cream">
            <div className="flex h-16 items-stretch md:h-[72px]">
                <a href="#home" className="c-logo-block" aria-label={brand.name} onClick={() => setOpen(false)}>
                    <Image src={brand.logos.symbolNeg1} alt="" width={44} height={49} className="h-11 w-auto md:h-12" />
                </a>
                <span className="font-condensed flex items-center pl-4 text-[1.05rem] font-bold uppercase leading-none tracking-[0.06em] md:pl-5 md:text-[1.25rem]">
                    {brand.name}
                </span>

                <nav className="ml-auto hidden md:flex" aria-label="Navegação">
                    {copy.sections.map((s) => (
                        <a key={s.id} href={anchors[s.id]} className="c-nav-link">
                            {s.label}
                        </a>
                    ))}
                    <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer" className="c-nav-cta">
                        WhatsApp
                    </a>
                </nav>

                <button
                    type="button"
                    className="c-menu-btn ml-auto md:hidden"
                    aria-expanded={open}
                    aria-controls="c-mobile-menu"
                    aria-label={open ? "Fechar menu" : "Abrir menu"}
                    onClick={() => setOpen((v) => !v)}
                >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true">
                        {open ? (
                            <>
                                <path d="M5 5l14 14" />
                                <path d="M19 5L5 19" />
                            </>
                        ) : (
                            <>
                                <path d="M3 6h18" />
                                <path d="M3 12h18" />
                                <path d="M3 18h18" />
                            </>
                        )}
                    </svg>
                </button>
            </div>

            <div
                id="c-mobile-menu"
                hidden={!open}
                className="c-lines-cream fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col bg-navy text-cream md:hidden"
            >
                <nav className="flex flex-col" aria-label="Navegação">
                    {copy.sections.map((s) => (
                        <a key={s.id} href={anchors[s.id]} className="c-menu-link" onClick={() => setOpen(false)}>
                            <span>{s.label}</span>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" aria-hidden="true" className="self-center">
                                <path d="M5 12h14" />
                                <path d="M13 6l6 6-6 6" />
                            </svg>
                        </a>
                    ))}
                </nav>
                <div className="mt-auto grid grid-cols-2 gap-1 p-1">
                    <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-cream justify-center">
                        WhatsApp
                    </a>
                    <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-outline justify-center">
                        Instagram
                    </a>
                    <p className="col-span-2 px-4 py-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-cream/70">
                        {brand.city}
                    </p>
                </div>
            </div>
        </header>
    );
}
