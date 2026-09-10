"use client";

import { useEffect, useState } from "react";
import { brand, copy } from "../_shared/content";
import { IconClose, IconMenu } from "./icons";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [lifted, setLifted] = useState(false);

    useEffect(() => {
        const onScroll = () => setLifted(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
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

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
                    lifted ? "border-b border-navy/15 bg-cream/92 backdrop-blur-sm" : "border-b border-transparent"
                }`}
            >
                <div className="mx-auto flex h-16 max-w-[86rem] items-center justify-between px-5 sm:h-20 sm:px-8">
                    <a
                        href="#home"
                        className="font-serif text-[1.45rem] italic leading-none tracking-[-0.01em] text-navy sm:text-[1.7rem]"
                    >
                        {brand.shortName}
                    </a>

                    <nav className="hidden items-center gap-9 md:flex" aria-label="Principal">
                        {copy.sections.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="mrq-link text-[0.78rem] font-light uppercase tracking-[0.18em] text-navy/80 hover:text-navy"
                            >
                                {s.label}
                            </a>
                        ))}
                    </nav>

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Abrir menu"
                        aria-expanded={open}
                        className="-mr-1 flex h-10 w-10 items-center justify-center text-navy md:hidden"
                    >
                        <IconMenu className="h-6 w-6" />
                    </button>
                </div>
            </header>

            {open && (
                <div className="mrq-menu fixed inset-0 z-[60] bg-cream md:hidden" role="dialog" aria-modal="true">
                    <div className="flex h-16 items-center justify-between px-5">
                        <span className="font-serif text-[1.45rem] italic leading-none text-navy">{brand.shortName}</span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Fechar menu"
                            className="-mr-1 flex h-10 w-10 items-center justify-center text-navy"
                        >
                            <IconClose className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="flex flex-col px-5 pt-6" aria-label="Principal">
                        {copy.sections.map((s, i) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                onClick={() => setOpen(false)}
                                style={{ ["--d" as string]: `${90 + i * 70}ms` }}
                                className="mrq-menu-item mrq-hair-soft py-5 font-serif text-[2.35rem] leading-none text-navy first:border-t-0"
                            >
                                {s.label}
                            </a>
                        ))}
                    </nav>

                    <div
                        className="mrq-menu-item absolute inset-x-5 bottom-9 flex flex-col gap-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-navy/70"
                        style={{ ["--d" as string]: "420ms" }}
                    >
                        <a href={brand.whatsapp.href} target="_blank" rel="noreferrer" className="mrq-link w-fit">
                            {brand.whatsapp.display}
                        </a>
                        <a href={brand.instagram.href} target="_blank" rel="noreferrer" className="mrq-link w-fit">
                            {brand.instagram.handle}
                        </a>
                        <span>{brand.city}</span>
                    </div>
                </div>
            )}
        </>
    );
}
