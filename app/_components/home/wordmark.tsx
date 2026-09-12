import type { CSSProperties } from "react";
import wordmarkSvg from "./wordmark.svg";

/**
 * A assinatura horizontal da marca. O SVG e importado (nao vem de /public) para
 * sair no bundle junto com o resto — assets novos em /public nao chegam ao ar
 * nesta hospedagem. Entra como mascara CSS, entao assume `currentColor` e pode
 * ser azul no creme ou creme no azul sem precisar de um segundo arquivo.
 * A proporcao e a do viewBox original (13984.84 × 3503.73).
 */
export default function Wordmark({
    className = "",
    style,
    label = "Léia Sena Arquitetura",
}: {
    className?: string;
    style?: CSSProperties;
    label?: string;
}) {
    const mask = `url(${wordmarkSvg.src})`;
    return (
        <span
            role="img"
            aria-label={label}
            className={`block aspect-[13984.84/3503.73] bg-current ${className}`}
            style={{
                WebkitMaskImage: mask,
                maskImage: mask,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "left center",
                maskPosition: "left center",
                ...style,
            }}
        />
    );
}
