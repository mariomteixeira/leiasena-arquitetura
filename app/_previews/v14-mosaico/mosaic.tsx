"use client";

/**
 * Muro de cards arredondados que se reorganiza.
 *
 * Repouso: os 18 recortes ocupam uma grade CSS onde cada card ocupa um número
 * de linhas derivado do próprio `ratio` (10 unidades de linha por coluna).
 * Promoção: FLIP real — mede o rect do card no muro, posiciona o card do palco
 * sobre ele com `translate + scale` (origem top-left) e devolve a transformação
 * à identidade; ao mesmo tempo a razão do palco (`--ms-r`, custom property
 * registrada) sai da forma da célula e chega à proporção natural da imagem.
 * O muro recua em 3D (`translateZ` + `rotateX`) enquanto isso.
 * Avançar refaz o mesmo voo: o card atual volta para a sua vaga e o próximo
 * decola da vaga dele — dois FLIPs cruzando.
 */

import Image from "next/image";
import Link from "next/link";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type MouseEvent as ReactMouseEvent,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { projects } from "../_shared/content";
import { mixedSelection, optimized, type Shot } from "../_shared/gallery";
import { IconArrow, IconChevronLeft, IconChevronRight, IconClose } from "./icons";

/** unidades de linha por largura de coluna — define o quanto a célula quantiza a proporção */
const ROW_UNITS = 10;
const FLIGHT = 900;

const shots = mixedSelection(18);
const totals: Record<string, number> = Object.fromEntries(
    projects.map((p) => [p.slug, p.images.length]),
);

const spanOf = (ratio: number) => Math.max(4, Math.min(15, Math.round(ROW_UNITS / ratio)));
const pad = (n: number) => String(n).padStart(2, "0");

interface Flight {
    id: number;
    /** índice em `shots` */
    i: number;
    mode: "in" | "out";
}

