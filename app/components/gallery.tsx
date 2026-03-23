'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface ImageDimensions {
    src: string;
    width: number;
    height: number;
    ratio: number;
}

type GridLayout = 'v-v-h' | 'h-full' | 'v-single' | 'h-v';

function buildLayoutRows(images: string[], dims: Map<string, ImageDimensions>): { src: string; layout: GridLayout; position: number }[] {
    const result: { src: string; layout: GridLayout; position: number }[] = [];
    let i = 0;

    while (i < images.length) {
        const remaining = images.length - i;
        const r1 = dims.get(images[i])?.ratio ?? 1.3;

        if (remaining >= 3) {
            const r2 = dims.get(images[i + 1])?.ratio ?? 0.7;
            const r3 = dims.get(images[i + 2])?.ratio ?? 1.3;

            if (r1 <= 1.3 && r2 <= 1.3 && r3 > 1) {
                result.push({ src: images[i], layout: 'v-v-h', position: 0 });
                result.push({ src: images[i + 1], layout: 'v-v-h', position: 1 });
                result.push({ src: images[i + 2], layout: 'v-v-h', position: 2 });
                i += 3;
                continue;
            }

            if (r1 > 1.3) {
                result.push({ src: images[i], layout: 'h-full', position: 0 });
                result.push({ src: images[i + 1], layout: 'h-v', position: 0 });
                result.push({ src: images[i + 2], layout: 'h-v', position: 1 });
                i += 3;
                continue;
            }

            result.push({ src: images[i], layout: 'h-v', position: 0 });
            result.push({ src: images[i + 1], layout: 'h-v', position: 1 });
            i += 2;
            continue;
        }

        if (remaining === 2) {
            result.push({ src: images[i], layout: 'h-v', position: 0 });
            result.push({ src: images[i + 1], layout: 'h-v', position: 1 });
            i += 2;
            continue;
        }

        result.push({ src: images[i], layout: 'h-full', position: 0 });
        i += 1;
    }

    return result;
}

