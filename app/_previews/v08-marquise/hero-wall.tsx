"use client";

import Image from "next/image";
import { Suspense, useCallback, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Scene from "../_shared/scene";
import ArcWall, { type WallInput } from "./arc-wall";
import { PANELS, SPIN_LIMIT, WALL, clamp } from "./wall-config";

export default function HeroWall() {
    const [compact, setCompact] = useState(false);
    const [reduced, setReduced] = useState(false);
    const [ready, setReady] = useState(false);
    const [dragging, setDragging] = useState(false);
    const input = useRef<WallInput>({ pointer: 0, drag: 0 });
    const drag = useRef<{ id: number; x: number; base: number } | null>(null);

    useLayoutEffect(() => {
        const narrow = window.matchMedia("(max-width: 767px)");
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => {
            setCompact(narrow.matches);
            setReduced(motion.matches);
        };
        sync();
        narrow.addEventListener("change", sync);
        motion.addEventListener("change", sync);
        return () => {
            narrow.removeEventListener("change", sync);
            motion.removeEventListener("change", sync);
        };
    }, []);

    const onReady = useCallback(() => setReady(true), []);

    function onMove(e: ReactPointerEvent<HTMLDivElement>) {
        const box = e.currentTarget.getBoundingClientRect();
        input.current.pointer = clamp(((e.clientX - box.left) / box.width) * 2 - 1, -1, 1);
        const d = drag.current;
        if (d && d.id === e.pointerId) {
            input.current.drag = clamp(d.base + (e.clientX - d.x) * 0.0035, -SPIN_LIMIT, SPIN_LIMIT);
        }
    }

    function onDown(e: ReactPointerEvent<HTMLDivElement>) {
        drag.current = { id: e.pointerId, x: e.clientX, base: input.current.drag };
        setDragging(true);
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }

    function onUp(e: ReactPointerEvent<HTMLDivElement>) {
        if (drag.current?.id === e.pointerId) drag.current = null;
        setDragging(false);
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }

    function onLeave() {
        input.current.pointer = 0;
    }

    const spec = compact ? WALL.mobile : WALL.desktop;

    return (
        <div
            className="mrq-stage relative h-full w-full select-none"
            data-dragging={dragging}
            onPointerMove={onMove}
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={onLeave}
        >
            <div className={`mrq-fade absolute inset-0 ${ready ? "opacity-0" : "opacity-100"}`}>
                <div className="flex h-full w-full items-end justify-center gap-3 px-4 pb-[7%] sm:gap-6">
                    {PANELS.map((p, i) => (
                        <div
                            key={p.slug}
                            className={`relative h-[62%] w-[42%] sm:h-[70%] sm:w-[21%] ${i > 1 ? "hidden sm:block" : ""}`}
                        >
                            <div className="mrq-arch relative h-full w-full bg-ice-white">
                                <Image
                                    src={p.src}
                                    alt={`Projeto ${p.title}`}
                                    fill
                                    sizes="(max-width: 767px) 45vw, 24vw"
                                    className="object-cover"
                                    priority={i === 0}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute inset-0" aria-hidden="true">
                <Scene
                    key={compact ? "compact" : "wide"}
                    className="h-full w-full"
                    camera={{ position: [0, 0, spec.camZ], fov: spec.fov }}
                >
                    <Suspense fallback={null}>
                        <ArcWall compact={compact} reduced={reduced} input={input} onReady={onReady} />
                    </Suspense>
                </Scene>
            </div>
        </div>
    );
}
