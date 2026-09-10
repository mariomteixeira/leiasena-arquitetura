"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Project } from "../_shared/content";

/**
 * A project tile as a CSS 3D box: front = cover, right = navy with the title, bottom = cream "Ver projeto".
 * Hover rotates it (CSS). On touch the first tap opens it, the second follows the link.
 */
export default function Cube({ project, sizes }: { project: Project; sizes: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("pointerdown", onDown);
        return () => document.removeEventListener("pointerdown", onDown);
    }, [open]);

    const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (open) return;
        if (window.matchMedia("(hover: none)").matches) {
            e.preventDefault();
            setOpen(true);
        }
    };

    return (
        <Link
            ref={ref}
            href={`/projetos/${project.slug}`}
            onClick={onClick}
            className="c-cube-wrap"
            aria-label={`Ver projeto ${project.title}`}
        >
            <div className={`c-cube${open ? " is-open" : ""}`}>
                <div className="c-face c-face-front">
                    <Image src={project.cover} alt={`Projeto ${project.title}`} fill sizes={sizes} className="object-cover" />
                </div>
                <div className="c-face c-face-right" aria-hidden="true">
                    <span>{project.title}</span>
                </div>
                <div className="c-face c-face-bottom" aria-hidden="true">
                    <span>Ver projeto</span>
                </div>
            </div>
            <div className="c-cube-caption">
                <strong>{project.title}</strong>
                <span className="c-cube-arrow" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square">
                        <path d="M5 12h14" />
                        <path d="M13 6l6 6-6 6" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}
