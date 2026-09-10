const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function Arrow() {
    return (
        <svg className="c-arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" {...stroke}>
            <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
        </svg>
    );
}

export function MenuLines() {
    return (
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" {...stroke}>
            <path d="M2 6h16M2 12h16" />
        </svg>
    );
}

export function Cross() {
    return (
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" {...stroke}>
            <path d="M4 4l12 12M16 4 4 16" />
        </svg>
    );
}
