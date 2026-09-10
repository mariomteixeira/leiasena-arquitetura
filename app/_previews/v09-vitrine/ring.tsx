"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import Scene from "../_shared/scene";
import { projects } from "../_shared/content";

/* ---------- data ---------- */

export interface RingItem {
    slug: string;
    title: string;
    src: string;
}

const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

/** Four covers + one interior per project. Order is the ring order. */
export const ringItems: RingItem[] = [
    { slug: "anny", title: "Anny", src: bySlug.anny.cover },
    { slug: "debora", title: "Débora", src: bySlug.debora.cover },
    { slug: "felipe", title: "Felipe", src: bySlug.felipe.cover },
    { slug: "gustavo", title: "Gustavo", src: bySlug.gustavo.cover },
    { slug: "anny", title: "Anny", src: bySlug.anny.images[5] },
    { slug: "debora", title: "Débora", src: bySlug.debora.images[4] },
    { slug: "felipe", title: "Felipe", src: bySlug.felipe.images[4] },
    { slug: "gustavo", title: "Gustavo", src: bySlug.gustavo.images[5] },
];
/** Mobile: six planes (drops the two odd-aspect stills). */
const ringItemsMobile: RingItem[] = [ringItems[0], ringItems[1], ringItems[2], ringItems[3], ringItems[4], ringItems[6]];

