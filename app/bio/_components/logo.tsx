import type { CSSProperties } from "react";
import logoSvg from "./vertical-azul.svg";

/**
 * Vertical lockup rendered through a CSS mask so it takes `currentColor`.
 * The SVG is imported (not served from /public) so the build emits it under
 * /_next/static/media with the rest of the bundle.
 * Aspect ratio matches the source viewBox (5906 × 4556).
 */
export default function Logo({ className = "", style }: { className?: string; style?: CSSProperties }) {
    const mask = `url(${logoSvg.src})`;
    return (
        <span
            role="img"
            aria-label="Léia Sena Arquitetura"
            className={`block aspect-[5906/4556] bg-current ${className}`}
            style={{
                WebkitMaskImage: mask,
                maskImage: mask,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                ...style,
            }}
        />
    );
}
