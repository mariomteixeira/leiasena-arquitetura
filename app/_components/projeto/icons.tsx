type IconProps = { className?: string };

const base = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export function IconArrowLeft({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M20 12H5M11 6l-6 6 6 6" />
        </svg>
    );
}

export function IconArrowRight({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
    );
}

export function IconChevronLeft({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M14.5 6l-6 6 6 6" />
        </svg>
    );
}

export function IconChevronRight({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M9.5 6l6 6-6 6" />
        </svg>
    );
}

export function IconClose({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    );
}
