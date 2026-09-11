"use client";

/**
 * A fita: uma tira horizontal de cards que sangra pelas duas bordas da tela.
 * Os cards sao verticais 9:16, todos do mesmo tamanho em repouso — e o formato
 * em que as imagens dos projetos vao ser produzidas. Conforme um card se
 * aproxima do centro horizontal da janela ele cresce ate ~1,25x e os vizinhos
 * encolhem; ao mesmo tempo cada card ganha um rotateY proporcional a distancia
 * com sinal e um translateZ, de modo que a tira le como um arco raso
 * envolvendo quem olha. Um unico loop de rAF, que so roda enquanto a tira esta
 * na tela e em movimento.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { mixedSelection } from "../../_lib/gallery";

const SHOTS = mixedSelection(15);

const ROT_DEG = 22;
const TZ_NEAR = 62;
const TZ_FAR = -16;
const PERSP = 1400;
const YAW_MAX = 2.6;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/**
 * Cada card tem o seu jeito de viajar: um tamanho, um recorte (que muda o
 * formato da moldura), uma altura e uma inclinacao proprios. Sao valores
 * fixos por posicao — nada sorteado a cada render — e todos os quatro sao
 * entregues ao padrao conforme o card chega ao centro. No centro: altura
 * cheia da faixa, 9:16, reto e centrado.
 */
interface Trait {
    /** escala em repouso, fora do centro */
    k: number;
    /** recorte de topo e base, em fracao da altura da caixa */
    clip: number;
    /** deslocamento vertical em repouso, em fracao da altura da faixa */
    y: number;
    /** rolagem em repouso, em graus */
    tilt: number;
}

function traitsFor(i: number): Trait {
    const h = (seed: number) => {
        const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
        return x - Math.floor(x);
    };
    return {
        k: 0.56 + h(1) * 0.26,
        clip: 0.015 + h(2) * 0.125,
        y: (h(3) - 0.5) * 0.19,
        tilt: (h(4) - 0.5) * 5.4,
    };
}

const TRAITS: Trait[] = SHOTS.map((_, i) => traitsFor(i));

