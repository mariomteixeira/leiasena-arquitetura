import { brand, copy, projects, type Project } from "../_shared/content";

export { brand, copy, projects };
export type { Project };

/** Real pixel size of each cover, read from the PNG headers (IHDR). */
export const coverSize: Record<string, { w: number; h: number }> = {
    anny: { w: 3840, h: 2160 },
    debora: { w: 2000, h: 1125 },
    felipe: { w: 2688, h: 1536 },
    gustavo: { w: 2176, h: 1856 },
};

/** Real pixel size of /assets/images/about.jpg. */
export const portraitSize = { w: 1440, h: 1800 };

export const pad = (n: number) => String(n).padStart(2, "0");

export const px = (s: { w: number; h: number }) => `${s.w} × ${s.h} px`;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** Exact aspect ratio of a pixel size, reduced. */
export const ratio = (s: { w: number; h: number }) => {
    const g = gcd(s.w, s.h);
    return `${s.w / g} : ${s.h / g}`;
};

/** The set: four sheets, numbered by position. */
export const sheets = [
    { id: "home", name: "Projeto Anny" },
    { id: "projects", name: "Projetos" },
    { id: "about", name: "Memorial" },
    { id: "contact", name: "Contato" },
] as const;

export const TOTAL = sheets.length;

export const sheetNo = (id: (typeof sheets)[number]["id"]) =>
    `${pad(sheets.findIndex((s) => s.id === id) + 1)}/${pad(TOTAL)}`;

export const totalImages = projects.reduce((n, p) => n + p.images.length, 0);

/** Resized source for a large PNG, through the Next image optimizer. */
export const sized = (src: string, w: number, q = 75) =>
    `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;
