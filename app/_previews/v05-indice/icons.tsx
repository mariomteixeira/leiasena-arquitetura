const base = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
};

export function ArrowIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
            <path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" />
        </svg>
    );
}

export function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...base}>
            <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
    );
}

export function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...base}>
            <path d="M5 5l14 14M19 5 5 19" />
        </svg>
    );
}

export function CheckIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
            <path d="M2.5 8.5 6 12l7.5-8" />
        </svg>
    );
}

export function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 16 16" width="16" height="16" className={className} {...base}>
            <path d="m3 6 5 5 5-5" />
        </svg>
    );
}
