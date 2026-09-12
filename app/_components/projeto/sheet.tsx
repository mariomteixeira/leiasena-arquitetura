"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Shot } from "../../_lib/gallery";
import { IconChevronLeft, IconChevronRight, IconClose } from "./icons";
import { chooseRows, pairRows, partitionBalanced, rowHeight, rowIndexOf } from "./layout";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

const GAP_DESKTOP = 14;
/** o mesmo ponto de virada do CSS */
const MOBILE_MAX = 720;

type Box = { w: number; avail: number };

const reduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pad = (n: number) => String(n).padStart(2, "0");

export default function Sheet({ shots, title }: { shots: Shot[]; title: string }) {
    const ratios = useMemo(() => shots.map((s) => s.ratio), [shots]);
    const total = shots.length;

    const [box, setBox] = useState<Box | null>(null);
    const [cur, setCur] = useState(0);
    const [open, setOpen] = useState(false);

    const wrapRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const flipFrom = useRef<Map<string, number> | null>(null);
    const pendingFocus = useRef<number | null>(null);
    const wantScroll = useRef(false);
    const touchX = useRef(0);

    /* ---------------------------------------------------------- medida ---- */
    useIso(() => {
        const el = wrapRef.current;
        if (!el) return;

        const measure = () => {
            const top = el.getBoundingClientRect().top + window.scrollY;
            const next = {
                w: el.clientWidth,
                avail: Math.max(260, Math.round(window.innerHeight - top - 24)),
            };
            setBox((prev) => (prev && prev.w === next.w && prev.avail === next.avail ? prev : next));
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        window.addEventListener("resize", measure);
        if (document.fonts) document.fonts.ready.then(measure).catch(() => undefined);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    const mobile = !!box && box.w < MOBILE_MAX;

    const rows = useMemo(() => {
        if (!box) return partitionBalanced(ratios, Math.min(3, ratios.length));
        if (box.w < MOBILE_MAX) return pairRows(ratios.length);
        return chooseRows(ratios, box.w, box.avail, GAP_DESKTOP);
    }, [box, ratios]);

    /** a folha mais curta que a dobra fica centrada no espaço que sobra */
    const lead = useMemo(() => {
        if (!box || mobile) return 0;
        const h =
            rows.reduce((a, row) => a + rowHeight(row, ratios, box.w, GAP_DESKTOP), 0) +
            (rows.length - 1) * GAP_DESKTOP;
        return Math.max(0, Math.min(130, Math.round((box.avail - h) / 2)));
    }, [box, mobile, rows, ratios]);

    const openRow = open ? rowIndexOf(rows, cur) : -1;

    /* ------------------------------------------------------------ FLIP ---- */
    const capture = useCallback(() => {
        const root = sheetRef.current;
        if (!root || reduced()) return;
        const m = new Map<string, number>();
        root.querySelectorAll<HTMLElement>("[data-ix-row]").forEach((el) => {
            m.set(el.dataset.ixRow as string, el.getBoundingClientRect().top + window.scrollY);
        });
        flipFrom.current = m;
    }, []);

    useIso(() => {
        const from = flipFrom.current;
        flipFrom.current = null;
        const root = sheetRef.current;

        if (root && from) {
            root.querySelectorAll<HTMLElement>("[data-ix-row]").forEach((el) => {
                const prev = from.get(el.dataset.ixRow as string);
                if (prev === undefined) return;
                const now = el.getBoundingClientRect().top + window.scrollY;
                const dy = prev - now;
                if (Math.abs(dy) < 1) return;
                el.style.transition = "none";
                el.style.transform = `translate3d(0, ${dy}px, 0)`;
                requestAnimationFrame(() => {
                    el.style.transition = "transform 620ms var(--ix-ease)";
                    el.style.transform = "translate3d(0, 0, 0)";
                });
            });
        }

        if (pendingFocus.current !== null) {
            cellRefs.current[pendingFocus.current]?.focus({ preventScroll: true });
            pendingFocus.current = null;
        }

        if (wantScroll.current) {
            wantScroll.current = false;
            requestAnimationFrame(() => {
                const st = stageRef.current;
                if (!st) return;
                const r = st.getBoundingClientRect();
                const margin = 16;
                const vh = window.innerHeight;
                if (r.top >= margin && r.bottom <= vh - margin) return;
                /* o mínimo para o palco caber: o resto da folha permanece à vista */
                const delta =
                    r.height > vh - margin * 2 || r.top < margin
                        ? r.top - margin
                        : r.bottom - (vh - margin);
                window.scrollTo({
                    top: Math.max(0, window.scrollY + delta),
                    behavior: reduced() ? "auto" : "smooth",
                });
            });
        }
    }, [open, cur, rows]);

    /* -------------------------------------------------------- operação ---- */
    const pick = (i: number) => {
        capture();
        if (open && cur === i) {
            setOpen(false);
            pendingFocus.current = i;
            return;
        }
        setCur(i);
        setOpen(true);
        wantScroll.current = true;
    };

    const goTo = (next: number) => {
        if (next === cur || next < 0 || next >= total) return;
        capture();
        setCur(next);
        pendingFocus.current = next;
        if (open) wantScroll.current = true;
    };

    const step = (delta: number) => goTo(Math.min(total - 1, Math.max(0, cur + delta)));

    const close = () => {
        capture();
        setOpen(false);
        pendingFocus.current = cur;
    };

    /** vizinho vertical: o quadro da linha de cima ou de baixo mais próximo na horizontal */
    const vertical = (dir: -1 | 1) => {
        const ri = rowIndexOf(rows, cur);
        const target = rows[ri + dir];
        if (!target) return;
        const from = cellRefs.current[cur]?.getBoundingClientRect();
        if (!from) {
            goTo(target[0]);
            return;
        }
        const mid = from.left + from.width / 2;
        let best = target[0];
        let dist = Infinity;
        for (const i of target) {
            const r = cellRefs.current[i]?.getBoundingClientRect();
            if (!r) continue;
            const d = Math.abs(r.left + r.width / 2 - mid);
            if (d < dist) {
                dist = d;
                best = i;
            }
        }
        goTo(best);
    };

    const onKeyDown = (e: ReactKeyboardEvent) => {
        switch (e.key) {
            case "ArrowRight":
                e.preventDefault();
                step(1);
                break;
            case "ArrowLeft":
                e.preventDefault();
                step(-1);
                break;
            case "ArrowDown":
                e.preventDefault();
                vertical(1);
                break;
            case "ArrowUp":
                e.preventDefault();
                vertical(-1);
                break;
            case "Home":
                e.preventDefault();
                goTo(0);
                break;
            case "End":
                e.preventDefault();
                goTo(total - 1);
                break;
            case "Escape":
                if (open) {
                    e.preventDefault();
                    close();
                }
                break;
            default:
                break;
        }
    };

    const shot = shots[cur];

    return (
        <div
            ref={wrapRef}
            className="ix-wrap"
            style={box ? { minHeight: box.avail, paddingTop: lead } : undefined}
        >
            <div
                ref={sheetRef}
                className="ix-sheet"
                data-open={open ? "true" : "false"}
                onKeyDown={onKeyDown}
                role="group"
                aria-label={`Imagens do projeto ${title}`}
            >
                {rows.map((row, ri) => (
                    <Fragment key={ri}>
                        <div className="ix-row" data-ix-row={ri}>
                            {row.map((i) => {
                                const s = shots[i];
                                const style: CSSProperties = {
                                    flexGrow: s.ratio,
                                    flexShrink: 1,
                                    flexBasis: 0,
                                    ["--r" as string]: s.ratio,
                                };
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        ref={(el) => {
                                            cellRefs.current[i] = el;
                                        }}
                                        className="ix-cell"
                                        data-sel={open && i === cur ? "true" : "false"}
                                        style={style}
                                        tabIndex={i === cur ? 0 : -1}
                                        aria-expanded={open && i === cur}
                                        aria-label={`Imagem ${s.index} de ${total}`}
                                        onClick={() => pick(i)}
                                    >
                                        <Image
                                            src={s.src}
                                            alt={`${title} — imagem ${s.index} de ${total}`}
                                            fill
                                            priority={i === 0}
                                            sizes="(max-width: 719px) 47vw, (max-width: 1100px) 34vw, 26vw"
                                            className="ix-img"
                                        />
                                        <span className="ix-num font-mono">{pad(s.index)}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {openRow === ri && (
                            <div ref={stageRef} className="ix-stage" style={{ ["--r" as string]: shot.ratio }}>
                                <figure
                                    key={cur}
                                    className="ix-stage-fig"
                                    onTouchStart={(e) => {
                                        touchX.current = e.touches[0].clientX;
                                    }}
                                    onTouchEnd={(e) => {
                                        const dx = e.changedTouches[0].clientX - touchX.current;
                                        if (Math.abs(dx) > 44) step(dx < 0 ? 1 : -1);
                                    }}
                                >
                                    <Image
                                        src={shot.src}
                                        alt={`${title} — imagem ${shot.index} de ${total}`}
                                        fill
                                        sizes="(max-width: 719px) 94vw, 78vw"
                                        className="ix-stage-img"
                                    />
                                </figure>

                                <div className="ix-stage-bar">
                                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-navy/80 sm:text-[0.74rem]">
                                        <span className="tabular-nums text-navy">{pad(shot.index)}</span> / {pad(total)}
                                        <span className="mx-2 text-navy/40">·</span>
                                        <span className="tabular-nums">
                                            {shot.width} × {shot.height} px
                                        </span>
                                    </p>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            className="ix-ctrl"
                                            onClick={() => step(-1)}
                                            disabled={cur === 0}
                                            aria-label="Imagem anterior"
                                        >
                                            <IconChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="ix-ctrl"
                                            onClick={() => step(1)}
                                            disabled={cur === total - 1}
                                            aria-label="Próxima imagem"
                                        >
                                            <IconChevronRight className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="ix-ctrl"
                                            onClick={close}
                                            aria-label="Fechar a imagem ampliada"
                                        >
                                            <IconClose className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}
