"use client";

/**
 * A lente: um único cartão de cantos arredondados que troca de proporção.
 * Entre a imagem A e a B a própria silhueta do plano interpola de uma razão
 * para a outra enquanto a câmera faz um dolly-zoom (recua e fecha o fov) e
 * gira ~6°, voltando exatamente ao enquadramento de repouso.
 */

import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { optimized, type Shot } from "../_shared/gallery";

export const REST_Z = 7.4;
export const REST_FOV = 34;
const DEG = Math.PI / 180;
const K = REST_Z * Math.tan((REST_FOV / 2) * DEG);
/** altura visível no plano do cartão (z = 0) */
const VIS_H = 2 * K;

const DUR = 0.82; // segundos
const DOLLY = 1.35; // unidades que a câmera recua no meio da transição
const YAW = 6 * DEG;

/* -------------------------------------------------------------- easing */

function makeEase(x1: number, y1: number, x2: number, y2: number) {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
    const sy = (t: number) => ((ay * t + by) * t + cy) * t;
    const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
    return (x: number) => {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        let t = x;
        for (let i = 0; i < 8; i += 1) {
            const d = dx(t);
            if (Math.abs(d) < 1e-6) break;
            const err = sx(t) - x;
            if (Math.abs(err) < 1e-6) break;
            t -= err / d;
        }
        return sy(Math.min(1, Math.max(0, t)));
    };
}
/** equivalente a cubic-bezier(0.16, 1, 0.3, 1) */
const EASE = makeEase(0.16, 1, 0.3, 1);

/* ------------------------------------------------- geometria do cartão */

const CORNER_SEG = 10;
const RING = 4 * (CORNER_SEG + 1);
/** sinal x, sinal y, ângulo inicial — canto superior direito primeiro, anti-horário */
const CORNERS: [number, number, number][] = [
    [1, 1, 0],
    [-1, 1, Math.PI / 2],
    [-1, -1, Math.PI],
    [1, -1, (3 * Math.PI) / 2],
];

function makeCardGeometry() {
    const g = new THREE.BufferGeometry();
    const count = RING + 1;
    const pos = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    const uv = new THREE.BufferAttribute(new Float32Array(count * 2), 2);
    pos.setUsage(THREE.DynamicDrawUsage);
    uv.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("position", pos);
    g.setAttribute("uv", uv);
    const idx: number[] = [];
    for (let i = 1; i <= RING; i += 1) idx.push(0, i, i === RING ? 1 : i + 1);
    g.setIndex(idx);
    return g;
}

/** reconstrói o retângulo arredondado com raio constante em unidades de mundo */
function updateCardGeometry(g: THREE.BufferGeometry, w: number, h: number, radius: number) {
    const r = Math.max(0.001, Math.min(radius, w / 2, h / 2));
    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    const uv = g.getAttribute("uv") as THREE.BufferAttribute;
    const cx = w / 2 - r;
    const cy = h / 2 - r;
    pos.setXYZ(0, 0, 0, 0);
    uv.setXY(0, 0.5, 0.5);
    let k = 1;
    for (const [sx, sy, a0] of CORNERS) {
        for (let s = 0; s <= CORNER_SEG; s += 1) {
            const a = a0 + (s / CORNER_SEG) * (Math.PI / 2);
            const x = sx * cx + Math.cos(a) * r;
            const y = sy * cy + Math.sin(a) * r;
            pos.setXYZ(k, x, y, 0);
            uv.setXY(k, x / w + 0.5, y / h + 0.5);
            k += 1;
        }
    }
    pos.needsUpdate = true;
    uv.needsUpdate = true;
    g.computeBoundingSphere();
}

/* ------------------------------------------------------------ auxiliares */

