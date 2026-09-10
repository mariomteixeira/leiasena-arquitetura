"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { brand, copy, pad, sheets, TOTAL } from "./data";
import { CloseIcon, MenuIcon } from "./icons";

export default function Nav() {
    const [past, setPast] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("home");

    useEffect(() => {
        const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.62);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const els = copy.sections
            .map((s) => document.getElementById(s.id))
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

    return (
        <>
            <nav className={`pr-nav pr-mono${past ? " is-on" : ""}`} aria-label="Seções">
                {copy.sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "location" : undefined}>
                        {s.label}
                    </a>
                ))}
            </nav>

            <button
                type="button"
                className="pr-burger"
                aria-expanded={open}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                onClick={() => setOpen((v) => !v)}
            >
                {open ? <CloseIcon /> : <MenuIcon />}
            </button>

            {open && (
                <div className="pr-menu" role="dialog" aria-modal="true" aria-label="Menu">
                    <div className="pr-menu-in">
                        <span className="pr-mono">Índice · {pad(TOTAL)} pranchas</span>
                        <ol>
                            {sheets.map((s, i) => (
                                <li key={s.id}>
                                    <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                                        <span className="pr-mono">{pad(i + 1)}</span>
                                        <span>
                                            <span className="pr-menu-name">{copy.sections[i].label}</span>
                                            <span className="pr-mono" style={{ display: "block", marginTop: 6 }}>
                                                {s.name}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ol>
                        <div className="pr-menu-foot">
                            <a className="pr-btn pr-btn-fill" href={brand.whatsapp.href} target="_blank" rel="noreferrer">
                                WhatsApp {brand.whatsapp.display}
                            </a>
                            <Image
                                src={brand.logos.horizontalNeg1}
                                alt={brand.name}
                                width={128}
                                height={32}
                                style={{ height: 22, width: "auto" }}
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
