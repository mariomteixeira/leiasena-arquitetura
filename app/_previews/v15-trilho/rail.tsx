"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Suspense,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { NoToneMapping } from "three";
import { projects } from "../_shared/content";
import Scene from "../_shared/scene";
import { IconArrow } from "./icons";
import { RAIL, clamp, layout, nearestStation, twoDigits } from "./rail-config";
import RailScene, { type RailDrive } from "./rail-scene";

/** estação de partida */
const START = 2;

function hasWebGL() {
    try {
        const c = document.createElement("canvas");
        return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
    } catch {
        return false;
    }
}

export default function Rail() {
    const [compact, setCompact] = useState(false);
    const [reduced, setReduced] = useState(false);
    const [webgl, setWebgl] = useState(false);
    const [ready, setReady] = useState(false);
    const [dragging, setDragging] = useState(false);

    const spec = compact ? RAIL.mobile : RAIL.desktop;
    const stations = useMemo(() => layout(spec), [spec]);
    const count = stations.length;

    // arranca na terceira estação: assim a fita já sangra dos dois lados em repouso
    const [target, setTarget] = useState({ i: START, v: 0 });
    const [display, setDisplay] = useState(START);

    const drive = useRef<RailDrive>({
        s: stations[START].s,
        dragging: false,
        dragS: stations[START].s,
        invalidate: null,
    });
    const drag = useRef<{ id: number; x: number; base: number; lastX: number; lastT: number; v: number } | null>(null);

    const minS = stations[0].s;
    const maxS = stations[count - 1].s;
    const perPixel = useMemo(
        () => (maxS - minS) / (count - 1) / (compact ? 150 : 300),
        [maxS, minS, count, compact],
    );

    useLayoutEffect(() => {
        const narrow = window.matchMedia("(max-width: 767px)");
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => {
            setCompact(narrow.matches);
            setReduced(motion.matches);
        };
        sync();
        setWebgl(hasWebGL());
        narrow.addEventListener("change", sync);
        motion.addEventListener("change", sync);
        return () => {
            narrow.removeEventListener("change", sync);
            motion.removeEventListener("change", sync);
        };
    }, []);

    const live = webgl && ready;

    const goTo = useCallback(
        (i: number) => {
            const next = clamp(Math.round(i), 0, count - 1);
            setTarget((t) => ({ i: next, v: t.v + 1 }));
            if (!live) setDisplay(next);
        },
        [count, live],
    );

    const onS = useCallback((f: number) => {
        const n = Math.round(f);
        setDisplay((prev) => (prev === n ? prev : n));
    }, []);

    const onReady = useCallback(() => setReady(true), []);

    /* ------------------------------------------------------------ arraste */

    function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
        if (e.button !== undefined && e.button !== 0) return;
        const base = live ? drive.current.s : stations[target.i].s;
        drag.current = { id: e.pointerId, x: e.clientX, base, lastX: e.clientX, lastT: performance.now(), v: 0 };
        drive.current.dragging = true;
        drive.current.dragS = base;
        setDragging(true);
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const s = clamp(d.base - (e.clientX - d.x) * perPixel, minS, maxS);
        drive.current.dragS = s;
        const now = performance.now();
        const dt = now - d.lastT;
        if (dt > 8) {
            d.v = (e.clientX - d.lastX) / dt;
            d.lastX = e.clientX;
            d.lastT = now;
        }
        drive.current.invalidate?.();
        if (!live) {
            const n = nearestStation(stations, s);
            setDisplay((prev) => (prev === n ? prev : n));
        }
    }

    function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        drag.current = null;
        // inércia: o impulso projeta a posição para diante, depois assenta na estação
        const projected = clamp(drive.current.dragS - d.v * perPixel * 110, minS, maxS);
        const next = nearestStation(stations, projected);
        drive.current.dragging = false;
        setDragging(false);
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        setTarget((t) => ({ i: next, v: t.v + 1 }));
        if (!live) setDisplay(next);
        drive.current.invalidate?.();
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(target.i + 1);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(target.i - 1);
        } else if (e.key === "Home") {
            e.preventDefault();
            goTo(0);
        } else if (e.key === "End") {
            e.preventDefault();
            goTo(count - 1);
        }
    }

    /* mantém o alvo dentro dos limites se o layout mudar de desktop para mobile */
    useEffect(() => {
        setTarget((t) => (t.i < count ? t : { i: count - 1, v: t.v + 1 }));
    }, [count]);

    const active = stations[display] ?? stations[0];
    const windowStart = clamp(display - 1, 0, Math.max(0, count - (compact ? 2 : 3)));
    const windowShots = stations.slice(windowStart, windowStart + (compact ? 2 : 3));

    return (
        <div>
            {/* ------------------------------------------------ contador e passos */}
            <div className="mt-10 flex items-end justify-between gap-6 sm:mt-14">
                <div className="flex items-center gap-5">
                    <p aria-live="polite" className="font-mono text-[0.8rem] tracking-[0.18em] text-navy tabular-nums">
                        {twoDigits(display + 1)}
                        <span className="text-navy/45"> / {twoDigits(count)}</span>
                    </p>
                    <div className="hidden items-center gap-[0.3rem] sm:flex" aria-hidden="true">
                        {stations.map((st, i) => (
                            <span key={`${st.shot.src}-tick`} className="tr-tick" data-on={i === display} />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="tr-step"
                        onClick={() => goTo(target.i - 1)}
                        disabled={target.i <= 0}
                        aria-label="Imagem anterior"
                    >
                        <IconArrow className="h-4 w-4 rotate-180" />
                    </button>
                    <button
                        type="button"
                        className="tr-step"
                        onClick={() => goTo(target.i + 1)}
                        disabled={target.i >= count - 1}
                        aria-label="Próxima imagem"
                    >
                        <IconArrow className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* -------------------------------------------------------- o trilho */}
            <div
                className="tr-stage mt-6 overflow-hidden sm:mt-8"
                data-dragging={dragging}
                role="group"
                aria-label={`Trilho de projetos, imagem ${display + 1} de ${count}`}
                tabIndex={0}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
            >
                {/* fallback estático: vale antes do mount e quando não há WebGL */}
                <div
                    className={`tr-fade absolute inset-0 flex items-end justify-center gap-4 overflow-hidden pb-7 sm:gap-6 sm:pb-9 ${
                        live ? "opacity-0" : "opacity-100"
                    }`}
                    inert={live ? true : undefined}
                >
                    {windowShots.map((st, i) => {
                        const isActive = windowStart + i === display;
                        return (
                            <Link
                                key={`${st.shot.src}-fb`}
                                href={`/projetos/${st.shot.slug}`}
                                className="tr-card block shrink-0"
                                style={{ height: isActive ? "80%" : "58%" }}
                                aria-label={`Projeto ${st.shot.project}`}
                            >
                                <div
                                    className="tr-round tr-zoom relative h-full bg-ice-white"
                                    style={{ aspectRatio: String(st.shot.ratio) }}
                                >
                                    <Image
                                        src={st.shot.src}
                                        alt={`Projeto ${st.shot.project}`}
                                        fill
                                        sizes="(max-width: 767px) 60vw, 34vw"
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {webgl && (
                    <div className="absolute inset-0" aria-hidden="true">
                        <Scene
                            key={compact ? "compact" : "wide"}
                            className="h-full w-full"
                            camera={{ position: [0, spec.camY, spec.radius * 0.4], fov: spec.fov }}
                            dpr={compact ? [1, 1.25] : [1, 1.5]}
                            gl={{
                                antialias: true,
                                alpha: true,
                                powerPreference: "high-performance",
                                // sem ACES: o piso creme tem de bater certo com o creme da página
                                toneMapping: NoToneMapping,
                            }}
                        >
                            <Suspense fallback={null}>
                                <RailScene
                                    stations={stations}
                                    spec={spec}
                                    index={target.i}
                                    reduced={reduced}
                                    drive={drive}
                                    onS={onS}
                                    onReady={onReady}
                                />
                            </Suspense>
                        </Scene>
                    </div>
                )}
            </div>

            {/* ------------------------------------------------ legenda do ativo */}
            <div className="tr-hair mt-7 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pt-6 sm:mt-9">
                <h3 className="font-serif text-[2rem] leading-none tracking-[-0.02em] sm:text-[2.6rem]">
                    {active.shot.project}
                </h3>
                <Link
                    href={`/projetos/${active.shot.slug}`}
                    className="tr-link group inline-flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-navy/75 hover:text-navy"
                >
                    Ver projeto
                    <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
            </div>

            {/* --------------------------------------------- os quatro projetos */}
            <ul className="tr-hair-b mt-12 grid grid-cols-2 sm:mt-16 sm:grid-cols-4">
                {projects.map((p) => (
                    <li key={p.slug} className="tr-hair">
                        <Link
                            href={`/projetos/${p.slug}`}
                            className="tr-link inline-flex py-4 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-navy/80 hover:text-navy"
                        >
                            {p.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
