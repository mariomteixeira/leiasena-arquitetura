const base = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export function MenuIcon({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" {...base}>
            <path d="M3 6.5h14" />
            <path d="M3 13.5h14" />
        </svg>
    );
}

export function CloseIcon({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" {...base}>
            <path d="M4.5 4.5l11 11" />
            <path d="M15.5 4.5l-11 11" />
        </svg>
    );
}

export function AlertIcon({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" {...base}>
            <path d="M8 2.4L15 14H1L8 2.4z" />
            <path d="M8 6.6v3.1" />
            <path d="M8 11.9h.01" />
        </svg>
    );
}

export function CheckIcon({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" {...base}>
            <path d="M2.5 8.6l3.6 3.6L13.5 4.8" />
        </svg>
    );
}

export function DownIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" {...base}>
            <path d="M8 2.5v11" />
            <path d="M3.8 9.3L8 13.5l4.2-4.2" />
        </svg>
    );
}
