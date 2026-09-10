/**
 * O trilho: catorze renders de pé sobre um mesmo piso, dispostos ao longo de um
 * arco. Cada painel guarda a proporção nativa da imagem — a altura no mundo é a
 * mesma para todos, a largura sai do `ratio` do manifesto. A câmera anda pelo
 * lado de dentro do arco, de estação em estação.
 *
 * Os mesmos dados alimentam a cena WebGL e o fallback estático em HTML.
 */
import { mixedSelection, type Shot } from "../_shared/gallery";

/** as catorze imagens do trilho, na ordem em que a câmera as encontra */
export const RAIL_SHOTS: Shot[] = mixedSelection(14);

export interface RailSpec {
    /** raio do arco onde ficam os painéis */
    radius: number;
    /** altura comum dos painéis, em unidades de mundo */
    cardH: number;
    /** folga entre painéis, em unidades de mundo (medida no arco) */
    gap: number;
    /** altura da câmera */
    camY: number;
    fov: number;
    /** recuo extra da câmera no meio do passo (o "abre a curva") */
    swing: number;
    /** guinada extra na direção da caminhada, em radianos */
    lead: number;
    /** raio dos cantos dos painéis, em unidades de mundo */
    corner: number;
    /** avanço do painel ativo sobre a própria normal */
    pop: number;
    /** largura da textura pedida ao otimizador do Next */
    texWidth: number;
    /** folga vertical ao enquadrar o painel ativo */
    fitH: number;
    /** folga horizontal ao enquadrar o painel mais largo */
    fitW: number;
}

export const RAIL: { desktop: RailSpec; mobile: RailSpec } = {
    desktop: { radius: 14, cardH: 2.6, gap: 0.95, camY: 0.1, fov: 38, swing: 1.75, lead: 0.05, corner: 0.145, pop: 0.34, texWidth: 640, fitH: 1.45, fitW: 1.1 },
    mobile: { radius: 8, cardH: 2.15, gap: 0.72, camY: 0.08, fov: 44, swing: 1.15, lead: 0.045, corner: 0.125, pop: 0.28, texWidth: 384, fitH: 1.3, fitW: 1.6 },
};

export interface Station {
    shot: Shot;
    /** largura do painel no mundo */
    w: number;
    /** altura do painel no mundo */
    h: number;
    /** posição do centro ao longo do arco */
    s: number;
    /** ângulo do centro, em radianos */
    phi: number;
}

/**
 * Ângulo de uma posição do arco. O sinal negativo põe os índices altos à
 * direita do ecrã: a câmera olha para fora do círculo, e nessa vista o seu
 * lado direito é o dos ângulos decrescentes.
 */
export const angleOf = (s: number, spec: RailSpec) => -s / spec.radius;

/** Distribui os painéis ao longo do arco com folga constante entre eles. */
export function layout(spec: RailSpec): Station[] {
    const raw: { shot: Shot; w: number; h: number; s: number }[] = [];
    let cursor = 0;
    RAIL_SHOTS.forEach((shot, i) => {
        const h = spec.cardH;
        const w = h * shot.ratio;
        if (i > 0) cursor += spec.gap + w / 2;
        raw.push({ shot, w, h, s: cursor });
        cursor += w / 2;
    });
    // centra o conjunto em torno de s = 0
    const mid = (raw[0].s + raw[raw.length - 1].s) / 2;
    return raw.map((st) => {
        const s = st.s - mid;
        return { ...st, s, phi: angleOf(s, spec) };
    });
}

/** Distância da câmera ao plano do painel, para o ativo caber com folga. */
export function viewDistance(spec: RailSpec, stations: Station[], aspect: number) {
    const maxW = stations.reduce((m, st) => Math.max(m, st.w), 0);
    const needV = Math.max(spec.cardH * spec.fitH, (maxW * spec.fitW) / Math.max(0.35, aspect));
    return needV / (2 * Math.tan((spec.fov * Math.PI) / 360));
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Exponential ease-out — rápido a sair, longo a assentar. */
export function easeOutExpo(t: number) {
    if (t >= 1) return 1;
    if (t <= 0) return 0;
    return (1 - Math.pow(2, -7 * t)) / (1 - Math.pow(2, -7));
}

/** Duração do passo: 900ms para um degrau, até 1100ms para saltos longos. */
export function stepDuration(steps: number) {
    return clamp(900 + (Math.abs(steps) - 1) * 70, 900, 1100);
}

/** Índice da estação mais próxima de uma posição contínua no arco. */
export function nearestStation(stations: Station[], s: number) {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < stations.length; i++) {
        const d = Math.abs(stations[i].s - s);
        if (d < bestD) {
            bestD = d;
            best = i;
        }
    }
    return best;
}

/** Posição fracionária (em estações) para uma posição contínua no arco. */
export function fractionalStation(stations: Station[], s: number) {
    if (s <= stations[0].s) return 0;
    const last = stations.length - 1;
    if (s >= stations[last].s) return last;
    for (let i = 0; i < last; i++) {
        const a = stations[i].s;
        const b = stations[i + 1].s;
        if (s >= a && s <= b) return i + (s - a) / (b - a);
    }
    return last;
}

/** Opacidade do painel pela distância (contínua) ao foco. */
export function panelOpacity(d: number) {
    if (d <= 1) return 1 - 0.45 * d;
    return Math.max(0, 0.55 - (d - 1) * 0.16);
}

export const twoDigits = (n: number) => String(n).padStart(2, "0");