const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=828&q=75`;

const AUTO_SPEED = 0.08; // rad/s
const DRAG_K = 0.0065; // rad per px

interface Spin {
    target: number;
    current: number;
    vel: number;
    dragging: boolean;
    hover: boolean;
    lastX: number;
    lastT: number;
    moved: number;
}

/* ---------- 3D ---------- */

function makeShadowTexture() {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext("2d");
    if (ctx) {
        ctx.save();
        ctx.scale(1, 0.5);
        const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        g.addColorStop(0, "rgba(49,60,89,0.18)");
        g.addColorStop(0.55, "rgba(49,60,89,0.07)");
        g.addColorStop(1, "rgba(49,60,89,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 256, 256);
        ctx.restore();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

interface PanelSpec {
    w: number;
    h: number;
    rx: number;
    ox: number;
}

function Ring({
    items,
    radius,
    height,
    spin,
    reduced,
    onActive,
    onReady,
    onFrontHover,
    invalidateRef,
}: {
    items: RingItem[];
    radius: number;
    height: number;
    spin: React.MutableRefObject<Spin>;
    reduced: boolean;
    onActive: (i: number) => void;
    onReady: () => void;
    onFrontHover: (v: boolean) => void;
    invalidateRef: React.MutableRefObject<(() => void) | null>;
}) {
    const router = useRouter();
    const invalidate = useThree((s) => s.invalidate);
    const textures = useTexture(items.map((it) => optimized(it.src)));
    const group = useRef<THREE.Group>(null);
    const meshes = useRef<(THREE.Mesh | null)[]>([]);
    const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
    const flipped = useRef<boolean[]>(items.map(() => false));
    const front = useRef(-1);
    const shadowTex = useMemo(() => makeShadowTexture(), []);

    useEffect(() => {
        invalidateRef.current = invalidate;
        return () => {
            invalidateRef.current = null;
        };
    }, [invalidate, invalidateRef]);

    // Cover-crop each texture into its panel and size the panel from the image aspect.
    const specs = useMemo<PanelSpec[]>(() => {
        return textures.map((tex) => {
            const img = tex.image as { width?: number; height?: number } | undefined;
            const a = img && img.width && img.height ? img.width / img.height : 1.5;
            const planeAspect = Math.min(1.55, Math.max(0.8, a));
            const w = height * planeAspect;
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            tex.anisotropy = 4;
            let rx = 1;
            let ox = 0;
            if (a > planeAspect) {
                rx = planeAspect / a;
                ox = (1 - rx) / 2;
                tex.repeat.set(rx, 1);
                tex.offset.set(ox, 0);
            } else {
                const ry = a / planeAspect;
                tex.repeat.set(1, ry);
                tex.offset.set(0, (1 - ry) / 2);
            }
            tex.needsUpdate = true;
            return { w, h: height, rx, ox };
        });
    }, [textures, height]);

    useEffect(() => {
        onReady();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => () => shadowTex.dispose(), [shadowTex]);

    const step = (Math.PI * 2) / items.length;

    useFrame((_, delta) => {
        const s = spin.current;
        const dt = Math.min(delta, 0.05);
        if (!s.dragging) {
            s.vel *= Math.exp(-3.2 * dt);
            if (Math.abs(s.vel) < 0.002) s.vel = 0;
            s.target += s.vel * dt;
            if (!reduced && !s.hover) s.target += AUTO_SPEED * dt;
        }
        s.current += (s.target - s.current) * (1 - Math.exp(-8 * dt));
        const g = group.current;
        if (!g) return;
        g.rotation.y = s.current;

        let best = -2;
        let fi = 0;
        for (let i = 0; i < items.length; i++) {
            const c = Math.cos(i * step + s.current);
            if (c > best) {
                best = c;
                fi = i;
            }
        }
        if (fi !== front.current) {
            front.current = fi;
            onActive(fi);
        }

        const k = 1 - Math.exp(-7 * dt);
        for (let i = 0; i < items.length; i++) {
            const m = meshes.current[i];
            const mat = mats.current[i];
            if (!m || !mat) continue;
            const isFront = i === fi;
            const ts = isFront ? 1.12 : 1;
            const to = isFront ? 1 : 0.7;
            const sc = m.scale.x + (ts - m.scale.x) * k;
            m.scale.set(sc, sc, 1);
            mat.opacity += (to - mat.opacity) * k;
            // Flip the image horizontally while the panel faces away, so it never reads mirrored.
            const back = Math.cos(i * step + s.current) < 0;
            if (back !== flipped.current[i]) {
                flipped.current[i] = back;
                const spec = specs[i];
                const tex = textures[i];
                if (back) {
                    tex.repeat.x = -spec.rx;
                    tex.offset.x = spec.ox + spec.rx;
                } else {
                    tex.repeat.x = spec.rx;
                    tex.offset.x = spec.ox;
                }
            }
        }
    });

    const onClick = (i: number) => (e: ThreeEvent<MouseEvent>) => {
        if (e.delta > 6) return;
        e.stopPropagation();
        const s = spin.current;
        if (i === front.current) {
            router.push(`/projetos/${items[i].slug}`);
            return;
        }
        // bring the clicked panel to the front along the shortest path
        const want = -i * step;
        const cur = s.target;
        const twoPi = Math.PI * 2;
        let d = ((want - cur) % twoPi + twoPi) % twoPi;
        if (d > Math.PI) d -= twoPi;
        s.target = cur + d;
        s.vel = 0;
        invalidate();
    };

    return (
        <group ref={group} position={[0, 0.1, 0]}>
            {items.map((it, i) => {
                const a = i * step;
                const spec = specs[i];
                return (
                    <group key={`${it.slug}-${i}`} position={[radius * Math.sin(a), 0, radius * Math.cos(a)]} rotation={[0, a, 0]}>
                        <mesh
                            ref={(el) => {
                                meshes.current[i] = el;
                            }}
                            onClick={onClick(i)}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                onFrontHover(i === front.current);
                            }}
                            onPointerOut={() => onFrontHover(false)}
                        >
                            <planeGeometry args={[spec.w, spec.h]} />
                            <meshBasicMaterial
                                ref={(el) => {
                                    mats.current[i] = el;
                                }}
                                map={textures[i]}
                                transparent
                                opacity={0}
                                toneMapped={false}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                        <mesh position={[0, -spec.h / 2 - 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[spec.w * 1.35, spec.h * 0.55, 1]}>
                            <planeGeometry args={[1, 1]} />
                            <meshBasicMaterial map={shadowTex} transparent depthWrite={false} toneMapped={false} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

/* ---------- boundary ---------- */

class RingBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    componentDidCatch() {
        this.props.onError();
    }
    render() {
        return this.state.failed ? null : this.props.children;
    }
}

/* ---------- stage (DOM) ---------- */

function hasWebGL() {
    try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
        return false;
    }
}

export default function RingStage({ className = "" }: { className?: string }) {
    const [mounted, setMounted] = useState(false);
    const [webgl, setWebgl] = useState(false);
    const [mobile, setMobile] = useState(false);
    const [reduced, setReduced] = useState(false);
    const [inView, setInView] = useState(true);
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [frontHover, setFrontHover] = useState(false);
    const [active, setActive] = useState(0);
    const stageRef = useRef<HTMLDivElement>(null);
    const invalidateRef = useRef<(() => void) | null>(null);
    const spin = useRef<Spin>({ target: 0, current: 0, vel: 0, dragging: false, hover: false, lastX: 0, lastT: 0, moved: 0 });

    useEffect(() => {
        setMounted(true);
        setWebgl(hasWebGL());
        const mqM = window.matchMedia("(max-width: 1023px)");
        const mqR = window.matchMedia("(prefers-reduced-motion: reduce)");
        setMobile(mqM.matches);
        setReduced(mqR.matches);
        const onM = (e: MediaQueryListEvent) => setMobile(e.matches);
        const onR = (e: MediaQueryListEvent) => setReduced(e.matches);
        mqM.addEventListener("change", onM);
        mqR.addEventListener("change", onR);
        const el = stageRef.current;
        let io: IntersectionObserver | undefined;
        if (el && "IntersectionObserver" in window) {
            io = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? true), { threshold: 0.05 });
            io.observe(el);
        }
        return () => {
            mqM.removeEventListener("change", onM);
            mqR.removeEventListener("change", onR);
            io?.disconnect();
        };
    }, []);

    const items = mobile ? ringItemsMobile : ringItems;
    const radius = mobile ? 3.1 : 4.2;
    const height = mobile ? 1.45 : 1.7;
    const camera = mobile ? { position: [0, 2.2, 13] as [number, number, number], fov: 44 } : { position: [0, 2.6, 12.4] as [number, number, number], fov: 34 };

    const show3d = mounted && webgl && !failed;

    const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("a")) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        const s = spin.current;
        s.dragging = true;
        s.lastX = e.clientX;
        s.lastT = performance.now();
        s.moved = 0;
        s.vel = 0;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
        const s = spin.current;
        if (!s.dragging) return;
        const now = performance.now();
        const dx = e.clientX - s.lastX;
        const dt = Math.max(1, now - s.lastT) / 1000;
        s.lastX = e.clientX;
        s.lastT = now;
        s.moved += Math.abs(dx);
        s.target += dx * DRAG_K;
        const v = (dx * DRAG_K) / dt;
        s.vel = s.vel * 0.6 + v * 0.4;
        invalidateRef.current?.();
    };
    const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
        const s = spin.current;
        if (!s.dragging) return;
        s.dragging = false;
        if (performance.now() - s.lastT > 80) s.vel = 0;
        setDragging(false);
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            /* already released */
        }
        invalidateRef.current?.();
    };

    const activeItem = items[Math.min(active, items.length - 1)];
    const covers = projects;

    return (
        <div
            ref={stageRef}
            className={`vt-stage ${className}`}
            data-dragging={dragging || undefined}
            data-ready={show3d && ready ? "" : undefined}
            data-front-hover={frontHover && !dragging ? "" : undefined}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerEnter={() => {
                spin.current.hover = true;
            }}
            onPointerLeave={(e) => {
                spin.current.hover = false;
                endDrag(e);
            }}
        >
            <div className="vt-static" inert={show3d && ready} aria-hidden={show3d && ready}>
                {covers.map((p, i) => (
                    <a key={p.slug} href={`/projetos/${p.slug}`} aria-label={`Projeto ${p.title}`}>
                        <Image src={p.cover} alt={`Projeto ${p.title}`} fill sizes="(min-width: 1024px) 28vw, 45vw" priority={i === 0} />
                    </a>
                ))}
            </div>

            {show3d && (
                <RingBoundary onError={() => setFailed(true)}>
                    <Scene
                        key={mobile ? "m" : "d"}
                        className="vt-canvas"
                        camera={camera}
                        frameloop={!inView ? "never" : reduced ? "demand" : "always"}
                        onCreated={({ camera: cam }) => cam.lookAt(0, -0.2, 0)}
                    >
                        <Suspense fallback={null}>
                            <Ring
                                items={items}
                                radius={radius}
                                height={height}
                                spin={spin}
                                reduced={reduced}
                                onActive={setActive}
                                onReady={() => setReady(true)}
                                onFrontHover={setFrontHover}
                                invalidateRef={invalidateRef}
                            />
                        </Suspense>
                    </Scene>
                </RingBoundary>
            )}

            <a className="vt-caption" href={`/projetos/${activeItem.slug}`} aria-live="polite">
                <span className="vt-mono">
                    {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
                <em>{activeItem.title}</em>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
            </a>
        </div>
    );
}
