"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { CAMERA, FRAME, MOUNT_PAD, clamp, optimized, poseOf, type Print } from "./gallery-config";

export interface SceneInputs {
    /** scroll progress through the hero, 0..1 */
    progress: RefObject<number>;
    /** normalized pointer, -1..1 on both axes (y up) */
    pointer: RefObject<{ x: number; y: number }>;
}

/** One shared texture: a white mount with a soft drop shadow, stretched per print. */
function makeMountTexture() {
    const S = 512;
    const pad = Math.round(S * MOUNT_PAD);
    const c = document.createElement("canvas");
    c.width = S;
    c.height = S;
    const ctx = c.getContext("2d");
    if (ctx) {
        ctx.clearRect(0, 0, S, S);
        ctx.shadowColor = "rgba(23, 23, 23, 0.5)";
        ctx.shadowBlur = 34;
        ctx.shadowOffsetY = 12;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pad, pad, S - pad * 2, S - pad * 2);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillRect(pad, pad, S - pad * 2, S - pad * 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Prints({
    prints,
    compact,
    reduced,
    inputs,
    onReady,
}: {
    prints: Print[];
    compact: boolean;
    reduced: boolean;
    inputs: SceneInputs;
    onReady: () => void;
}) {
    const urls = useMemo(() => prints.map((p) => optimized(p.src, p.size)), [prints]);
    const textures = useTexture(urls);
    const mount = useMemo(makeMountTexture, []);
    const { camera, gl, invalidate } = useThree();
    const groups = useRef<(THREE.Group | null)[]>([]);
    const imgMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
    const mountMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
    const born = useRef<number | null>(null);
    const cam = compact ? CAMERA.mobile : CAMERA.desktop;

    useLayoutEffect(() => {
        const aniso = Math.min(4, gl.capabilities.getMaxAnisotropy());
        textures.forEach((t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = aniso;
            t.needsUpdate = true;
        });
    }, [textures, gl]);

    useEffect(() => {
        onReady();
    }, [onReady]);

    useEffect(() => () => mount.dispose(), [mount]);

    // Reduced motion: the frameloop is on demand, so redraw only when the page scrolls.
    useEffect(() => {
        if (!reduced) return;
        const on = () => invalidate();
        window.addEventListener("scroll", on, { passive: true });
        on();
        return () => window.removeEventListener("scroll", on);
    }, [reduced, invalidate]);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;
        const b = born.current ?? t;
        born.current = b;
        const k = reduced ? 1 : 1 - Math.exp(-delta * 7);
        const p = smooth(clamp(inputs.progress.current, 0, 1));
        const targetZ = cam.zStart + (cam.zEnd - cam.zStart) * p;
        const px = reduced || compact ? 0 : inputs.pointer.current.x;
        const py = reduced || compact ? 0 : inputs.pointer.current.y;

        camera.position.z += (targetZ - camera.position.z) * k;
        camera.position.x += (px * 0.28 - camera.position.x) * k * 0.6;
        camera.position.y += (py * 0.18 - camera.position.y) * k * 0.6;

        for (let i = 0; i < prints.length; i++) {
            const pr = prints[i];
            const g = groups.current[i];
            if (!pr || !g) continue;
            const pose = poseOf(pr, compact);
            const bob = reduced ? 0 : Math.sin(t * 0.55 + pr.phase) * 0.06;
            g.position.set(pose.x, pose.y + bob, pose.z);
            const ty = pose.yaw + px * 0.1;
            const tx = -py * 0.06;
            g.rotation.y += (ty - g.rotation.y) * k;
            g.rotation.x += (tx - g.rotation.x) * k;

            const d = camera.position.z - pose.z;
            const near = clamp((d - 0.7) / 1.3, 0, 1);
            const enter = reduced ? 1 : easeOut(clamp((t - b - i * 0.08) / 1.1, 0, 1));
            const o = near * enter;
            g.visible = o > 0.002;
            const im = imgMats.current[i];
            const mm = mountMats.current[i];
            if (im) im.opacity = o;
            if (mm) mm.opacity = o;
        }
    });

    return (
        <>
            {prints.map((pr, i) => {
                const pose = poseOf(pr, compact);
                const w = pose.w;
                const h = pose.w / pr.aspect;
                const mw = (w + FRAME * 2) / (1 - MOUNT_PAD * 2);
                const mh = (h + FRAME * 2) / (1 - MOUNT_PAD * 2);
                return (
                    <group
                        key={pr.id}
                        ref={(el) => {
                            groups.current[i] = el;
                        }}
                        position={[pose.x, pose.y, pose.z]}
                        rotation={[0, pose.yaw, 0]}
                    >
                        <mesh position={[0, 0, -0.008]}>
                            <planeGeometry args={[mw, mh]} />
                            <meshBasicMaterial
                                ref={(m) => {
                                    mountMats.current[i] = m;
                                }}
                                map={mount}
                                transparent
                                depthWrite={false}
                                toneMapped={false}
                                opacity={0}
                            />
                        </mesh>
                        <mesh>
                            <planeGeometry args={[w, h]} />
                            <meshBasicMaterial
                                ref={(m) => {
                                    imgMats.current[i] = m;
                                }}
                                map={textures[i]}
                                transparent
                                toneMapped={false}
                                opacity={0}
                            />
                        </mesh>
                    </group>
                );
            })}
        </>
    );
}
