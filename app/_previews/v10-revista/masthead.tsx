"use client";

import { useEffect, useRef, useState } from "react";
import { brand, copy } from "../_shared/content";

const dateline = `Arquitetura · Interiores · ${brand.city.replace(/\s/g, "")}`;

function Burger() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
    );
}

function NavLinks({ className = "", onPick }: { className?: string; onPick?: () => void }) {
    return (
        <nav aria-label="Seções" className={className}>
            {copy.sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={onPick} className="transition-colors duration-300 hover:text-navy">
                    {s.label}
                </a>
            ))}
        </nav>
    );
}

export default function Masthead() {
    const [open, setOpen] = useState(false);
    const [stuck, setStuck] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !("IntersectionObserver" in window)) return;
        const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const mono = "font-mono text-[12px] uppercase tracking-[0.08em] text-foreground/65";

    return (
        <>
            <header ref={ref} id="masthead" className="rv-masthead pt-5 md:pt-6">
                <div className="flex items-end justify-between gap-6">
                    <h1 className="font-serif text-foreground">{brand.shortName}</h1>
                    <NavLinks className={`hidden md:flex items-center gap-7 pb-2 ${mono}`} />
                    <button type="button" className="md:hidden -mr-2 mb-1 p-2 text-foreground" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(true)}>
                        <Burger />
                    </button>
                </div>
                <div className="mt-3 h-[2px] bg-navy" aria-hidden />
                <div className={`flex items-center justify-between gap-4 border-b rv-hair py-2.5 ${mono} text-[11px] md:text-[12px]`}>
                    <span>{dateline}</span>
                    <a href={brand.instagram.href} target="_blank" rel="noreferrer" className="normal-case tracking-normal transition-colors duration-300 hover:text-navy">
                        {brand.instagram.handle}
                    </a>
                </div>
            </header>

            <div className={`rv-runhead border-b rv-hair ${stuck && !open ? "is-on" : ""}`} inert={!stuck || open}>
                <div className="flex h-12 items-center justify-between px-5 md:px-12">
                    <a href="#home" className="font-serif text-[1.35rem] leading-none tracking-[-0.02em] text-foreground">
                        {brand.shortName}
                    </a>
                    <NavLinks className={`hidden md:flex items-center gap-7 ${mono}`} />
                    <button type="button" className="md:hidden -mr-2 p-2 text-foreground" aria-label="Abrir menu" onClick={() => setOpen(true)}>
                        <Burger />
                    </button>
                </div>
            </div>

            {open && (
                <div className="rv-menu fixed inset-0 z-50 flex flex-col bg-white px-5 pt-5 pb-8" role="dialog" aria-modal="true" aria-label="Menu" data-lenis-prevent>
                    <div className="flex items-end justify-between">
                        <span className="font-serif text-[2.4rem] leading-none tracking-[-0.03em]">{brand.shortName}</span>
                        <button type="button" className="-mr-2 p-2 text-foreground" aria-label="Fechar menu" onClick={() => setOpen(false)}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                                <path d="M5 5l14 14M19 5L5 19" />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-3 h-[2px] bg-navy" aria-hidden />
                    <p className={`border-b rv-hair py-2.5 ${mono} text-[11px]`}>{dateline}</p>
                    <NavLinks className="mt-10 flex flex-col gap-5 font-serif text-[3rem] leading-none tracking-[-0.03em]" onPick={() => setOpen(false)} />
                    <div className={`mt-auto flex flex-col gap-2 ${mono} normal-case tracking-normal`}>
                        <a href={brand.instagram.href} target="_blank" rel="noreferrer">{brand.instagram.handle}</a>
                        <a href={brand.whatsapp.href} target="_blank" rel="noreferrer">{brand.whatsapp.display}</a>
                        <a href={`mailto:${brand.email}`}>{brand.email}</a>
                        <span>{brand.city}</span>
                    </div>
                </div>
            )}
        </>
    );
}
