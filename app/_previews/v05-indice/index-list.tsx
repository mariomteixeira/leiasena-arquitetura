"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent as ReactPointerEvent } from "react";
import type { Project } from "../_shared/content";
import { ArrowIcon } from "./icons";

const W = 420;
const H = 260;
const MARGIN = 16;
const OFF_X = 28;
const OFF_Y = -H / 2;
const MAX_TILT = 10;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface State {
    tx: number; ty: number;
    x: number; y: number;
    rx: number; ry: number;
    op: number;
    visible: boolean;
    raf: number;
    enabled: boolean;
    reduced: boolean;
}

/**
 * The index: four project names as a list. On hover devices a 420×260 cover
 * follows the cursor with lerp + a tilt derived from the lag between the cursor
 * and the image (±10°). Single rAF loop; it stops whenever the image is settled
 * (hidden, or visible and at rest) and restarts on pointer movement.
 */
export default function IndexList({ projects }: { projects: Project[] }) {
    const [active, setActive] = useState<number>(0);
    const pvRef = useRef<HTMLDivElement>(null);
    const s = useRef<State>({ tx: 0, ty: 0, x: 0, y: 0, rx: 0, ry: 0, op: 0, visible: false, raf: 0, enabled: false, reduced: false });

    function tick() {
        const st = s.current;
        const el = pvRef.current;
        if (!el) { st.raf = 0; return; }

        const k = st.reduced ? 1 : 0.13;
        const dx = st.tx - st.x;
        const dy = st.ty - st.y;
        st.x += dx * k;
        st.y += dy * k;

        // tilt from the lag between cursor and image: horizontal lag turns around Y, vertical around X
        const tRy = st.reduced ? 0 : clamp(dx * 0.1, -MAX_TILT, MAX_TILT);
        const tRx = st.reduced ? 0 : clamp(-dy * 0.1, -MAX_TILT, MAX_TILT);
        st.ry += (tRy - st.ry) * 0.16;
        st.rx += (tRx - st.rx) * 0.16;

        const to = st.visible ? 1 : 0;
        st.op += (to - st.op) * (st.reduced ? 1 : 0.15);
        const sc = 0.94 + 0.06 * st.op;

        el.style.transform = `translate3d(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px, 0) perspective(900px) rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        el.style.opacity = st.op.toFixed(3);

        const settled =
            Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2 &&
            Math.abs(st.ry - tRy) < 0.05 && Math.abs(st.rx - tRx) < 0.05 &&
            Math.abs(to - st.op) < 0.004;
        if (settled) {
            st.op = to;
            el.style.opacity = String(to);
            st.raf = 0;
            return;
        }
        st.raf = requestAnimationFrame(tick);
    }

    function run() {
        const st = s.current;
        if (!st.raf) st.raf = requestAnimationFrame(tick);
    }

    function hide() {
        const st = s.current;
        st.visible = false;
        run();
    }

    function setTarget(clientX: number, clientY: number) {
        const st = s.current;
        st.tx = clamp(clientX + OFF_X, MARGIN, window.innerWidth - W - MARGIN);
        st.ty = clamp(clientY + OFF_Y, MARGIN, window.innerHeight - H - MARGIN);
    }

    function show(i: number) {
        const st = s.current;
        setActive(i);
        if (!st.visible && st.op < 0.05) {
            st.x = st.tx;
            st.y = st.ty;
            st.rx = 0;
            st.ry = 0;
        }
        st.visible = true;
        run();
    }

    function onEnterRow(i: number, e: ReactPointerEvent<HTMLAnchorElement>) {
        const st = s.current;
        if (!st.enabled || e.pointerType === "touch") return;
        setTarget(e.clientX, e.clientY);
        show(i);
    }

    function onMove(e: ReactPointerEvent<HTMLDivElement>) {
        const st = s.current;
        if (!st.enabled || !st.visible || e.pointerType === "touch") return;
        setTarget(e.clientX, e.clientY);
        run();
    }

    function onLeaveList(e: ReactPointerEvent<HTMLDivElement>) {
        const st = s.current;
        if (!st.enabled || e.pointerType === "touch") return;
        hide();
    }

    function onFocusRow(i: number, e: FocusEvent<HTMLAnchorElement>) {
        const st = s.current;
        if (!st.enabled) return;
        const r = e.currentTarget.getBoundingClientRect();
        setTarget(r.right - W - OFF_X, r.bottom + 12 - OFF_Y);
        show(i);
    }

    useEffect(() => {
        const st = s.current;
        const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
        const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => {
            st.enabled = mqHover.matches;
            st.reduced = mqReduce.matches;
            if (!st.enabled) hide();
        };
        sync();
        const onVis = () => { if (document.hidden) hide(); };
        mqHover.addEventListener("change", sync);
        mqReduce.addEventListener("change", sync);
        document.addEventListener("visibilitychange", onVis);
        return () => {
            mqHover.removeEventListener("change", sync);
            mqReduce.removeEventListener("change", sync);
            document.removeEventListener("visibilitychange", onVis);
            if (st.raf) cancelAnimationFrame(st.raf);
            st.raf = 0;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="idx-wrap" onPointerMove={onMove} onPointerLeave={onLeaveList}>
            <ol className="idx">
                {projects.map((p, i) => (
                    <li key={p.slug} className="rise" style={{ "--i": i + 2 } as CSSProperties}>
                        <Link
                            href={`/projetos/${p.slug}`}
                            onPointerEnter={(e) => onEnterRow(i, e)}
                            onFocus={(e) => onFocusRow(i, e)}
                            onBlur={hide}
                        >
                            <span className="tw">
                                <span className="t">{p.title}</span>
                                <span className="m">Ver projeto <ArrowIcon /></span>
                            </span>
                            <span className="thumb">
                                <Image src={p.cover} alt="" fill sizes="96px" />
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>

            <div ref={pvRef} className="pv" aria-hidden="true">
                {projects.map((p, i) => (
                    <div key={p.slug} className={`pv-img${active === i ? " on" : ""}`}>
                        <Image src={p.cover} alt="" fill sizes={`${W}px`} />
                    </div>
                ))}
            </div>
        </div>
    );
}