export default function Mosaic() {
    const wallRef = useRef<HTMLUListElement | null>(null);
    const tiles = useRef(new Map<number, HTMLAnchorElement>());
    const cards = useRef(new Map<number, HTMLDivElement>());
    const flown = useRef(new Set<string>());
    const seq = useRef(0);
    const returnTo = useRef<number | null>(null);

    const [flights, setFlights] = useState<Flight[]>([]);
    const [active, setActive] = useState<number | null>(null);

    const lifted = useMemo(() => new Set(flights.map((f) => f.i)), [flights]);
    const focused = active !== null;
    const shot = active === null ? null : shots[active];

    /* ---- a unidade de linha depende da largura real da coluna --------- */
    useLayoutEffect(() => {
        const wall = wallRef.current;
        if (!wall) return;
        const measure = () => {
            const cs = getComputedStyle(wall);
            const cols = cs.gridTemplateColumns.split(" ").filter(Boolean);
            const colW = parseFloat(cols[0]);
            const gap = parseFloat(cs.rowGap) || 0;
            if (!Number.isFinite(colW) || colW <= 0) return;
            wall.style.setProperty("--ms-u", `${(colW + gap) / ROW_UNITS - gap}px`);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(wall);
        return () => ro.disconnect();
    }, []);

    /* ---- pré-carrega o recorte grande antes do voo ------------------- */
    const warm = useCallback((i: number) => {
        const s = shots[i];
        if (!s) return;
        const img = new window.Image();
        img.src = optimized(s.src, 1200);
    }, []);

    /* ---- promover / avançar / fechar --------------------------------- */
    const promote = useCallback(
        (i: number) => {
            if (i === active) return;
            returnTo.current = i;
            warm(i);
            warm((i + 1) % shots.length);
            warm((i - 1 + shots.length) % shots.length);
            seq.current += 1;
            const id = seq.current;
            setFlights((prev) => [
                ...prev.filter((f) => f.mode === "in").map((f) => ({ ...f, mode: "out" as const })),
                { id, i, mode: "in" },
            ]);
            setActive(i);
        },
        [active, warm],
    );

    const close = useCallback(() => {
        setFlights((prev) => prev.map((f) => ({ ...f, mode: "out" as const })));
        setActive(null);
        const back = returnTo.current;
        returnTo.current = null;
        if (back !== null) {
            window.requestAnimationFrame(() => tiles.current.get(back)?.focus({ preventScroll: true }));
        }
    }, []);

    const step = useCallback(
        (delta: number) => {
            if (active === null) return;
            promote((active + delta + shots.length) % shots.length);
        },
        [active, promote],
    );

    /* ---- teclado ------------------------------------------------------ */
    useEffect(() => {
        if (!focused) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                close();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                step(1);
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                step(-1);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [focused, close, step]);

    /* ---- o FLIP ------------------------------------------------------- */
    useLayoutEffect(() => {
        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        for (const f of flights) {
            const key = `${f.id}:${f.mode}`;
            if (flown.current.has(key)) continue;
            flown.current.add(key);

            const el = cards.current.get(f.id);
            const tile = tiles.current.get(f.i);
            if (!el || !tile) continue;

            const tr = tile.getBoundingClientRect();
            const cellRatio = tr.height > 0 ? tr.width / tr.height : shots[f.i].ratio;

            if (f.mode === "in") {
                // primeiro quadro: a razão da célula do muro, encolhido sobre a vaga
                el.style.transition = "none";
                el.style.setProperty("--ms-r", String(cellRatio));
                const sr = el.getBoundingClientRect();
                if (sr.width <= 0) continue;
                const s = tr.width / sr.width;
                el.style.transform = `translate(${tr.left - sr.left}px, ${tr.top - sr.top}px) scale(${s})`;
                void el.offsetWidth;
                const land = () => {
                    el.style.transition = "";
                    el.style.setProperty("--ms-r", String(shots[f.i].ratio));
                    el.style.transform = "translate(0px, 0px) scale(1)";
                };
                if (reduce) land();
                else window.requestAnimationFrame(() => window.requestAnimationFrame(land));
            } else {
                // volta para a vaga: preserva o ponto onde o voo estava
                const cur = el.getBoundingClientRect();
                el.style.transition = "none";
                el.style.transform = "none";
                const lay = el.getBoundingClientRect();
                if (lay.width <= 0) continue;
                el.style.transform = `translate(${cur.left - lay.left}px, ${cur.top - lay.top}px) scale(${cur.width / lay.width})`;
                void el.offsetWidth;
                const home = () => {
                    el.style.transition = "";
                    el.style.setProperty("--ms-r", String(cellRatio));
                    el.style.transform = `translate(${tr.left - lay.left}px, ${tr.top - lay.top}px) scale(${tr.width / lay.width})`;
                };
                if (reduce) home();
                else window.requestAnimationFrame(() => window.requestAnimationFrame(home));

                const id = f.id;
                window.setTimeout(
                    () => {
                        cards.current.delete(id);
                        flown.current.delete(`${id}:in`);
                        flown.current.delete(`${id}:out`);
                        setFlights((prev) => prev.filter((x) => x.id !== id));
                    },
                    reduce ? 0 : FLIGHT,
                );
            }
        }
    }, [flights]);

    /* ---- arraste horizontal no card ----------------------------------- */
    const drag = useRef<{ x: number; y: number } | null>(null);
    const onPointerDown = (e: ReactPointerEvent) => {
        drag.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: ReactPointerEvent) => {
        const start = drag.current;
        drag.current = null;
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    };

    const onTileClick = (e: ReactMouseEvent<HTMLAnchorElement>, i: number) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        promote(i);
    };

    const total = shot ? (totals[shot.slug] ?? shot.index) : 0;

    return (
        <>
            <ul
                ref={wallRef}
                className="ms-wall"
                data-focus={focused ? "true" : "false"}
                aria-label="Recortes dos projetos"
                inert={focused ? true : undefined}
            >
                {shots.map((s, i) => (
                    <li key={`${s.slug}-${s.index}`} style={{ gridRow: `span ${spanOf(s.ratio)}` }}>
                        <Link
                            ref={(el) => {
                                if (el) tiles.current.set(i, el);
                                else tiles.current.delete(i);
                            }}
                            href={`/projetos/${s.slug}`}
                            className="ms-tile h-full"
                            data-lifted={lifted.has(i) ? "true" : undefined}
                            onClick={(e) => onTileClick(e, i)}
                            onPointerEnter={() => warm(i)}
                            onFocus={() => warm(i)}
                        >
                            <Image
                                src={s.src}
                                alt={`${s.project} — imagem ${pad(s.index)}`}
                                fill
                                sizes="(max-width: 699px) 48vw, (max-width: 1099px) 32vw, 24vw"
                                loading={i < 4 ? "eager" : "lazy"}
                                className="object-cover"
                            />
                            <span className="ms-tile-name font-mono text-[0.66rem] uppercase tracking-[0.16em]">
                                {s.project}
                                <span className="text-cream/70">{pad(s.index)}</span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="ms-stage" data-on={focused ? "true" : "false"} aria-hidden={!focused}>
                {focused && (
                    <button type="button" className="ms-scrim" onClick={close}>
                        <span className="sr-only">Voltar ao mosaico</span>
                    </button>
                )}

                {flights.map((f) => {
                    const s = shots[f.i];
                    return (
                        <div
                            key={f.id}
                            ref={(el) => {
                                if (el) cards.current.set(f.id, el);
                            }}
                            className="ms-card"
                            data-mode={f.mode}
                            style={
                                {
                                    "--ms-nat": s.ratio,
                                    "--ms-r": s.ratio,
                                    backgroundImage: `url(${optimized(s.src, 640)})`,
                                } as CSSProperties
                            }
                            onPointerDown={onPointerDown}
                            onPointerUp={onPointerUp}
                        >
                            <Image
                                src={s.src}
                                alt={`${s.project} — imagem ${pad(s.index)}`}
                                fill
                                sizes="(max-width: 767px) 92vw, 66vw"
                                className="object-cover"
                            />
                        </div>
                    );
                })}

                {shot && (
                    <div className="ms-meta">
                        <p className="ms-meta-row truncate">
                            <span className="font-serif text-[1.3rem] leading-none tracking-[-0.01em] text-navy">
                                {shot.project}
                            </span>
                            <span className="ml-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-navy/70">
                                · {pad(shot.index)} de {pad(total)}
                            </span>
                        </p>

                        <span className="ms-meta-row">
                            <Link
                                href={`/projetos/${shot.slug}`}
                                className="ms-link inline-flex shrink-0 items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-navy/80 hover:text-navy"
                            >
                                Ver projeto
                                <IconArrow className="h-3.5 w-3.5" />
                            </Link>

                            <span className="flex shrink-0 items-center gap-1.5">
                                <button
                                    type="button"
                                    className="ms-round"
                                    onClick={() => step(-1)}
                                    aria-label="Imagem anterior"
                                >
                                    <IconChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    className="ms-round"
                                    onClick={() => step(1)}
                                    aria-label="Próxima imagem"
                                >
                                    <IconChevronRight className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    className="ms-round"
                                    onClick={close}
                                    aria-label="Voltar ao mosaico"
                                >
                                    <IconClose className="h-4 w-4" />
                                </button>
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
