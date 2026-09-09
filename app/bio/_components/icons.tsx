import type { ComponentType, SVGProps } from "react";
import type { LinkId } from "../_lib/bio";

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
};

export function InstagramIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function BriefcaseIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="7" width="18" height="13" rx="2.5" />
            <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
            <path d="M3 12.5h18" />
            <path d="M12 11v3" />
        </svg>
    );
}

export function GlobeIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z" />
        </svg>
    );
}

export function ChatIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12z" />
            <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.25" />
        </svg>
    );
}

export function ChevronRightIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="m9 6 6 6-6 6" />
        </svg>
    );
}

export const linkIcons: Record<LinkId, ComponentType<IconProps>> = {
    instagram: InstagramIcon,
    portfolio: BriefcaseIcon,
    site: GlobeIcon,
    contato: ChatIcon,
};
