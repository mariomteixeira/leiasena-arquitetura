"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { optimized } from "../_shared/gallery";
import {
    angleOf,
    clamp,
    easeOutExpo,
    fractionalStation,
    panelOpacity,
    stepDuration,
    viewDistance,
    type RailSpec,
    type Station,
} from "./rail-config";

/** Canal de comunicação entre os controlos em HTML e a câmera da cena. */
export interface RailDrive {
    /** posição contínua da câmera ao longo do arco (escrita pela cena) */
    s: number;
    /** true enquanto o ponteiro arrasta o trilho */
    dragging: boolean;
    /** posição pedida pelo arraste, em unidades de arco */
    dragS: number;
    /** pede um quadro — necessário sob prefers-reduced-motion (frameloop "demand") */
    invalidate: (() => void) | null;
}

const CREAM = "#f4f1ea";

/**
 * Luz do piso. A difusa do three é dividida por PI, portanto o piso creme só
 * bate certo com o creme da página quando (ambiente + N·L * direcional) = PI.
 * Sem isso a laje aparece como um retângulo cinzento dentro da página.
 */
const LIGHT = { ambient: 2.252, directional: 1.25, from: [7, 11, 5] as const };

/* ------------------------------------------------------------------ máscaras */

function roundRectPath(ctx: CanvasRenderingContext2D, w: number, h: number, r: number) {
    const rr = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(rr, 0);
    ctx.arcTo(w, 0, w, h, rr);
    ctx.arcTo(w, h, 0, h, rr);
    ctx.arcTo(0, h, 0, 0, rr);
    ctx.arcTo(0, 0, w, 0, rr);
    ctx.closePath();
}

/**
 * Máscara alfa de retângulo arredondado. O fundo é preto opaco e a forma é
 * branca, para que a suavização das bordas chegue ao canal verde (o que o
 * `alphaMap` do three lê) em vez de ficar só no alfa da canvas.
 */
function roundedMask(ratio: number, cornerFraction: number) {
    const W = 512;
    const H = Math.max(8, Math.round(W / ratio));
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ffffff";
        roundRectPath(ctx, W, H, cornerFraction * H);
        ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
}

/** Mancha suave: escura junto ao pé do painel, dissolvendo-se para os lados. */
function blobTexture() {
    const N = 128;
    const c = document.createElement("canvas");
    c.width = N;
    c.height = N;
    const ctx = c.getContext("2d");
    if (ctx) {
        const img = ctx.createImageData(N, N);
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                const u = (x + 0.5) / N;
                const v = (y + 0.5) / N;
                const du = Math.abs(u * 2 - 1);
                const dv = Math.abs(v * 2 - 1);
                const au = Math.pow(Math.max(0, 1 - Math.pow(du, 3.2)), 1.1);
                const av = Math.pow(Math.max(0, 1 - dv), 1.9);
                const a = Math.round(255 * au * av);
                const i = (y * N + x) * 4;
                img.data[i] = a;
                img.data[i + 1] = a;
                img.data[i + 2] = a;
                img.data[i + 3] = 255;
            }
        }
        ctx.putImageData(img, 0, 0);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
}

/** Disco do piso com desvanecimento radial, para não deixar uma aresta dura. */
function groundFade() {
    const N = 256;
    const c = document.createElement("canvas");
    c.width = N;
    c.height = N;
    const ctx = c.getContext("2d");
    if (ctx) {
        const g = ctx.createRadialGradient(N / 2, N / 2, N * 0.06, N / 2, N / 2, N / 2);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(0.52, "#ffffff");
        g.addColorStop(0.74, "#b4b4b4");
        g.addColorStop(0.92, "#000000");
        g.addColorStop(1, "#000000");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, N, N);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
}

/* ------------------------------------------------------------------- sombras */

