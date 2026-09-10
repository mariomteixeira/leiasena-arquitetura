/**
 * Manifesto das 38 imagens dos quatro projetos, com as dimensões reais lidas
 * do arquivo (não estimadas). Serve para montar cards que mantêm a proporção
 * nativa de cada render, como na referência de cards arredondados.
 */
import { projects } from "../../_lib/projects";

export type Shape = "wide" | "square" | "portrait" | "boxy";

export interface Shot {
    /** caminho público do PNG */
    src: string;
    slug: string;
    /** título do projeto a que pertence */
    project: string;
    /** índice dentro do projeto, começando em 1 */
    index: number;
    width: number;
    height: number;
    /** largura / altura */
    ratio: number;
    shape: Shape;
}

/** width,height por arquivo, na ordem 01..NN de cada pasta. */
const DIMS: Record<string, [number, number][]> = {
    Anny: [
        [3840, 2160], [3840, 2160], [3840, 2160], [3840, 2160], [3840, 2160], [3840, 2160],
        [4080, 4080], [3840, 2160], [3840, 2160], [3840, 2160], [3840, 2160], [3840, 2160],
    ],
    Debora: [
        [2000, 1125], [2000, 1125], [2000, 1125], [2000, 1125],
        [2000, 2500], [2000, 2500], [2000, 1125], [2000, 1500],
    ],
    Felipe: [
        [2688, 1536], [2688, 1536], [3840, 2160], [3840, 2160],
        [3840, 2160], [3840, 2160], [3840, 2160], [2000, 2500],
    ],
    Gustavo: [
        [2176, 1856], [2048, 1152], [2048, 1152], [2048, 1152], [2048, 1152],
        [2048, 1152], [2048, 1152], [2048, 2048], [2048, 2048], [2688, 1472],
    ],
};

/** pasta pública de cada slug */
const FOLDER: Record<string, string> = { anny: "Anny", debora: "Debora", felipe: "Felipe", gustavo: "Gustavo" };

function shapeOf(ratio: number): Shape {
    if (ratio < 0.95) return "portrait";
    if (ratio < 1.12) return "square";
    if (ratio < 1.45) return "boxy";
    return "wide";
}

export const SHOTS: Shot[] = projects.flatMap((p) => {
    const folder = FOLDER[p.slug];
    const dims = DIMS[folder] ?? [];
    return dims.map(([width, height], i) => {
        const ratio = width / height;
        return {
            src: `/assets/projetos/${folder}/${String(i + 1).padStart(2, "0")}.png`,
            slug: p.slug,
            project: p.title,
            index: i + 1,
            width,
            height,
            ratio,
            shape: shapeOf(ratio),
        };
    });
});

export const byProject = (slug: string) => SHOTS.filter((s) => s.slug === slug);
export const byShape = (shape: Shape) => SHOTS.filter((s) => s.shape === shape);

/**
 * Uma seleção variada para carrosséis: alterna projetos e formatos, começando
 * pelas capas. Devolve `count` imagens sem repetir.
 */
export function mixedSelection(count = 14): Shot[] {
    const covers = SHOTS.filter((s) => s.index === 1);
    const rest = SHOTS.filter((s) => s.index !== 1);
    const buckets: Record<string, Shot[]> = {};
    for (const s of rest) (buckets[s.slug] ??= []).push(s);
    // dá prioridade a formatos incomuns, que é o que faz a fita variar
    for (const slug of Object.keys(buckets)) {
        buckets[slug].sort((a, b) => {
            const rank = (s: Shot) => (s.shape === "wide" ? 2 : s.shape === "boxy" ? 1 : 0);
            return rank(a) - rank(b);
        });
    }
    const out: Shot[] = [...covers];
    const slugs = Object.keys(buckets);
    let i = 0;
    while (out.length < count) {
        const slug = slugs[i % slugs.length];
        const next = buckets[slug].shift();
        if (next) out.push(next);
        else if (slugs.every((s) => buckets[s].length === 0)) break;
        i += 1;
    }
    return out.slice(0, count);
}

/** URL do otimizador do Next para um PNG grande. */
export function optimized(src: string, w = 1080, q = 75) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;
}
