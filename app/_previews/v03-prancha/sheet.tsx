import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/* ---------- hatch patterns (referenced by url(#id) across the page) ---------- */

export function HatchDefs() {
    return (
        <svg className="pr-defs" aria-hidden="true" focusable="false" width="0" height="0">
            <defs>
                <pattern id="pr-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#313C59" strokeWidth="1" />
                </pattern>
                <pattern id="pr-hatch-b" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#313C59" strokeWidth="1" />
                </pattern>
                <pattern id="pr-cross" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#313C59" strokeWidth="1" />
                    <line x1="0" y1="0" x2="8" y2="0" stroke="#313C59" strokeWidth="1" />
                </pattern>
                <pattern id="pr-dots" width="8" height="8" patternUnits="userSpaceOnUse">
                    <circle cx="4" cy="4" r="1" fill="#313C59" />
                </pattern>
            </defs>
        </svg>
    );
}

export function Hatch({ id = "pr-hatch", className = "" }: { id?: "pr-hatch" | "pr-hatch-b" | "pr-cross" | "pr-dots"; className?: string }) {
    return (
        <svg className={className} aria-hidden="true" focusable="false" width="100%" height="100%">
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}

/* ---------- sheet frame: hairline border + corner ticks ---------- */

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function SheetFrame() {
    return (
        <svg className="pr-frame" aria-hidden="true" focusable="false">
            <g className="pr-frame-edges">
                <line x1="0" y1="0.5" x2="100%" y2="0.5" pathLength={1} style={i(0)} />
                <line x1="100%" y1="0" x2="100%" y2="100%" transform="translate(-0.5 0)" pathLength={1} style={i(1)} />
                <line x1="100%" y1="100%" x2="0" y2="100%" transform="translate(0 -0.5)" pathLength={1} style={i(2)} />
                <line x1="0" y1="100%" x2="0" y2="0" transform="translate(0.5 0)" pathLength={1} style={i(3)} />
            </g>
            <g className="pr-frame-ticks">
                <svg x="0" y="0" overflow="visible">
                    <line x1="-14" y1="0.5" x2="-4" y2="0.5" />
                    <line x1="0.5" y1="-14" x2="0.5" y2="-4" />
                </svg>
                <svg x="100%" y="0" overflow="visible">
                    <line x1="4" y1="0.5" x2="14" y2="0.5" />
                    <line x1="-0.5" y1="-14" x2="-0.5" y2="-4" />
                </svg>
                <svg x="100%" y="100%" overflow="visible">
                    <line x1="4" y1="-0.5" x2="14" y2="-0.5" />
                    <line x1="-0.5" y1="4" x2="-0.5" y2="14" />
                </svg>
                <svg x="0" y="100%" overflow="visible">
                    <line x1="-14" y1="-0.5" x2="-4" y2="-0.5" />
                    <line x1="0.5" y1="4" x2="0.5" y2="14" />
                </svg>
            </g>
        </svg>
    );
}

export function SheetLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <span className={`pr-sheet-label pr-mono ${className}`}>{children}</span>;
}

/** Binding margin: hatched strip along the left edge of a sheet. */
export function Binding() {
    return (
        <div className="pr-binding" aria-hidden="true">
            <Hatch />
        </div>
    );
}

/* ---------- dimension line with oblique ticks ---------- */

export function Dimension({ label, axis = "x", className = "" }: { label: string; axis?: "x" | "y"; className?: string }) {
    if (axis === "x") {
        return (
            <div className={`pr-dim pr-dim-x ${className}`} aria-hidden="true">
                <span className="pr-dim-label pr-mono">{label}</span>
                <svg className="pr-dim-svg" width="100%" height="12">
                    <line x1="0" y1="6.5" x2="100%" y2="6.5" pathLength={1} className="pr-dim-main" />
                    <svg x="0" y="0" overflow="visible">
                        <line x1="0.5" y1="0" x2="0.5" y2="12" />
                        <line x1="-3.5" y1="10.5" x2="4.5" y2="2.5" />
                    </svg>
                    <svg x="100%" y="0" overflow="visible">
                        <line x1="-0.5" y1="0" x2="-0.5" y2="12" />
                        <line x1="-4.5" y1="10.5" x2="3.5" y2="2.5" />
                    </svg>
                </svg>
            </div>
        );
    }
    return (
        <div className={`pr-dim pr-dim-y ${className}`} aria-hidden="true">
            <span className="pr-dim-label pr-mono">{label}</span>
            <svg className="pr-dim-svg" width="12" height="100%">
                <line x1="6.5" y1="0" x2="6.5" y2="100%" pathLength={1} className="pr-dim-main" />
                <svg x="0" y="0" overflow="visible">
                    <line x1="0" y1="0.5" x2="12" y2="0.5" />
                    <line x1="2.5" y1="-3.5" x2="10.5" y2="4.5" />
                </svg>
                <svg x="0" y="100%" overflow="visible">
                    <line x1="0" y1="-0.5" x2="12" y2="-0.5" />
                    <line x1="2.5" y1="-4.5" x2="10.5" y2="3.5" />
                </svg>
            </svg>
        </div>
    );
}

/* ---------- title block ("carimbo") ---------- */

export type TbCell = {
    node: ReactNode;
    href?: string;
    external?: boolean;
    fill?: boolean;
    grow?: number;
    className?: string;
};

export function TitleBlock({ rows, className = "" }: { rows: TbCell[][]; className?: string }) {
    return (
        <div className={`pr-tb pr-mono ${className}`}>
            {rows.map((row, r) => (
                <div className="pr-tb-row" key={r}>
                    {row.map((c, k) => {
                        const cls = `pr-tb-cell${c.fill ? " is-fill" : ""}${c.href ? " is-link" : ""} ${c.className ?? ""}`;
                        const style = { flexGrow: c.grow ?? 1 } as CSSProperties;
                        if (c.href && c.external) {
                            return (
                                <a key={k} className={cls} style={style} href={c.href} target="_blank" rel="noreferrer">
                                    {c.node}
                                </a>
                            );
                        }
                        if (c.href) {
                            return (
                                <Link key={k} className={cls} style={style} href={c.href}>
                                    {c.node}
                                </Link>
                            );
                        }
                        return (
                            <div key={k} className={cls} style={style}>
                                {c.node}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

/* ---------- small line icons (1.5 stroke) ---------- */

export function ArrowIcon({ dir = "right", className = "" }: { dir?: "right" | "left"; className?: string }) {
    return (
        <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {dir === "right" ? (
                <>
                    <path d="M2 8h11" />
                    <path d="M9 4l4 4-4 4" />
                </>
            ) : (
                <>
                    <path d="M14 8H3" />
                    <path d="M7 4L3 8l4 4" />
                </>
            )}
        </svg>
    );
}
