/**
 * A parede curva do hero: quatro capas como segmentos de um mesmo cilindro.
 * Os mesmos dados alimentam a cena WebGL e o fallback estático em HTML.
 */
import { projects } from "../_shared/content";

export interface WallSpec {
    /** raio do cilindro */
    radius: number;
    /** arco de cada painel, em radianos */
    theta: number;
    /** folga entre painéis, em radianos */
    gap: number;
    /** largura / altura do painel */
    aspect: number;
    /** posição z da câmera */
    camZ: number;
    fov: number;
}

export const WALL: { desktop: WallSpec; mobile: WallSpec } = {
    desktop: { radius: 3.2, theta: 0.55, gap: 0.15, aspect: 1.2, camZ: 6.4, fov: 38 },
    mobile: { radius: 2.9, theta: 0.6, gap: 0.16, aspect: 0.75, camZ: 7.7, fov: 44 },
};

/** margem creme ao redor de cada painel, em unidades de mundo */
export const FRAME = 0.09;
/** limite do arraste / do giro, em radianos */
export const SPIN_LIMIT = 0.55;

export interface Panel {
    slug: string;
    title: string;
    src: string;
    /** largura / altura do render original */
    imgAspect: number;
}

const aspects: Record<string, number> = {
    anny: 16 / 9,
    debora: 16 / 9,
    felipe: 7 / 4,
    gustavo: 2176 / 1856,
};

export const PANELS: Panel[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    src: p.cover,
    imgAspect: aspects[p.slug] ?? 16 / 9,
}));

export function optimized(src: string, w = 1080) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
}

export function clamp(v: number, a: number, b: number) {
    return Math.min(b, Math.max(a, v));
}

/** ângulo inicial de cada painel, centrado em torno de theta = 0 (frente da câmera) */
export function thetaStart(i: number, count: number, spec: WallSpec) {
    const step = spec.theta + spec.gap;
    const total = count * spec.theta + (count - 1) * spec.gap;
    return -total / 2 + i * step;
}
