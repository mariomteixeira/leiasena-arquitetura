"use client";

import { Component, type ReactNode, useEffect, useState } from "react";
import Scene from "../_shared/scene";
import { projects } from "../_shared/content";
import Model from "./model";

const TEXTURE = `/_next/image?url=${encodeURIComponent(projects[0].cover)}&w=640&q=75`;

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}

/** The hero model. Renders the static fallback on the server, without WebGL, or if the canvas throws. */
export default function HeroModel({ fallback }: { fallback: ReactNode }) {
    const [ready, setReady] = useState(false);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        let ok = false;
        try {
            const c = document.createElement("canvas");
            ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
        } catch {
            ok = false;
        }
        setReady(ok);

        const narrow = window.matchMedia("(max-width: 1023px)");
        const hover = window.matchMedia("(hover: hover)");
        const apply = () => setMobile(narrow.matches || !hover.matches);
        apply();
        narrow.addEventListener("change", apply);
        hover.addEventListener("change", apply);
        return () => {
            narrow.removeEventListener("change", apply);
            hover.removeEventListener("change", apply);
        };
    }, []);

    const staticView = <div className="mq-stage-inner">{fallback}</div>;
    if (!ready) return staticView;

    return (
        <Boundary fallback={staticView}>
            <Scene className="mq-stage-inner" camera={{ position: [7.6, 5.4, 8.8], fov: 26 }} flat fallback={fallback}>
                <Model mobile={mobile} textureUrl={TEXTURE} />
            </Scene>
        </Boundary>
    );
}