function GalleryImage({
    src,
    index,
    title,
    onClick,
    className,
}: {
    src: string;
    index: number;
    title: string;
    onClick: () => void;
    className: string;
}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <button
            onClick={onClick}
            className={`relative overflow-hidden rounded-lg group cursor-pointer ${className}`}
        >
            {!loaded && (
                <div className="absolute inset-0 skeleton rounded-lg z-10" />
            )}

            <Image
                src={src}
                alt={`${title} - Imagem ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLoaded(true)}
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-20" />
        </button>
    );
}

interface ProjectGalleryProps {
    images: string[];
    title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [dimensions, setDimensions] = useState<Map<string, ImageDimensions>>(new Map());
    const [ready, setReady] = useState(false);
    const [lightboxLoaded, setLightboxLoaded] = useState(false);

    useEffect(() => {
        const entries = new Map<string, ImageDimensions>();

        Promise.all(
            images.map(
                (src) =>
                    new Promise<void>((resolve) => {
                        const img = new window.Image();
                        img.onload = () => {
                            entries.set(src, {
                                src,
                                width: img.naturalWidth,
                                height: img.naturalHeight,
                                ratio: img.naturalWidth / img.naturalHeight,
                            });
                            resolve();
                        };
                        img.onerror = () => {
                            entries.set(src, { src, width: 800, height: 600, ratio: 4 / 3 });
                            resolve();
                        };
                        img.src = src;
                    })
            )
        ).then(() => {
            setDimensions(new Map(entries));
            setReady(true);
        });
    }, [images]);

    useEffect(() => {
        setLightboxLoaded(false);
    }, [lightboxIndex]);

    useEffect(() => {
        if (lightboxIndex === null) return;

        document.body.style.overflow = 'hidden';

        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? (i + 1) % images.length : null);
            if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? (i - 1 + images.length) % images.length : null);
        }

        document.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKey);
        };
    }, [lightboxIndex, images.length]);

    const goTo = useCallback((dir: 1 | -1) => {
        setLightboxIndex(i => i !== null ? (i + dir + images.length) % images.length : null);
    }, [images.length]);

    const layoutItems = ready ? buildLayoutRows(images, dimensions) : [];

    const rows: { src: string; layout: GridLayout; position: number; globalIndex: number }[][] = [];
    let currentRow: typeof rows[number] = [];

    layoutItems.forEach((item, idx) => {
        const globalIndex = images.indexOf(item.src);
        currentRow.push({ ...item, globalIndex });

        const isRowEnd =
            item.layout === 'h-full' ||
            (item.layout === 'v-v-h' && item.position === 2) ||
            (item.layout === 'h-v' && item.position === 1) ||
            (item.layout === 'v-single' && item.position === 0);

        if (isRowEnd || idx === layoutItems.length - 1) {
            rows.push(currentRow);
            currentRow = [];
        }
    });

    return (
        <>
            {!ready && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((_, i) => (
                        <div key={i} className="skeleton rounded-lg h-48 sm:h-56" />
                    ))}
                </div>
            )}

            {ready && (
                <div className="flex flex-col gap-3 sm:gap-4">
                    {rows.map((row, rowIdx) => {
                        const layout = row[0]?.layout;

                        if (layout === 'v-v-h' && row.length === 3) {
                            return (
                                <div key={rowIdx} className="flex flex-col gap-3 sm:gap-4">
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <GalleryImage
                                            src={row[0].src}
                                            index={row[0].globalIndex}
                                            title={title}
                                            onClick={() => setLightboxIndex(row[0].globalIndex)}
                                            className="h-52 sm:h-64 md:h-72"
                                        />
                                        <GalleryImage
                                            src={row[1].src}
                                            index={row[1].globalIndex}
                                            title={title}
                                            onClick={() => setLightboxIndex(row[1].globalIndex)}
                                            className="h-52 sm:h-64 md:h-72"
                                        />
                                    </div>
                                    <GalleryImage
                                        src={row[2].src}
                                        index={row[2].globalIndex}
                                        title={title}
                                        onClick={() => setLightboxIndex(row[2].globalIndex)}
                                        className="h-44 sm:h-52 md:h-56"
                                    />
                                </div>
                            );
                        }

                        if (layout === 'h-full') {
                            return (
                                <GalleryImage
                                    key={rowIdx}
                                    src={row[0].src}
                                    index={row[0].globalIndex}
                                    title={title}
                                    onClick={() => setLightboxIndex(row[0].globalIndex)}
                                    className="h-44 sm:h-52 md:h-60"
                                />
                            );
                        }

                        if (layout === 'h-v' && row.length === 2) {
                            return (
                                <div key={rowIdx} className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <GalleryImage
                                        src={row[0].src}
                                        index={row[0].globalIndex}
                                        title={title}
                                        onClick={() => setLightboxIndex(row[0].globalIndex)}
                                        className="h-48 sm:h-56 md:h-64"
                                    />
                                    <GalleryImage
                                        src={row[1].src}
                                        index={row[1].globalIndex}
                                        title={title}
                                        onClick={() => setLightboxIndex(row[1].globalIndex)}
                                        className="h-48 sm:h-56 md:h-64"
                                    />
                                </div>
                            );
                        }

                        return (
                            <GalleryImage
                                key={rowIdx}
                                src={row[0].src}
                                index={row[0].globalIndex}
                                title={title}
                                onClick={() => setLightboxIndex(row[0].globalIndex)}
                                className="h-44 sm:h-52 md:h-56"
                            />
                        );
                    })}
                </div>
            )}

            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in"
                    onClick={() => setLightboxIndex(null)}
                    data-lenis-prevent
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); goTo(-1); }}
                        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white text-4xl sm:text-5xl transition-colors duration-200 p-2"
                        aria-label="Imagem anterior"
                    >
                        &#8249;
                    </button>

                    <div
                        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!lightboxLoaded && (
                            <div className="w-[60vw] h-[50vh] skeleton rounded-lg" />
                        )}
                        <Image
                            src={images[lightboxIndex]}
                            alt={`${title} - Imagem ${lightboxIndex + 1}`}
                            width={dimensions.get(images[lightboxIndex])?.width ?? 1200}
                            height={dimensions.get(images[lightboxIndex])?.height ?? 800}
                            sizes="90vw"
                            className={`max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${lightboxLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                            onLoad={() => setLightboxLoaded(true)}
                            priority
                        />
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); goTo(1); }}
                        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white text-4xl sm:text-5xl transition-colors duration-200 p-2"
                        aria-label="Próxima imagem"
                    >
                        &#8250;
                    </button>

                    <p className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest">
                        {lightboxIndex + 1} / {images.length}
                    </p>
                </div>
            )}
        </>
    );
}
