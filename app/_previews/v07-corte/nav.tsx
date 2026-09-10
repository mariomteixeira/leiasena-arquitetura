"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { brand, copy } from "../_shared/content";
import { Cross, MenuLines } from "./icons";

type Tone = "dark" | "light";

/** Fixed header: logo on a cream tab, mono links; flips to ink over the ice-white sections. Mobile menu opens as a cut. */
export default function Nav() {
    const [open, setOpen] = useState(false);
    const [tone, setTone] = useState<Tone>("dark");
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        document.documentElement.classList.add("js");
        const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));
        let raf = 0;
        const pick = () => {
            raf = 0;
            const y = 30;
            let next: Tone = "dark";
            for (const s of sections) {
                const r = s.getBoundingClientRect();
                if (r.top <= y && r.bottom > y) {
                    next = s.dataset.tone === "light" ? "light" : "dark";
                    break;
                }
            }
            setTone(next);
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(pick);
        };
        pick();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            <header className="c-hdr" data-tone={tone}>
                <a className="c-logo-tab" href="#home" aria-label={`${brand.name} — início`}>
                    <Image src={brand.logos.horizontalNeg1} alt="" width={112} height={28} unoptimized />
                </a>
                <nav className="c-nav c-mono" aria-label="Principal">
                    {copy.sections.map((s) => (
                        <a key={s.id} href={`#${s.id}`}>
                            {s.label}
                        </a>
                    ))}
                </nav>
                <button
                    type="button"
                    className="c-menu-btn c-mono"
                    onClick={() => setOpen(true)}
                    aria-expanded={open}
                    aria-controls="c-menu"
                >
                    Menu
                    <MenuLines />
                </button>
            </header>

            <div id="c-menu" className="c-menu" data-open={open} aria-hidden={!open} role="dialog" aria-label="Menu">
                <div className="c-menu-top">
                    <a className="c-logo-tab" href="#home" onClick={() => setOpen(false)} aria-label={`${brand.name} — início`} tabIndex={open ? 0 : -1}>
                        <Image src={brand.logos.horizontalNeg1} alt="" width={112} height={28} unoptimized />
                    </a>
                    <button ref={closeRef} type="button" className="c-menu-close c-mono" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                        Fechar
                        <Cross />
                    </button>
                </div>
                <nav className="c-menu-links" aria-label="Seções">
                    {copy.sections.map((s) => (
                        <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                            {s.label}
                            <span className="c-mono" aria-hidden="true">
                                {s.id === "home" ? "" : `#${s.id}`}
                            </span>
                        </a>
                    ))}
                </nav>
                <div className="c-menu-foot c-mono">
                    <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                        <span>WhatsApp</span>
                        <span>{brand.whatsapp.display}</span>
                    </a>
                    <a href={`mailto:${brand.email}`} tabIndex={open ? 0 : -1}>
                        <span>E-mail</span>
                        <span>{brand.email}</span>
                    </a>
                    <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                        <span>Instagram</span>
                        <span>{brand.instagram.handle}</span>
                    </a>
                    <span>{brand.city}</span>
                </div>
            </div>
        </>
    );
}
