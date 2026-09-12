/**
 * A folha de contato é justificada: cada linha usa a largura inteira e todos os
 * quadros de uma linha ficam com a mesma altura, cada um na proporção nativa da
 * imagem. Com `flex-basis: 0` e `flex-grow: ratio`, a largura de cada quadro sai
 * proporcional ao seu ratio — a altura `w / ratio` é então igual para a linha
 * toda. Aqui só decidimos em quantas linhas a folha cabe.
 */

/** Divide os índices em `rows` linhas contíguas equilibrando a soma dos ratios. */
export function partitionBalanced(ratios: number[], rows: number): number[][] {
    const n = ratios.length;
    if (n === 0) return [];
    const r = Math.max(1, Math.min(rows, n));
    if (r >= n) return ratios.map((_, i) => [i]);

    const pre = [0];
    for (let i = 0; i < n; i += 1) pre.push(pre[i] + ratios[i]);
    const target = pre[n] / r;

    const cost: number[][] = Array.from({ length: r + 1 }, () => Array(n + 1).fill(Infinity));
    const cut: number[][] = Array.from({ length: r + 1 }, () => Array(n + 1).fill(0));
    cost[0][0] = 0;

    for (let k = 1; k <= r; k += 1) {
        for (let i = k; i <= n; i += 1) {
            for (let j = k - 1; j < i; j += 1) {
                if (cost[k - 1][j] === Infinity) continue;
                const sum = pre[i] - pre[j];
                const c = cost[k - 1][j] + (sum - target) ** 2;
                if (c < cost[k][i]) {
                    cost[k][i] = c;
                    cut[k][i] = j;
                }
            }
        }
    }

    const out: number[][] = [];
    let i = n;
    for (let k = r; k >= 1; k -= 1) {
        const j = cut[k][i];
        out.unshift(Array.from({ length: i - j }, (_, x) => j + x));
        i = j;
    }
    return out;
}

/** Altura de uma linha justificada na largura `w`. */
export function rowHeight(row: number[], ratios: number[], w: number, gap: number): number {
    const sum = row.reduce((a, i) => a + ratios[i], 0);
    return (w - (row.length - 1) * gap) / sum;
}

/**
 * Escolhe o maior número de linhas — ou seja, os maiores quadros — que ainda
 * deixa a folha legível de um golpe: nenhuma linha além da última pode ficar
 * abaixo da dobra, e a última precisa aparecer pelo menos em 30%.
 */
export function chooseRows(ratios: number[], w: number, avail: number, gap: number): number[][] {
    const minH = 118;
    const maxH = Math.min(440, avail * 0.8);
    let best: number[][] | null = null;

    for (let r = 1; r <= Math.min(ratios.length, 6); r += 1) {
        const rows = partitionBalanced(ratios, r);
        const hs = rows.map((row) => rowHeight(row, ratios, w, gap));
        if (Math.min(...hs) < minH || Math.max(...hs) > maxH) continue;
        const total = hs.reduce((a, b) => a + b, 0) + (rows.length - 1) * gap;
        const lastH = hs[hs.length - 1];
        const lastTop = total - lastH;
        if (lastTop > avail) continue;
        if (avail - lastTop < lastH * 0.3) continue;
        best = rows;
    }

    return best ?? partitionBalanced(ratios, Math.min(4, Math.max(1, Math.round(ratios.length / 4))));
}

/** Duas colunas iguais no celular, na ordem de leitura. */
export function pairRows(count: number): number[][] {
    const out: number[][] = [];
    for (let i = 0; i < count; i += 2) out.push(i + 1 < count ? [i, i + 1] : [i]);
    return out;
}

export function rowIndexOf(rows: number[][], index: number): number {
    for (let i = 0; i < rows.length; i += 1) if (rows[i].includes(index)) return i;
    return 0;
}
