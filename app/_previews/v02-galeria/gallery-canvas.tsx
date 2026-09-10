"use client";

import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useState, type ReactNode, type RefObject } from "react";
import { CAMERA, FOG, printsFor } from "./gallery-config";
import Prints from "./gallery-scene";

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
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

function hasWebGL() {
    try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
        return false;
    }
}

export default function GalleryCanvas({
    compact,
    reduced,
    active,
    progress,
    pointer,
    onReady,
    onFail,
}: {
    compact: boolean;
    reduced: boolean;
    /** hero is on screen: run the frameloop */
    active: boolean;
    progress: RefObject<number>;
    pointer: RefObject<{ x: number; y: number }>;
    onReady: () => void;
    onFail: () => void;
}) {
    const [supported, setSupported] = useState<boolean | null>(null);

    useEffect(() => {
        const ok = hasWebGL();
        setSupported(ok);
        if (!ok) onFail();
    }, [onFail]);

    if (!supported) return null;

    const cam = compact ? CAMERA.mobile : CAMERA.desktop;
    const prints = printsFor(compact);

    return (
        <div className="g-hero__canvas" aria-hidden="true">
            <Boundary onError={onFail}>
                <Canvas
                    key={compact ? "m" : "d"}
                    dpr={[1, 1.5]}
                    flat
                    camera={{ position: [0, 0, cam.zStart], fov: cam.fov, near: 0.1, far: 40 }}
                    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                    frameloop={reduced ? "demand" : active ? "always" : "never"}
                    style={{ width: "100%", height: "100%" }}
                >
                    <fog attach="fog" args={[FOG.color, FOG.near, FOG.far]} />
                    <Suspense fallback={null}>
                        <Prints
                            prints={prints}
                            compact={compact}
                            reduced={reduced}
                            inputs={{ progress, pointer }}
                            onReady={onReady}
                        />
                    </Suspense>
                </Canvas>
            </Boundary>
        </div>
    );
}
