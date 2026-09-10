"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { brand, copy } from "../_shared/content";

function Symbol() {
    return <Image src={brand.logos.symbolNeg1} alt="" width={25} height={28} />;
}

export default function Header() {
    const [solid, setSolid] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let raf = 0;
        const check = () => {
            raf = 0;
            const hero = document.getElementById("home");
            const limit = (hero?.offsetHeight ?? window.innerHeight) - 72;
            setSolid(window.scrollY > limit);
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(check);
        };
        check();
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
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <>
            <header className={`g-header${solid ? " is-solid" : ""}`}>
                <a href="#home" className="g-brand" aria-label={brand.name}>
                    <Symbol />
                    <span className="g-brand__name">{brand.shortName}</span>
                </a>
                <nav className="g-nav" aria-label="Seções">
                    {copy.sections.map((s) => (
                        <a key={s.id} href={`#${s.id}`}>
                            {s.label}
                        </a>
                    ))}
                </nav>
                <button
                    type="button"
                    className="g-menubtn"
                    aria-expanded={open}
                    aria-controls="g-menu"
                    aria-label="Abrir menu"
                    onClick={() => setOpen(true)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                </button>
            </header>

            {open && (
                <div id="g-menu" className="g-menu" role="dialog" aria-modal="true" aria-label="Menu">
                    <div className="g-menu__top">
                        <span className="g-brand">
                            <Symbol />
                            <span className="g-brand__name is-on">{brand.shortName}</span>
                        </span>
                        <button type="button" className="g-menubtn" aria-label="Fechar menu" onClick={() => setOpen(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                                <path d="M5 5l14 14M19 5L5 19" />
                            </svg>
                        </button>
                    </div>
                    <nav className="g-menu__links" aria-label="Seções">
                        {copy.sections.map((s) => (
                            <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)}>
                                {s.label}
                            </a>
                        ))}
                    </nav>
                    <div className="g-menu__foot">
                        <a href={brand.whatsapp.href} target="_blank" rel="noreferrer">
                            {brand.whatsapp.display}
                        </a>
                        <a href={brand.instagram.href} target="_blank" rel="noreferrer">
                            {brand.instagram.handle}
                        </a>
                        <span>{brand.city}</span>
                    </div>
                </div>
            )}
        </>
    );
}
