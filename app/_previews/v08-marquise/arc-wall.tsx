"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { FRAME, PANELS, WALL, clamp, optimized, thetaStart } from "./wall-config";

export interface WallInput {
    /** ponteiro normalizado, -1..1 */
    pointer: number;
    /** giro acumulado do arraste, em radianos */
    drag: number;
}

/** Máscara de arco (cantos de cima totalmente arredondados) no canal alfa. */
function archMask(width: number, height: number, arc: number) {
    const W = 512;
    const H = Math.max(8, Math.round((W * height) / width));
    const ry = clamp((arc / height) * H, 2, H);
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(0, ry);
        ctx.ellipse(W / 2, ry, W / 2, ry, 0, Math.PI, 0);
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
}

/** enquadra a textura como object-fit: cover dentro do painel */
function cover(tex: THREE.Texture, imgAspect: number, panelAspect: number) {
    if (imgAspect > panelAspect) {
        const r = panelAspect / imgAspect;
        tex.repeat.set(r, 1);
        tex.offset.set((1 - r) / 2, 0);
    } else {
        const r = imgAspect / panelAspect;
        tex.repeat.set(1, r);
        tex.offset.set(0, (1 - r) / 2);
    }
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function ArcWall({
    compact,
    reduced,
    input,
    onReady,
}: {
    compact: boolean;
    reduced: boolean;
    input: RefObject<WallInput>;
    onReady: () => void;
}) {
    const spec = compact ? WALL.mobile : WALL.desktop;
    const urls = useMemo(() => PANELS.map((p) => optimized(p.src, compact ? 828 : 1080)), [compact]);
    const textures = useTexture(urls);
    const { gl, invalidate } = useThree();

    const w = spec.radius * spec.theta;
    const h = w / spec.aspect;
    const arc = Math.min(w / 2, h * 0.55);

    const frameRadius = spec.radius - 0.05;
    const frameTheta = spec.theta + (2 * FRAME) / frameRadius;
    const frameH = h + 2 * FRAME;
    const frameW = frameRadius * frameTheta;
    const frameArc = arc + FRAME;

    const masks = useMemo(() => {
        const img = archMask(w, h, arc);
        const frame = archMask(frameW, frameH, frameArc);
        return { img, frame };
    }, [w, h, arc, frameW, frameH, frameArc]);

    const group = useRef<THREE.Group>(null);
    const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
    const frameMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
    const born = useRef<number | null>(null);

    useLayoutEffect(() => {
        const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
        textures.forEach((t, i) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = aniso;
            cover(t, PANELS[i]?.imgAspect ?? 16 / 9, spec.aspect);
            t.needsUpdate = true;
        });
        invalidate();
    }, [textures, gl, spec.aspect, invalidate]);

    useEffect(() => {
        onReady();
        const id = window.setTimeout(() => invalidate(), 60);
        return () => window.clearTimeout(id);
    }, [onReady, invalidate]);

    useEffect(() => {
        const { img, frame } = masks;
        return () => {
            img.dispose();
            frame.dispose();
        };
    }, [masks]);

    useFrame((state, delta) => {
        const g = group.current;
        if (!g) return;
        const t = state.clock.elapsedTime;
        const b = born.current ?? t;
        born.current = b;

        const still = reduced || compact;
        const sway = still ? 0 : Math.sin(t * 0.16) * 0.09;
        const target = sway + (still ? 0 : -input.current.pointer * 0.26) + input.current.drag;
        const k = reduced ? 1 : 1 - Math.exp(-delta * 2.6);
        g.rotation.y += (target - g.rotation.y) * k;

        for (let i = 0; i < PANELS.length; i++) {
            const enter = reduced ? 1 : easeOut(clamp((t - b - i * 0.13) / 1.25, 0, 1));
            const m = mats.current[i];
            const fm = frameMats.current[i];
            if (m) m.opacity = enter;
            if (fm) fm.opacity = enter;
        }
    });

    return (
        <group ref={group}>
            {PANELS.map((p, i) => {
                const ts = thetaStart(i, PANELS.length, spec);
                const fts = ts - (frameTheta - spec.theta) / 2;
                return (
                    <group key={p.slug}>
                        <mesh renderOrder={1}>
                            <cylinderGeometry
                                args={[frameRadius, frameRadius, frameH, 40, 1, true, fts, frameTheta]}
                            />
                            <meshBasicMaterial
                                ref={(m) => {
                                    frameMats.current[i] = m;
                                }}
                                color="#f4f1ea"
                                alphaMap={masks.frame}
                                transparent
                                opacity={0}
                                depthWrite={false}
                                toneMapped={false}
                                side={THREE.FrontSide}
                            />
                        </mesh>
                        <mesh renderOrder={2}>
                            <cylinderGeometry args={[spec.radius, spec.radius, h, 40, 1, true, ts, spec.theta]} />
                            <meshBasicMaterial
                                ref={(m) => {
                                    mats.current[i] = m;
                                }}
                                map={textures[i]}
                                alphaMap={masks.img}
                                transparent
                                opacity={0}
                                depthWrite={false}
                                toneMapped={false}
                                side={THREE.FrontSide}
                            />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}
