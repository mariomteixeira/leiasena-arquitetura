"use client";

/**
 * Marquise · Arco — o retângulo arredondado e o arco são a mesma forma.
 *
 * Cada card é uma janela na proporção da sua imagem. Fora do centro ela está
 * fechada: `border-radius: 20px` nos quatro cantos e a caixa 18% mais baixa que
 * a proporção natural. No centro ela abre: os cantos de cima incham até
 * `50% / 32%` (um arco de marquise) enquanto a `aspect-ratio` volta à proporção
 * nativa do render. As duas coisas são escritas no mesmo quadro, a partir de um
 * único valor `--t`, então a forma intermediária existe de verdade.
 *
 * A "câmera" é o container: ao trocar de card ele gira um passo inteiro em
 * rotateY e volta, de modo que a fita é lida como uma caminhada ao longo da
 * marquise e não como cards se teletransportando.
 */

import Image from "next/image";
import Link from "next/link";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent as RKeyboardEvent,
    type PointerEvent as RPointerEvent,
} from "react";
import { mixedSelection, type Shot } from "../_shared/gallery";
import { IconArcLeft, IconArcRight, IconArrow } from "./icons";

const SHOTS: Shot[] = mixedSelection(14);
const LAST = SHOTS.length - 1;

/** âncoras por |deslocamento| em posições (0,1,2,3) */
const ANG = [0, 16, 30, 40]; // graus no desktop; no mobile o CSS divide por 2
const ZF = [0.38, -0.57, -1.32, -1.9];
const YF = [0, 0.044, 0.126, 0.2];
const CF = [1, 0.88, 0.76, 0.68]; // compressão do eixo X ao longo do arco
const OPD = [1, 0.92, 0.74, 0];
const OPM = [1, 0.78, 0, 0];

const CAM = 16; // um passo da câmera, na mesma unidade de --ac-ang
const DUR = 700;
const START = 2;
const GAP = 0.14; // em unidades de --ac-base

function at(anchors: number[], k: number): number {
    const last = anchors.length - 1;
    if (k >= last) return anchors[last] + (anchors[last] - anchors[last - 1]) * (k - last);
    const i = Math.floor(k);
    return anchors[i] + (anchors[i + 1] - anchors[i]) * (k - i);
}

/** largura fixa por card, em unidades de --ac-base: larguras variam muito,
 *  alturas variam pouco — a fita da referência, com base compartilhada. */
function widthFactor(ratio: number): number {
    return Math.pow(ratio, 0.62);
}

const HALF = SHOTS.map((s) => widthFactor(s.ratio) / 2);
/** posição acumulada de cada card na fita esticada (unidades de --ac-base) */
const CUM = HALF.reduce<number[]>((acc, h, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + HALF[i - 1] + h + GAP);
    return acc;
}, []);
const STEP_ADV = (CUM[LAST] - CUM[0]) / LAST;

function cumAt(pos: number): number {
    if (pos <= 0) return CUM[0] + pos * (CUM[1] - CUM[0]);
    if (pos >= LAST) return CUM[LAST] + (pos - LAST) * (CUM[LAST] - CUM[LAST - 1]);
    const i = Math.floor(pos);
    return CUM[i] + (CUM[i + 1] - CUM[i]) * (pos - i);
}

interface Frame {
    transform: string;
    z: number;
    t: number;
    op: number;
    opm: number;
    pe: "auto" | "none";
}

/**
 * A camera nao e um container: girar a fita inteira num wrapper `preserve-3d`
 * quebra o hit test do Chromium (so o card sem rotacao aceita clique). Como
 * Ry(cam)·T(x,y,z)·Ry(a) = T(Ry(cam)·(x,y,z))·Ry(cam+a), a rotacao da camera
 * entra na matriz de cada card: o vetor de posicao gira e o angulo soma.
 */
