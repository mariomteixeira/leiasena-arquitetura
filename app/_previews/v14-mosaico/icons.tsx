type IconProps = { className?: string };

const base = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export function IconMenu({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M3 8h18M3 16h18" />
        </svg>
    );
}

export function IconClose({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M5 5l14 14M19 5L5 19" />
        </svg>
    );
}

export function IconArrow({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
    );
}

export function IconMail({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3.5 7l8.5 6 8.5-6" />
        </svg>
    );
}

export function IconInstagram({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <path d="M17.2 6.8h.01" strokeWidth={2} />
        </svg>
    );
}

export function IconWhatsapp({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.7z" />
            <path d="M9 8.6c.3-.1.6 0 .8.3l.8 1.3c.1.3.1.6-.1.8l-.5.5a5.6 5.6 0 0 0 2.6 2.6l.5-.6c.2-.2.5-.2.8-.1l1.3.8c.3.2.4.5.3.8-.2.7-.9 1.2-1.7 1.2-2.8 0-5.6-2.8-5.6-5.6 0-.8.4-1.5 1.1-1.7z" />
        </svg>
    );
}

export function IconPin({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.6" />
        </svg>
    );
}

export function IconAlert({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.2M12 16.2h.01" />
        </svg>
    );
}

export function IconCheck({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
    );
}

export function IconChevron({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
            <path d="M6 9.5l6 6 6-6" />
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
