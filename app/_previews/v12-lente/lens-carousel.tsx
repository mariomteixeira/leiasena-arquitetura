"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { mixedSelection, type Shot } from "../_shared/gallery";
import Scene from "../_shared/scene";
import { IconArrow, IconArrowLeft } from "./icons";
import LensScene, { REST_FOV, REST_Z } from "./lens-scene";

const AUTOPLAY = 5000;
const r = (ratio: number) => ({ ["--r"]: String(ratio) }) as CSSProperties;

export default function LensCarousel() {
    const shots = useMemo(() => mixedSelection(14), []);
    const total = shots.length;

    const [nav, setNav] = useState({ i: 0, dir: 1 });
    const shot = shots[nav.i];

    const [webgl, setWebgl] = useState<boolean | null>(null);
    const [ready, setReady] = useState(false);
    const [reduced, setReduced] = useState(false);
    const [compact, setCompact] = useState(false);
    const [visible, setVisible] = useState(false);
    const [paused, setPaused] = useState(false);
    const [flatIdx, setFlatIdx] = useState(0);

    const sectionRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const swipe = useRef<{ id: number; x: number; y: number } | null>(null);

    const live = webgl === true && ready;

    const go = useCallback(
        (d: number) => setNav((n) => ({ i: (n.i + d + total) % total, dir: d >= 0 ? 1 : -1 })),
        [total],
    );
    const jump = useCallback((i: number) => setNav((n) => ({ i, dir: i >= n.i ? 1 : -1 })), []);

    /* ------------------------------------------------------------ ambiente */

    useEffect(() => {
        const narrow = window.matchMedia("(max-width: 767px)");
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => {
            setCompact(narrow.matches);
            setReduced(motion.matches);
        };
        sync();
        narrow.addEventListener("change", sync);
        motion.addEventListener("change", sync);
        try {
            const c = document.createElement("canvas");
            setWebgl(Boolean(c.getContext("webgl2") ?? c.getContext("webgl")));
        } catch {
            setWebgl(false);
        }
        return () => {
            narrow.removeEventListener("change", sync);
            motion.removeEventListener("change", sync);
        };
    }, []);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el || !("IntersectionObserver" in window)) {
            setVisible(true);
            return;
        }
        const io = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false), {
            threshold: 0.45,
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* a camada estática congela quando o WebGL assume o comando */
    useEffect(() => {
        if (!live) setFlatIdx(nav.i);
    }, [live, nav.i]);

    /* ------------------------------------------------------------ autoplay */

    useEffect(() => {
        if (reduced || paused || !visible) return;
        const id = window.setInterval(() => setNav((n) => ({ i: (n.i + 1) % total, dir: 1 })), AUTOPLAY);
        return () => window.clearInterval(id);
    }, [reduced, paused, visible, total]);

    /* -------------------------------------------------------------- teclado */

    useEffect(() => {
        if (!visible) return;
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement | null;
            if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
            if (e.key === "ArrowRight") {
                e.preventDefault();
                go(1);
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(-1);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [visible, go]);

    /* a miniatura ativa entra em campo — só a fita rola, nunca a página */
    useEffect(() => {
        const rail = railRef.current;
        const el = rail?.querySelector<HTMLElement>('[data-active="true"]');
        if (!rail || !el) return;
        const left = el.offsetLeft - rail.clientWidth / 2 + el.offsetWidth / 2;
        rail.scrollTo({ left: Math.max(0, left), behavior: reduced ? "auto" : "smooth" });
    }, [nav.i, reduced]);

    /* --------------------------------------------------------------- toque */

    function onDown(e: ReactPointerEvent<HTMLDivElement>) {
        swipe.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    }
    function onUp(e: ReactPointerEvent<HTMLDivElement>) {
        const s = swipe.current;
        swipe.current = null;
        if (!s || s.id !== e.pointerId) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
    }

    const onReady = useCallback(() => setReady(true), []);
    const onLost = useCallback(() => setReady(false), []);

    const flat = shots[flatIdx];

    return (
        <div
            ref={sectionRef}
            className="mt-12 sm:mt-16"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
        >
            {/* ---------------------------------------------------- controles */}
            <div className="ln-hair-b flex flex-wrap items-end justify-between gap-x-8 gap-y-5 pb-4">
                <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[0.78rem] uppercase tracking-[0.22em] text-navy">
                        {shot.project}
                    </span>
                    <span className="font-mono text-[0.7rem] tracking-[0.18em] text-navy/60">
                        {String(nav.i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </span>
                </div>

                <div className="flex items-center gap-5">
                    <Link
                        href={`/projetos/${shot.slug}`}
                        className="ln-link group inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-navy/80 hover:text-navy"
                    >
                        Ver projeto
                        <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => go(-1)} aria-label="Imagem anterior" className="ln-nav">
                            <IconArrowLeft className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => go(1)} aria-label="Próxima imagem" className="ln-nav">
                            <IconArrow className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --------------------------------------------------------- palco */}
            <div
                className="ln-stage mx-auto mt-6 max-w-[74rem]"
                onPointerDown={onDown}
                onPointerUp={onUp}
                onPointerCancel={onUp}
            >
                <div className="ln-flat" data-live={live} aria-hidden={live}>
                    <FlatCard shot={flat} live={live} />
                </div>

                {webgl === true && (
                    <div className="ln-canvas" aria-hidden="true">
                        <Scene
                            className="h-full w-full"
                            camera={{ position: [0, 0, REST_Z], fov: REST_FOV, near: 0.1, far: 60 }}
                            frameloop={reduced || !visible ? "demand" : "always"}
                            onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", onLost)}
                        >
                            <LensScene
                                shots={shots}
                                index={nav.i}
                                dir={nav.dir}
                                reduced={reduced}
                                compact={compact}
                                onReady={onReady}
                            />
                        </Scene>
                    </div>
                )}
            </div>

            <p aria-live="polite" className="sr-only">
                {shot.project} — imagem {nav.i + 1} de {total}
            </p>

            {/* ------------------------------------------------------ índice */}
            <div ref={railRef} className="ln-rail -mx-5 mt-7 px-5 sm:mx-0 sm:px-0">
                {shots.map((s, i) => (
                    <button
                        key={s.src}
                        type="button"
                        className="ln-thumb"
                        data-active={i === nav.i}
                        aria-current={i === nav.i}
                        aria-label={`${s.project}, imagem ${i + 1} de ${total}`}
                        onClick={() => jump(i)}
                    >
                        <span className="ln-thumb-box" style={r(s.ratio)}>
                            <Image src={s.src} alt="" fill sizes="120px" className="object-cover" />
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------------ */

/** Mesmo enquadramento sem WebGL: a foto na proporção nativa, crossfade simples. */
function FlatCard({ shot, live }: { shot: Shot; live: boolean }) {
    const [pair, setPair] = useState<{ a: Shot; b: Shot; k: number }>({ a: shot, b: shot, k: 0 });

    useEffect(() => {
        setPair((p) => (p.b.src === shot.src ? p : { a: p.b, b: shot, k: p.k + 1 }));
    }, [shot]);

    const sizes = "(max-width: 767px) 92vw, 60vw";

    return (
        <div className="ln-flat-card" style={r(pair.b.ratio)}>
            {pair.k > 0 && pair.a.src !== pair.b.src && (
                <Image
                    key={`a${pair.k}`}
                    src={pair.a.src}
                    alt=""
                    fill
                    sizes={sizes}
                    className="ln-flat-out object-cover"
                />
            )}
            <Image
                key={`b${pair.k}`}
                src={pair.b.src}
                alt={`Projeto ${pair.b.project}`}
                fill
                sizes={sizes}
                priority={!live && pair.k === 0}
                className={`${pair.k > 0 ? "ln-flat-in" : ""} object-cover`}
            />
        </div>
    );
}
