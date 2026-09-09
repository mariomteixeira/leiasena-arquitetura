"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Adds `is-inview` to the element once it enters the viewport (once).
 * Pair with the `.reveal` class from app/preview/preview.css or your own CSS.
 * Default state must stay readable when JS is off (the CSS only hides under `.js`).
 */
export default function Reveal({
    children,
    className = "",
    style,
    as = "div",
    threshold = 0.2,
}: {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    as?: "div" | "section" | "li" | "article" | "figure" | "span";
    threshold?: number;
}) {
    const ref = useRef<HTMLElement | null>(null);
    useEffect(() => {
        document.documentElement.classList.add("js");
        const el = ref.current;
        if (!el) return;
        if (!("IntersectionObserver" in window)) {
            el.classList.add("is-inview");
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        el.classList.add("is-inview");
                        io.disconnect();
                    }
                });
            },
            { threshold },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);
    return createElement(as, { ref, className, style }, children);
}
