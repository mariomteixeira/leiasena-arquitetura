"use client";

import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Edges, useTexture } from "@react-three/drei";

const NAVY = "#313c59";
const BOARD = "#f6f4ee";

const PLINTH = { w: 4.4, t: 0.16, d: 3.3 };
const TOP = PLINTH.t / 2;

type Block = { x: number; z: number; w: number; h: number; d: number };

/** A small quadra of abstract volumes. Not a real building. */
const BLOCKS: Block[] = [
    { x: -1.35, z: -0.75, w: 0.9, h: 2.2, d: 0.9 },
    { x: -0.2, z: -0.85, w: 1.0, h: 1.35, d: 0.7 },
    { x: 1.15, z: -0.8, w: 1.4, h: 0.9, d: 0.8 },
    { x: 1.1, z: 0.55, w: 1.25, h: 1.7, d: 0.8 },
    { x: -1.35, z: 0.65, w: 0.9, h: 0.55, d: 0.9 },
    { x: -0.15, z: 0.75, w: 1.05, h: 0.75, d: 0.65 },
    { x: -0.05, z: -0.05, w: 0.42, h: 1.05, d: 0.42 },
];
const FACADE = BLOCKS[3];

/** The Anny cover glued on the front face of one block, like a printed render on model board. */
function Facade({ url }: { url: string }) {
    const tex = useTexture(url);
    const pw = FACADE.w * 0.86;
    const ph = FACADE.h * 0.86;

    useLayoutEffect(() => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const rx = pw / ph / (16 / 9);
        tex.repeat.set(rx, 1);
        tex.offset.set((1 - rx) / 2, 0);
        tex.needsUpdate = true;
    }, [tex, pw, ph]);

    return (
        <mesh position={[FACADE.x, TOP + FACADE.h / 2, FACADE.z + FACADE.d / 2 + 0.004]}>
            <planeGeometry args={[pw, ph]} />
            <meshStandardMaterial map={tex} roughness={0.75} />
        </mesh>
    );
}

export default function Model({ mobile, textureUrl }: { mobile: boolean; textureUrl: string }) {
    const spin = useRef<THREE.Group>(null);
    const tilt = useRef<THREE.Group>(null);
    const pointer = useRef({ x: 0, y: 0 });
    const viewport = useThree((s) => s.viewport);
    const camera = useThree((s) => s.camera);
    const gl = useThree((s) => s.gl);
    const setFrameloop = useThree((s) => s.setFrameloop);

    useEffect(() => {
        camera.lookAt(0, 0, 0);
    }, [camera]);

    // Pointer parallax: desktop only, read from the whole window so the text side counts too.
    useEffect(() => {
        if (mobile) return;
        const onMove = (e: PointerEvent) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [mobile]);

    // Stop the render loop while the canvas is offscreen; respect reduced motion when it returns.
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const io = new IntersectionObserver(
            ([entry]) => {
                setFrameloop(entry.isIntersecting ? (mq.matches ? "demand" : "always") : "never");
            },
            { threshold: 0.02 },
        );
        io.observe(gl.domElement);
        return () => io.disconnect();
    }, [gl, setFrameloop]);

    useFrame((_, delta) => {
        const dt = Math.min(delta, 0.05);
        if (spin.current) spin.current.rotation.y += dt * (mobile ? 0.07 : 0.14);
        if (tilt.current) {
            const tx = mobile ? 0 : pointer.current.y * 0.07;
            const ty = mobile ? 0 : pointer.current.x * 0.14;
            tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, tx, 3, dt);
            tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, ty, 3, dt);
        }
    });

    const fit = Math.min(1, viewport.width / 6.2, viewport.height / 5.4);

    return (
        <>
            <ambientLight intensity={0.55} />
            <hemisphereLight args={["#ffffff", "#ddd9ce", 0.45]} />
            <directionalLight position={[-1.5, 7, 6]} intensity={1.4} />
            <directionalLight position={[6, 2, -2]} intensity={0.35} />

            <group ref={tilt} position={[0, -0.7, 0]} scale={fit}>
                <group ref={spin} rotation={[0, 0.45, 0]}>
                    <mesh>
                        <boxGeometry args={[PLINTH.w, PLINTH.t, PLINTH.d]} />
                        <meshStandardMaterial color={NAVY} roughness={0.9} />
                    </mesh>

                    {BLOCKS.map((b, i) => (
                        <mesh key={i} position={[b.x, TOP + b.h / 2, b.z]}>
                            <boxGeometry args={[b.w, b.h, b.d]} />
                            <meshStandardMaterial color={BOARD} roughness={0.95} />
                            <Edges color={NAVY} lineWidth={1} transparent opacity={0.35} />
                        </mesh>
                    ))}

                    <Suspense fallback={null}>
                        <Facade url={textureUrl} />
                    </Suspense>
                </group>

                <ContactShadows
                    position={[0, -PLINTH.t / 2 - 0.002, 0]}
                    opacity={0.5}
                    scale={[10, 8]}
                    blur={2.2}
                    far={4}
                    resolution={256}
                    color={NAVY}
                />
            </group>
        </>
    );
}