/** Uma única geometria com um quadrilátero por painel, deitado no piso. */
function shadowGeometry(stations: Station[], spec: RailSpec, groundY: number) {
    const n = stations.length;
    const pos = new Float32Array(n * 4 * 3);
    const uv = new Float32Array(n * 4 * 2);
    const idx = new Uint16Array(n * 6);
    const depth = spec.cardH * 0.55;
    const y = groundY + 0.004;

    stations.forEach((st, i) => {
        const phi = st.phi;
        const sx = Math.sin(phi);
        const cz = Math.cos(phi);
        // tangente do arco e normal virada para dentro
        const tx = Math.cos(phi);
        const tz = -Math.sin(phi);
        const nx = -sx;
        const nz = -cz;
        const cxw = spec.radius * sx;
        const czw = spec.radius * cz;
        const hw = (st.w / 2) * 1.1;

        const corners: [number, number][] = [
            [-hw, -depth],
            [hw, -depth],
            [hw, depth],
            [-hw, depth],
        ];
        corners.forEach(([a, b], k) => {
            const o = (i * 4 + k) * 3;
            pos[o] = cxw + tx * a + nx * b;
            pos[o + 1] = y;
            pos[o + 2] = czw + tz * a + nz * b;
            const uo = (i * 4 + k) * 2;
            uv[uo] = (a / hw + 1) / 2;
            uv[uo + 1] = (b / depth + 1) / 2;
        });

        const base = i * 4;
        const io = i * 6;
        idx[io] = base;
        idx[io + 1] = base + 1;
        idx[io + 2] = base + 2;
        idx[io + 3] = base;
        idx[io + 4] = base + 2;
        idx[io + 5] = base + 3;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    return geo;
}

/* --------------------------------------------------------------------- cena */

export default function RailScene({
    stations,
    spec,
    index,
    reduced,
    drive,
    onS,
    onReady,
}: {
    stations: Station[];
    spec: RailSpec;
    index: number;
    reduced: boolean;
    drive: RefObject<RailDrive>;
    /** avisa a UI da posição fracionária corrente (usado para o contador) */
    onS: (s: number) => void;
    onReady: () => void;
}) {
    const urls = useMemo(
        () => stations.map((st) => optimized(st.shot.src, spec.texWidth)),
        [stations, spec.texWidth],
    );
    const textures = useTexture(urls);
    const { camera, gl, size, invalidate } = useThree();

    const groundY = -spec.cardH / 2;

    /* uma máscara por proporção distinta */
    const masks = useMemo(() => {
        const cornerFraction = spec.corner / spec.cardH;
        const map = new Map<string, THREE.Texture>();
        for (const st of stations) {
            const key = st.shot.ratio.toFixed(4);
            if (!map.has(key)) map.set(key, roundedMask(st.shot.ratio, cornerFraction));
        }
        return map;
    }, [stations, spec.corner, spec.cardH]);

    const blob = useMemo(() => blobTexture(), []);
    const fade = useMemo(() => groundFade(), []);
    const shadowGeo = useMemo(() => shadowGeometry(stations, spec, groundY), [stations, spec, groundY]);

    useEffect(() => {
        return () => {
            masks.forEach((m) => m.dispose());
            blob.dispose();
            fade.dispose();
            shadowGeo.dispose();
        };
    }, [masks, blob, fade, shadowGeo]);

    /* distância da câmera ao trilho, a partir do formato real da tela */
    const camRadius = useMemo(() => {
        const aspect = size.height > 0 ? size.width / size.height : 1.6;
        return spec.radius - viewDistance(spec, stations, aspect);
    }, [spec, stations, size.width, size.height]);

    const meshes = useRef<(THREE.Mesh | null)[]>([]);
    const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
    const sRef = useRef(stations[index]?.s ?? 0);
    const anim = useRef({ from: 0, to: 0, t0: 0, dur: 0, dir: 1, active: false });
    const lastReport = useRef(-1);

    useLayoutEffect(() => {
        const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
        textures.forEach((t) => {
            // drei não define o espaço de cor: sem isto os renders saem lavados
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = aniso;
            t.needsUpdate = true;
        });
        invalidate();
    }, [textures, gl, invalidate]);

    useEffect(() => {
        if (drive.current) drive.current.invalidate = invalidate;
        onReady();
        const id = window.setTimeout(() => invalidate(), 60);
        return () => window.clearTimeout(id);
    }, [drive, invalidate, onReady, onS]);

    /* um novo índice arranca uma caminhada; sob movimento reduzido, salta */
    useEffect(() => {
        const target = stations[index];
        if (!target) return;
        if (reduced) {
            sRef.current = target.s;
            anim.current.active = false;
        } else {
            const from = sRef.current;
            const steps = Math.max(1, Math.abs(target.s - from) / Math.max(0.001, stations[1].s - stations[0].s));
            anim.current = {
                from,
                to: target.s,
                t0: performance.now(),
                dur: stepDuration(steps),
                dir: Math.sign(target.s - from) || 1,
                active: Math.abs(target.s - from) > 1e-4,
            };
        }
        invalidate();
    }, [index, stations, reduced, invalidate]);

    useFrame(() => {
        const d = drive.current;
        let bump = 0;
        let lead = 0;
        let s = sRef.current;

        if (d?.dragging) {
            anim.current.active = false;
            s = clamp(d.dragS, stations[0].s, stations[stations.length - 1].s);
        } else if (anim.current.active) {
            const a = anim.current;
            const t = clamp((performance.now() - a.t0) / a.dur, 0, 1);
            const e = easeOutExpo(t);
            s = a.from + (a.to - a.from) * e;
            // a curva abre no meio do percurso e volta a fechar
            bump = Math.pow(Math.sin(Math.PI * e), 0.7);
            // a guinada aponta para onde a caminhada vai (o ângulo decresce quando s cresce)
            lead = -a.dir * spec.lead * bump;
            if (t >= 1) {
                a.active = false;
                s = a.to;
            }
        }

        sRef.current = s;
        if (d) d.s = s;

        const angle = angleOf(s, spec);
        const r = camRadius - spec.swing * bump;
        camera.position.set(Math.sin(angle) * r, spec.camY, Math.cos(angle) * r);
        const look = angle + lead;
        camera.lookAt(Math.sin(look) * spec.radius, 0, Math.cos(look) * spec.radius);

        const f = fractionalStation(stations, s);
        if (Math.abs(f - lastReport.current) > 0.01) {
            lastReport.current = f;
            onS(f);
        }

        for (let i = 0; i < stations.length; i++) {
            const dist = Math.abs(i - f);
            const op = panelOpacity(dist);
            const m = mats.current[i];
            const mesh = meshes.current[i];
            if (m) m.opacity = op;
            if (mesh) {
                mesh.visible = op > 0.004;
                const st = stations[i];
                const pop = spec.pop * Math.max(0, 1 - dist);
                mesh.position.set(
                    (spec.radius - pop) * Math.sin(st.phi),
                    0,
                    (spec.radius - pop) * Math.cos(st.phi),
                );
            }
        }
    });

    return (
        <group>
            <ambientLight intensity={LIGHT.ambient} />
            <directionalLight position={[...LIGHT.from]} intensity={LIGHT.directional} />

            {/* piso creme, com desvanecimento radial para não fechar num disco */}
            <mesh rotation-x={-Math.PI / 2} position-y={groundY} renderOrder={-2}>
                <circleGeometry args={[spec.radius * 1.85, 72]} />
                <meshStandardMaterial
                    color={CREAM}
                    roughness={1}
                    metalness={0}
                    alphaMap={fade}
                    transparent
                    depthWrite={false}
                    toneMapped={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* sombra de contacto: um quadrilátero por painel, num só desenho */}
            <mesh geometry={shadowGeo} renderOrder={-1}>
                <meshBasicMaterial
                    color="#313c59"
                    alphaMap={blob}
                    transparent
                    opacity={0.45}
                    depthWrite={false}
                    toneMapped={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {stations.map((st, i) => (
                <mesh
                    key={`${st.shot.src}-${i}`}
                    ref={(m) => {
                        meshes.current[i] = m;
                    }}
                    position={[spec.radius * Math.sin(st.phi), 0, spec.radius * Math.cos(st.phi)]}
                    rotation-y={st.phi + Math.PI}
                >
                    <planeGeometry args={[st.w, st.h]} />
                    <meshBasicMaterial
                        ref={(m) => {
                            mats.current[i] = m;
                        }}
                        map={textures[i]}
                        alphaMap={masks.get(st.shot.ratio.toFixed(4))}
                        transparent
                        opacity={1}
                        depthWrite={false}
                        toneMapped={false}
                        side={THREE.FrontSide}
                    />
                </mesh>
            ))}
        </group>
    );
}