export default function Ribbon() {
    const stripRef = useRef<HTMLDivElement | null>(null);
    const yawRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const railRef = useRef<HTMLDivElement | null>(null);
    const thumbRef = useRef<HTMLDivElement | null>(null);
    const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        if (!stripRef.current || !yawRef.current || !trackRef.current || !railRef.current || !thumbRef.current) {
            return;
        }
        const strip: HTMLDivElement = stripRef.current;
        const yawEl: HTMLDivElement = yawRef.current;
        const track: HTMLDivElement = trackRef.current;
        const rail: HTMLDivElement = railRef.current;
        const thumb: HTMLDivElement = thumbRef.current;

        const cards = cardsRef.current.filter(Boolean) as HTMLAnchorElement[];
        const n = cards.length;
        if (!n) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const rotMax = reduced ? 0 : (ROT_DEG * Math.PI) / 180;
        const tzNear = reduced ? 0 : TZ_NEAR;
        const tzFar = reduced ? 0 : TZ_FAR;
        /** Com movimento reduzido a fita fica uniforme: todo card no padrao. */
        const traits: Trait[] = reduced
            ? TRAITS.map(() => ({ k: 1, clip: 0, y: 0, tilt: 0 }))
            : TRAITS;

        const restW = new Float64Array(n);
        const restC = new Float64Array(n);
        const sArr = new Float64Array(n).fill(1);
        const aArr = new Float64Array(n);
        const cArr = new Float64Array(n);
        const psArr = new Float64Array(n).fill(1);
        const paArr = new Float64Array(n);
        const pcArr = new Float64Array(n);
        const lastS = new Float64Array(n).fill(-1);
        const lastClip = new Float64Array(n).fill(-1);

        let bandH = 1;
        let vw = 1;
        let gap = 0;
        let bleed = 0;
        let radius = 480;
        let radiusRot = 960;
        let trackW = 1;
        let minOff = 0;
        let maxOff = 0;

        let offset = 0;
        let goal = 0;
        let vel = 0;
        let yaw = 0;
        let mode: "idle" | "drag" | "free" | "snap" = "idle";
        let raf = 0;
        let visible = false;
        let ready = false;
        let dragDelta = 0;
        let activeIndex = 0;

        /** Resolve escalas, angulos e centros para um dado deslocamento. */
        function solve(off: number, S: Float64Array, A: Float64Array, C: Float64Array) {
            const focus = off + bleed + vw / 2;
            let acc = 0;
            for (let i = 0; i < n; i++) {
                const w = restW[i];
                let s = S[i];
                let a = A[i];
                let mag = 1;
                const kRest = traits[i].k;
                for (let k = 0; k < 3; k++) {
                    const d = acc + (s * w * Math.cos(a) * mag) / 2 - focus;
                    const p = clamp(1 - Math.abs(d) / radius, 0, 1);
                    const e = p * p * (3 - 2 * p);
                    s = kRest + (1 - kRest) * e;
                    a = clamp(d / radiusRot, -1, 1) * rotMax;
                    mag = PERSP / (PERSP - (tzFar + (tzNear - tzFar) * e));
                }
                const adv = s * w * Math.cos(a) * mag;
                S[i] = s;
                A[i] = a;
                C[i] = acc + adv / 2;
                acc += adv + gap;
            }
            return acc - gap;
        }

        function paint() {
            trackW = solve(offset, sArr, aArr, cArr);
            const focus = offset + bleed + vw / 2;
            for (let i = 0; i < n; i++) {
                const p = clamp(1 - Math.abs(cArr[i] - focus) / radius, 0, 1);
                const e = p * p * (3 - 2 * p);
                // `rest` e o quanto o card ainda guarda do jeito dele; no
                // centro vale 0 e os quatro tracos somem de uma vez.
                const rest = 1 - e;
                const t = traits[i];
                const tz = tzFar + (tzNear - tzFar) * e;
                const dx = cArr[i] - offset - restC[i];
                const dy = t.y * rest * bandH;
                const deg = (aArr[i] * 180) / Math.PI;
                const roll = t.tilt * rest;
                const el = cards[i];
                el.style.transform =
                    "translate3d(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px," + tz.toFixed(2) + "px)" +
                    " rotateY(" + deg.toFixed(3) + "deg)" +
                    " rotateZ(" + roll.toFixed(3) + "deg)" +
                    " scale(" + sArr[i].toFixed(4) + ")";
                const q = Math.round(sArr[i] * 1000) / 1000;
                if (q !== lastS[i]) {
                    el.style.setProperty("--s", String(q));
                    lastS[i] = q;
                }
                const c = Math.round(t.clip * rest * 10000) / 10000;
                if (c !== lastClip[i]) {
                    el.style.setProperty("--clip", String(c));
                    lastClip[i] = c;
                }
            }

            minOff = 0;
            maxOff = Math.max(0, trackW - vw - bleed * 1.5);

            const railW = rail.clientWidth;
            const tw = clamp((vw / trackW) * railW, 32, railW);
            const x = (maxOff > 0 ? clamp(offset / maxOff, 0, 1) : 0) * (railW - tw);
            thumb.style.width = tw.toFixed(1) + "px";
            thumb.style.transform = "translateX(" + x.toFixed(1) + "px)";

            yawEl.style.setProperty("--ft-yaw", yaw.toFixed(3) + "deg");
        }

        function frame() {
            raf = 0;
            if (mode === "snap") {
                const d = goal - offset;
                if (reduced || Math.abs(d) < 0.5) {
                    offset = goal;
                    mode = "idle";
                } else {
                    offset += d * 0.2;
                }
            } else if (mode === "free") {
                offset += vel;
                vel *= 0.925;
                if (Math.abs(vel) < 0.15) {
                    vel = 0;
                    mode = "idle";
                }
            } else if (mode === "drag") {
                vel = vel * 0.62 + dragDelta * 0.38;
                dragDelta = 0;
            }

            if (offset < minOff) {
                offset = minOff;
                if (mode === "free") mode = "idle";
                vel = 0;
            } else if (offset > maxOff) {
                offset = maxOff;
                if (mode === "free") mode = "idle";
                vel = 0;
            }
            if (goal < minOff) goal = minOff;
            if (goal > maxOff) goal = maxOff;

            const yawGoal = reduced || mode === "idle" ? 0 : clamp(-vel * 0.07, -YAW_MAX, YAW_MAX);
            yaw += (yawGoal - yaw) * 0.12;
            if (Math.abs(yaw) < 0.004) yaw = 0;

            paint();
            if (mode === "idle") activeIndex = nearest();

            if (visible && (mode !== "idle" || yaw !== 0)) raf = requestAnimationFrame(frame);
        }

        function kick() {
            if (!raf && visible && ready) raf = requestAnimationFrame(frame);
        }

        function measure() {
            vw = strip.clientWidth || 1;
            const cs = getComputedStyle(track);
            gap = parseFloat(cs.columnGap) || 0;
            bleed = Math.abs(parseFloat(cs.marginLeft) || 0);
            const base = cards[0].offsetLeft;
            bandH = cards[0].offsetHeight || 1;
            let sum = 0;
            for (let i = 0; i < n; i++) {
                restW[i] = cards[i].offsetWidth;
                restC[i] = cards[i].offsetLeft - base + restW[i] / 2;
                sum += restW[i];
            }
            const avg = sum / n || 1;
            radius = avg * 1.15;
            radiusRot = Math.max(vw * 0.85, avg * 2.6);
            ready = true;
            paint();
        }

        /** Deslocamento que coloca o card j no centro (ponto fixo em 6 passos). */
        function offsetFor(j: number) {
            psArr.set(sArr);
            paArr.set(aArr);
            let off = offset;
            for (let k = 0; k < 6; k++) {
                const total = solve(off, psArr, paArr, pcArr);
                const hi = Math.max(0, total - vw - bleed * 1.5);
                off = clamp(off + (pcArr[j] - bleed - off - vw / 2), 0, hi);
            }
            return off;
        }

        function goTo(j: number) {
            activeIndex = clamp(j, 0, n - 1);
            goal = offsetFor(activeIndex);
            mode = "snap";
            kick();
        }

        function nearest() {
            const focus = offset + bleed + vw / 2;
            let best = 0;
            let bd = Infinity;
            for (let i = 0; i < n; i++) {
                const d = Math.abs(cArr[i] - focus);
                if (d < bd) {
                    bd = d;
                    best = i;
                }
            }
            return best;
        }

        // ---------------------------------------------------------- ponteiro
        let dragId = -1;
        let startX = 0;
        let startOff = 0;
        let moved = 0;

        function onDown(e: PointerEvent) {
            if (e.button !== 0) return;
            dragId = e.pointerId;
            try {
                strip.setPointerCapture(e.pointerId);
            } catch {
                /* sem captura: o arrasto ainda funciona */
            }
            mode = "drag";
            startX = e.clientX;
            startOff = offset;
            moved = 0;
            vel = 0;
            dragDelta = 0;
            strip.dataset.drag = "true";
            kick();
        }

        function onMove(e: PointerEvent) {
            if (e.pointerId !== dragId || mode !== "drag") return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > moved) moved = Math.abs(dx);
            const next = clamp(startOff - dx, minOff, maxOff);
            dragDelta += next - offset;
            offset = next;
            kick();
        }

        function onUp(e: PointerEvent) {
            if (e.pointerId !== dragId) return;
            dragId = -1;
            strip.dataset.drag = "false";
            if (mode === "drag") mode = reduced ? "idle" : "free";
            kick();
        }

        function onClickCapture(e: MouseEvent) {
            if (moved > 6) {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        // ------------------------------------------------------------- roda
        function onWheel(e: WheelEvent) {
            const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            const d = horizontal ? e.deltaX : e.shiftKey ? e.deltaY : 0;
            if (!d) return; // rolagem vertical continua sendo da pagina
            e.preventDefault();
            goal = clamp((mode === "snap" ? goal : offset) + d, minOff, maxOff);
            mode = "snap";
            kick();
        }

        // --------------------------------------------------------- teclado
        function onKey(e: KeyboardEvent) {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            goTo(activeIndex + (e.key === "ArrowRight" ? 1 : -1));
        }

        function onFocusIn(e: FocusEvent) {
            if (mode === "drag") return;
            const target = e.target as HTMLElement | null;
            const el = target ? target.closest(".ft-card") : null;
            const idx = el ? cards.indexOf(el as HTMLAnchorElement) : -1;
            if (idx >= 0) goTo(idx);
        }

        strip.addEventListener("pointerdown", onDown);
        strip.addEventListener("pointermove", onMove);
        strip.addEventListener("pointerup", onUp);
        strip.addEventListener("pointercancel", onUp);
        strip.addEventListener("click", onClickCapture, true);
        strip.addEventListener("wheel", onWheel, { passive: false });
        strip.addEventListener("keydown", onKey);
        strip.addEventListener("focusin", onFocusIn);

        const io = new IntersectionObserver(
            (entries) => {
                visible = entries[0].isIntersecting;
                if (visible) kick();
                else if (raf) {
                    cancelAnimationFrame(raf);
                    raf = 0;
                }
            },
            { rootMargin: "160px 0px" },
        );
        io.observe(strip);

        const ro = new ResizeObserver(() => {
            measure();
            kick();
        });
        ro.observe(strip);

        measure();

        return () => {
            if (raf) cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            strip.removeEventListener("pointerdown", onDown);
            strip.removeEventListener("pointermove", onMove);
            strip.removeEventListener("pointerup", onUp);
            strip.removeEventListener("pointercancel", onUp);
            strip.removeEventListener("click", onClickCapture, true);
            strip.removeEventListener("wheel", onWheel);
            strip.removeEventListener("keydown", onKey);
            strip.removeEventListener("focusin", onFocusIn);
        };
    }, []);

    return (
        <>
            <div
                ref={stripRef}
                className="ft-strip"
                role="group"
                aria-roledescription="carrossel"
                aria-label="Imagens dos projetos"
                data-drag="false"
            >
                <div ref={yawRef} className="ft-yaw">
                    <div ref={trackRef} className="ft-track">
                        {SHOTS.map((shot, i) => (
                            <Link
                                key={shot.slug + "-" + shot.index}
                                ref={(el) => {
                                    cardsRef.current[i] = el;
                                }}
                                href={`/projetos/${shot.slug}`}
                                draggable={false}
                                className="ft-card"
                            >
                                <span className="ft-shot block">
                                    <Image
                                        src={shot.src}
                                        alt={`Projeto ${shot.project} — imagem ${shot.index}`}
                                        fill
                                        draggable={false}
                                        loading={i < 5 ? "eager" : "lazy"}
                                        sizes="(max-width: 767px) 190px, 260px"
                                        className="object-cover object-center"
                                    />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-4 max-w-[86rem] px-5 sm:mt-6 sm:px-8">
                <div ref={railRef} className="ft-rail">
                    <div ref={thumbRef} className="ft-rail-thumb" />
                </div>
            </div>
        </>
    );
}