function frameFor(i: number, pos: number, cam: number, angScale: number): Frame {
    const offset = i - pos;
    const k = Math.abs(offset);
    const s = offset < 0 ? -1 : 1;
    const lin = Math.max(0, Math.min(1, 1 - k));
    const x = (CUM[i] - cumAt(pos)) * at(CF, k);
    const y = at(YF, k);
    const z = at(ZF, k);
    const r = (cam * angScale * Math.PI) / 180;
    const cos = Math.cos(r);
    const sin = Math.sin(r);
    const xc = x * cos + z * sin;
    const zc = -x * sin + z * cos;
    return {
        transform:
            `translateX(calc(-50% + var(--ac-base) * ${xc.toFixed(4)})) ` +
            `translateY(calc(var(--ac-base) * ${y.toFixed(4)})) ` +
            `translateZ(calc(var(--ac-base) * ${zc.toFixed(4)})) ` +
            `rotateY(calc(var(--ac-ang) * ${(s * at(ANG, k) + cam).toFixed(3)}))`,
        z: Math.max(1, Math.round(300 + zc * 90)),
        t: lin * lin * (3 - 2 * lin),
        op: Math.max(0, at(OPD, k)),
        opm: Math.max(0, at(OPM, k)),
        pe: k > 2.4 ? "none" : "auto",
    };
}

