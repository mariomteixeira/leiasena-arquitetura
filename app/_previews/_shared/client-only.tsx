"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Renders children only after mount (for WebGL canvases and anything window-dependent). */
export default function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted ? <>{children}</> : <>{fallback}</>;
}
