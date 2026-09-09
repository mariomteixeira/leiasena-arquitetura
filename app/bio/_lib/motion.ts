import type { CSSProperties } from "react";

/** Stagger helper: sets the `--d` custom property read by the bio-* entrance classes. */
export const delay = (ms: number): CSSProperties =>
    ({ "--d": `${ms}ms` }) as CSSProperties;