/** estado inicial (SSR): a fita já nasce montada, sem animação de entrada */
function initialStyle(i: number, shot: Shot): CSSProperties {
    const f = frameFor(i, START, 0, 1);
    return {
        "--ar": shot.ratio.toFixed(4),
        "--w": widthFactor(shot.ratio).toFixed(4),
        "--t": f.t.toFixed(4),
        "--o": f.op.toFixed(3),
        "--om": f.opm.toFixed(3),
        transform: f.transform,
        zIndex: f.z,
        pointerEvents: f.pe,
    } as CSSProperties;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function ArchCarousel() {
    const [active, setActive] = useState(START);

    const stageRef = useRef<HTMLDivElement | null>(null);
    const probeRef = useRef<HTMLSpanElement | null>(null);
    const cardsRef = useRef<Array<HTMLAnchorElement | null>>([]);

    const posRef = useRef(START);
    const rafRef = useRef(0);
    const reducedRef = useRef(false);
    const baseRef = useRef(300);
    const angRef = useRef(1);
    const dragRef = useRef<{ id: number; x: number; y: number; pos: number } | null>(null);
    const movedRef = useRef(false);

    const apply = useCallback((pos: number, cam: number) => {
        for (let i = 0; i < cardsRef.current.length; i += 1) {
            const el = cardsRef.current[i];
            if (!el) continue;
            const f = frameFor(i, pos, cam, angRef.current);
            el.style.transform = f.transform;
            el.style.zIndex = String(f.z);
            el.style.setProperty("--t", f.t.toFixed(4));
            el.style.setProperty("--o", f.op.toFixed(3));
            el.style.setProperty("--om", f.opm.toFixed(3));
            el.style.pointerEvents = f.pe;
        }
    }, []);

    const animateTo = useCallback(
        (target: number) => {
            cancelAnimationFrame(rafRef.current);
            const from = posRef.current;
            const dist = target - from;
            if (reducedRef.current || Math.abs(dist) < 0.001) {
                posRef.current = target;
                apply(target, 0);
                return;
            }
            const dir = dist > 0 ? 1 : -1;
            const swing = Math.min(1, Math.abs(dist));
            const t0 = performance.now();
            const tick = (now: number) => {
                const p = Math.min(1, (now - t0) / DUR);
                const e = 1 - Math.pow(1 - p, 4);
                const pos = from + dist * e;
                posRef.current = pos;
                apply(pos, -dir * CAM * swing * Math.sin(Math.PI * e));
                if (p < 1) rafRef.current = requestAnimationFrame(tick);
                else {
                    posRef.current = target;
                    apply(target, 0);
                }
            };
            rafRef.current = requestAnimationFrame(tick);
        },
        [apply],
    );

    const goTo = useCallback(
        (i: number) => {
            const next = Math.max(0, Math.min(LAST, i));
            setActive(next);
            animateTo(next);
        },
        [animateTo],
    );

    useEffect(() => {
        reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const readBase = () => {
            const w = probeRef.current?.offsetWidth ?? 0;
            if (w > 0) baseRef.current = w;
            angRef.current = window.matchMedia("(min-width: 768px)").matches ? 1 : 0.5;
        };
        readBase();
        apply(posRef.current, 0);
        window.addEventListener("resize", readBase);
        return () => {
            window.removeEventListener("resize", readBase);
            cancelAnimationFrame(rafRef.current);
        };
    }, [apply]);

    /* ------------------------------------------------------------- arrastar */
    const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        cancelAnimationFrame(rafRef.current);
        movedRef.current = false;
        dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, pos: posRef.current };
        stageRef.current?.setAttribute("data-dragging", "true");
    };

    const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
        const d = dragRef.current;
        if (!d || d.id !== e.pointerId) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        if (!movedRef.current) {
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
                // rolagem vertical: solta o carrossel, a página continua rolando
                dragRef.current = null;
                stageRef.current?.removeAttribute("data-dragging");
                return;
            }
            if (Math.abs(dx) < 6) return;
            movedRef.current = true;
            stageRef.current?.setPointerCapture(e.pointerId);
        }
        const adv = baseRef.current * STEP_ADV;
        const pos = Math.max(-0.45, Math.min(LAST + 0.45, d.pos - dx / adv));
        posRef.current = pos;
        apply(pos, Math.max(-1, Math.min(1, d.pos - pos)) * CAM * 0.55);
    };

    const endDrag = (e: RPointerEvent<HTMLDivElement>) => {
        const d = dragRef.current;
        stageRef.current?.removeAttribute("data-dragging");
        if (!d || d.id !== e.pointerId) return;
        dragRef.current = null;
        if (!movedRef.current) return;
        goTo(Math.round(posRef.current));
    };

    /* ------------------------------------------------------------- teclado */
    const onKeyDown = (e: RKeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(active + 1);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(active - 1);
        } else if (e.key === "Home") {
            e.preventDefault();
            goTo(0);
        } else if (e.key === "End") {
            e.preventDefault();
            goTo(LAST);
        }
    };

    const current = SHOTS[active];

    return (
        <div className="mt-8 sm:mt-10">
            <div
                ref={stageRef}
                className="ac-stage"
                role="group"
                aria-roledescription="carrossel"
                aria-label="Projetos"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onKeyDown}
            >
                <span ref={probeRef} className="ac-probe" aria-hidden="true" />

                {SHOTS.map((shot, i) => {
                        const isCurrent = i === active;
                        return (
                            <Link
                                key={`${shot.slug}-${shot.index}`}
                                ref={(el) => {
                                    cardsRef.current[i] = el;
                                }}
                                href={`/projetos/${shot.slug}`}
                                className="ac-card"
                                style={initialStyle(i, shot)}
                                aria-label={
                                    isCurrent
                                        ? `Ver projeto ${shot.project}`
                                        : `${shot.project} — trazer para o centro`
                                }
                                aria-current={isCurrent ? "true" : undefined}
                                tabIndex={Math.abs(i - active) <= 2 ? 0 : -1}
                                draggable={false}
                                onFocus={(e) => {
                                    // so o foco por teclado traz o card ao centro; o mouse
                                    // ja foca no mousedown e roubaria o clique do link
                                    if (!isCurrent && e.currentTarget.matches(":focus-visible")) goTo(i);
                                }}
                                onClick={(e) => {
                                    if (movedRef.current) {
                                        e.preventDefault();
                                        return;
                                    }
                                    if (!isCurrent) {
                                        e.preventDefault();
                                        goTo(i);
                                    }
                                }}
                            >
                                <Image
                                    src={shot.src}
                                    alt=""
                                    fill
                                    sizes="(max-width: 767px) 78vw, 420px"
                                    loading={i < 5 ? "eager" : "lazy"}
                                    draggable={false}
                                />
                            </Link>
                        );
                })}
            </div>

            {/* legenda do card central */}
            <div className="ac-cap mt-10 flex flex-col items-center text-center sm:mt-12">
                <div key={active} className="ac-cap-in flex flex-col items-center">
                    <h3 className="font-serif text-[2rem] leading-none tracking-[-0.02em] sm:text-[2.6rem]">
                        {current.project}
                    </h3>
                    <Link
                        href={`/projetos/${current.slug}`}
                        className="ac-link group mt-4 inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-navy/75"
                    >
                        Ver projeto
                        <IconArrow className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

            {/* controles */}
            <div className="mt-9 flex items-center justify-center gap-6 sm:mt-11">
                <button
                    type="button"
                    className="ac-ctrl"
                    onClick={() => goTo(active - 1)}
                    disabled={active === 0}
                    aria-label="Imagem anterior"
                >
                    <IconArcLeft className="h-5 w-5" />
                </button>
                <p
                    className="font-mono text-[0.72rem] tabular-nums uppercase tracking-[0.22em] text-navy/70"
                    aria-live="polite"
                >
                    {pad(active + 1)} <span className="text-navy/35">/</span> {pad(SHOTS.length)}
                </p>
                <button
                    type="button"
                    className="ac-ctrl"
                    onClick={() => goTo(active + 1)}
                    disabled={active === LAST}
                    aria-label="Próxima imagem"
                >
                    <IconArcRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
