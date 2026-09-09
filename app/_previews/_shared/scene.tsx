"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useEffect, useState, type ReactNode } from "react";

/**
 * React Three Fiber canvas with safe defaults for this site:
 * mounts only on the client, caps DPR, transparent background,
 * and pauses the frameloop when the user prefers reduced motion.
 * Keep the canvas inside a sized container (the Canvas fills its parent).
 */
export default function Scene({
    children,
    className = "",
    camera,
    fallback = null,
    ...rest
}: {
    children: ReactNode;
    className?: string;
    camera?: CanvasProps["camera"];
    fallback?: ReactNode;
} & Omit<CanvasProps, "children" | "camera" | "className">) {
    const [mounted, setMounted] = useState(false);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        setMounted(true);
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    if (!mounted) return <div className={className}>{fallback}</div>;

    return (
        <div className={className}>
            <Canvas
                dpr={[1, 1.5]}
                camera={camera ?? { position: [0, 0, 6], fov: 40 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                frameloop={reduced ? "demand" : "always"}
                style={{ width: "100%", height: "100%" }}
                {...rest}
            >
                {children}
            </Canvas>
        </div>
    );
}