/** gradiente radial no alfa: chão macio e sombra de contato */
function radialAlpha(size: number, power: number) {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    if (ctx) {
        const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        for (let i = 0; i <= 24; i += 1) {
            const p = i / 24;
            const a = Math.max(0, Math.pow(1 - p, power)).toFixed(4);
            g.addColorStop(p, "rgba(255,255,255," + a + ")");
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
}

/** enquadra a textura como object-fit: cover na proporção corrente da caixa */
function coverFit(tex: THREE.Texture, imgRatio: number, boxRatio: number) {
    if (imgRatio > boxRatio) {
        const r = boxRatio / imgRatio;
        tex.repeat.set(r, 1);
        tex.offset.set((1 - r) / 2, 0);
    } else {
        const r = imgRatio / boxRatio;
        tex.repeat.set(1, r);
        tex.offset.set(0, (1 - r) / 2);
    }
}

function cardSize(ratio: number, maxW: number, maxH: number) {
    let h = maxH;
    let w = h * ratio;
    if (w > maxW) {
        w = maxW;
        h = w / ratio;
    }
    return { w, h };
}

/* ------------------------------------------------------------------ cena */

export default function LensScene({
    shots,
    index,
    dir,
    reduced,
    compact,
    onReady,
}: {
    shots: Shot[];
    index: number;
    dir: number;
    reduced: boolean;
    compact: boolean;
    onReady: () => void;
}) {
    const { size, gl, camera, invalidate } = useThree();
    const cam = camera as THREE.PerspectiveCamera;

    const geo = useMemo(makeCardGeometry, []);
    const pool = useMemo(() => radialAlpha(256, 1.6), []);
    const shade = useMemo(() => radialAlpha(256, 2.1), []);

    const cardRef = useRef<THREE.Group>(null);
    const shadowRef = useRef<THREE.Mesh>(null);
    const backMat = useRef<THREE.MeshBasicMaterial>(null);
    const frontMat = useRef<THREE.MeshBasicMaterial>(null);

    const from = useRef(index);
    const to = useRef(index);
    const dirRef = useRef(1);
    const t = useRef(1);
    const lastFov = useRef(REST_FOV);

    /* caixa disponível, derivada do enquadramento de repouso */
    const visW = VIS_H * (size.width / Math.max(1, size.height));
    const maxH = Math.min(compact ? 3.3 : 3.6, VIS_H * 0.86);
    const maxW = Math.min(compact ? 5.4 : 6.4, visW * 0.9);
    const baseY = -maxH / 2 - 0.06;
    /* mesmo raio, em pixels, dos cartões HTML da página */
    const radius = ((compact ? 16 : 22) * VIS_H) / Math.max(1, size.height);

    /* ---------------------------------------------------------- texturas */

    const cache = useRef(new Map<number, THREE.Texture>());
    const pending = useRef(new Set<number>());
    const fired = useRef(false);
    const texW = compact ? 828 : 1200;

    const ensure = useCallback(
        (i: number) => {
            if (i < 0 || i >= shots.length) return;
            if (cache.current.has(i) || pending.current.has(i)) return;
            pending.current.add(i);
            new THREE.TextureLoader().load(
                optimized(shots[i].src, texW),
                (tex) => {
                    // drei/useTexture não faz isto: sem sRGB a imagem sai lavada
                    tex.colorSpace = THREE.SRGBColorSpace;
                    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
                    tex.wrapS = THREE.ClampToEdgeWrapping;
                    tex.wrapT = THREE.ClampToEdgeWrapping;
                    tex.needsUpdate = true;
                    pending.current.delete(i);
                    cache.current.set(i, tex);
                    invalidate();
                    if (!fired.current) {
                        fired.current = true;
                        onReady();
                    }
                },
                undefined,
                () => pending.current.delete(i),
            );
        },
        [shots, texW, gl, invalidate, onReady],
    );

    /* ------------------------------------------------------- transição */

    useEffect(() => {
        if (index === to.current) return;
        dirRef.current = dir >= 0 ? 1 : -1;
        from.current = to.current;
        to.current = index;
        t.current = reduced ? 1 : 0;
        invalidate();
    }, [index, dir, reduced, invalidate]);

    useEffect(() => {
        const n = shots.length;
        ensure(index);
        ensure((index + 1) % n);
        ensure((index - 1 + n) % n);
        const keep = new Set([index, (index + 1) % n, (index - 1 + n) % n, (index + 2) % n, from.current, to.current]);
        for (const [k, tex] of cache.current) {
            if (!keep.has(k)) {
                tex.dispose();
                cache.current.delete(k);
            }
        }
    }, [index, ensure, shots.length]);

    useEffect(() => {
        invalidate();
    }, [invalidate, size.width, size.height]);

    useEffect(() => {
        const textures = cache.current;
        return () => {
            for (const tex of textures.values()) tex.dispose();
            textures.clear();
            geo.dispose();
            pool.dispose();
            shade.dispose();
        };
    }, [geo, pool, shade]);

    /* ------------------------------------------------------------ frame */

    useFrame((_, delta) => {
        if (t.current < 1) t.current = Math.min(1, t.current + delta / DUR);
        const raw = t.current;
        const e = reduced ? 1 : EASE(raw);

        const a = shots[from.current] ?? shots[0];
        const b = shots[to.current] ?? shots[0];
        const sa = cardSize(a.ratio, maxW, maxH);
        const sb = cardSize(b.ratio, maxW, maxH);
        const w = sa.w + (sb.w - sa.w) * e;
        const h = sa.h + (sb.h - sa.h) * e;

        updateCardGeometry(geo, w, h, radius);
        if (cardRef.current) cardRef.current.position.y = baseY + h / 2;

        const boxRatio = w / h;
        const texA = cache.current.get(from.current) ?? null;
        const texB = cache.current.get(to.current) ?? null;
        if (texA) coverFit(texA, a.ratio, boxRatio);
        if (texB) coverFit(texB, b.ratio, boxRatio);

        const back = backMat.current;
        const front = frontMat.current;
        if (back) {
            if (back.map !== texA) {
                back.map = texA;
                back.color.set(texA ? 0xffffff : 0xddd9ce);
                back.needsUpdate = true;
            }
            back.opacity = 1;
        }
        if (front) {
            if (front.map !== texB) {
                front.map = texB;
                front.color.set(texB ? 0xffffff : 0xddd9ce);
                front.needsUpdate = true;
            }
            front.opacity = texB ? e : 0;
        }

        if (shadowRef.current) {
            shadowRef.current.scale.set(w * 1.5, 1.5, 1);
            shadowRef.current.position.y = baseY + 0.004;
        }

        // dolly-zoom: um sino que vale 0 nas duas pontas, então não há deriva
        const bell = reduced ? 0 : 0.5 - 0.5 * Math.cos(2 * Math.PI * raw);
        const z = REST_Z + DOLLY * bell;
        const yaw = YAW * bell * dirRef.current;
        cam.position.set(Math.sin(yaw) * z, 0, Math.cos(yaw) * z);
        cam.lookAt(0, 0, 0);
        const fov = (2 * Math.atan(K / z)) / DEG;
        if (Math.abs(fov - lastFov.current) > 1e-4) {
            cam.fov = fov;
            cam.updateProjectionMatrix();
            lastFov.current = fov;
        }
    });

    return (
        <>
            {/* chão de gelo: uma poça macia, para o cartão não virar adesivo */}
            <mesh renderOrder={0} rotation={[-Math.PI / 2, 0, 0]} position={[0, baseY, -0.3]}>
                <planeGeometry args={[13, 7.5]} />
                <meshBasicMaterial
                    color="#ddd9ce"
                    alphaMap={pool}
                    transparent
                    opacity={0.9}
                    depthTest={false}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* sombra de contato, acompanhando a largura do cartão */}
            <mesh ref={shadowRef} renderOrder={1} rotation={[-Math.PI / 2, 0, 0]} position={[0, baseY + 0.004, 0.06]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial
                    color="#313c59"
                    alphaMap={shade}
                    transparent
                    opacity={0.34}
                    depthTest={false}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            <group ref={cardRef}>
                <mesh renderOrder={2} geometry={geo}>
                    <meshBasicMaterial
                        ref={backMat}
                        color="#ddd9ce"
                        transparent
                        opacity={1}
                        depthTest={false}
                        depthWrite={false}
                        toneMapped={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                <mesh renderOrder={3} geometry={geo} position={[0, 0, 0.002]}>
                    <meshBasicMaterial
                        ref={frontMat}
                        color="#ddd9ce"
                        transparent
                        opacity={0}
                        depthTest={false}
                        depthWrite={false}
                        toneMapped={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>
        </>
    );
}
