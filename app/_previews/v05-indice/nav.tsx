"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { brand, copy } from "../_shared/content";
import { ArrowIcon, CloseIcon, MenuIcon } from "./icons";

export default function Nav() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("home");

    useEffect(() => {
        const els = copy.sections
            .map((sec) => document.getElementById(sec.id))
            .filter((el): el is HTMLElement => el !== null);
        if (!els.length || !("IntersectionObserver" in window)) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((en) => {
                    if (en.isIntersecting) setActive(en.target.id);
                });
            },
            { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!open) return;
        const html = document.documentElement;
        const prev = html.style.overflow;
        html.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            html.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const logo = (
        <Image src={brand.logos.horizontalNeg1} alt={brand.name} width={120} height={30} />
    );

    return (
        <header className="hdr">
            <div className="hdr-in">
                <a href="#home" className="logo">{logo}</a>
                <nav className="nav" aria-label="Seções">
                    {copy.sections.map((sec) => (
                        <a key={sec.id} href={`#${sec.id}`} aria-current={active === sec.id ? "location" : undefined}>
                            {sec.label}
                        </a>
                    ))}
                </nav>
                <button
                    type="button"
                    className="menu-btn"
                    aria-expanded={open}
                    aria-controls="v05-menu"
                    onClick={() => setOpen(true)}
                >
                    <span>Menu</span>
                    <MenuIcon />
                </button>
            </div>

            {open && (
                <div id="v05-menu" className="ovl" role="dialog" aria-modal="true" aria-label="Menu" data-lenis-prevent>
                    <div className="ovl-top">
                        <a href="#home" className="logo" onClick={() => setOpen(false)}>{logo}</a>
                        <button type="button" className="menu-btn" onClick={() => setOpen(false)}>
                            <span>Fechar</span>
                            <CloseIcon />
                        </button>
                    </div>
                    <ul className="ovl-list">
                        {copy.sections.map((sec, i) => (
                            <li key={sec.id} className="rise" style={{ "--i": i } as CSSProperties}>
                                <a
                                    href={`#${sec.id}`}
                                    aria-current={active === sec.id ? "location" : undefined}
                                    onClick={() => setOpen(false)}
                                >
                                    {sec.label}
                                    <ArrowIcon />
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="ovl-foot">
                        <a href={brand.whatsapp.href} target="_blank" rel="noopener noreferrer">
                            WhatsApp {brand.whatsapp.display}
                        </a>
                        <a href={brand.instagram.href} target="_blank" rel="noopener noreferrer">
                            Instagram {brand.instagram.handle}
                        </a>
                        <span>{brand.city}</span>
                    </div>
                </div>
            )}
        </header>
    );
}
