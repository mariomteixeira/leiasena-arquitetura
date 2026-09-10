"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** Quiet perspective tilt (±max degrees) toward the cursor. Off on touch and reduced motion. */
export default function Tilt({
    children,
    className = "",
    style,
    max = 3,
}: {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    max?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
        const inner = el.firstElementChild as HTMLElement | null;
        if (!inner) return;
        let raf = 0;
        const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 2 - 1;
            const y = ((e.clientY - r.top) / r.height) * 2 - 1;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                inner.style.transform = `rotateX(${(y * max).toFixed(2)}deg) rotateY(${(-x * max).toFixed(2)}deg)`;
            });
        };
        const onLeave = () => {
            cancelAnimationFrame(raf);
            inner.style.transform = "";
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
        };
    }, [max]);
    return (
        <div ref={ref} className={`rv-tilt ${className}`} style={style}>
            <div className="rv-tilt-inner">{children}</div>
        </div>
    );
}
