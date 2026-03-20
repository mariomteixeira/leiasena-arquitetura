'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

const heroImages = [
    "/assets/projetos/Anny/01.png",
    "/assets/projetos/Samara/varanda.jpg",
];

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(i => (i + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex items-end h-full min-h-screen">
            {heroImages.map((src, i) => (
                <Image
                    key={src}
                    src={src}
                    alt="Projeto de arquitetura"
                    fill
                    priority={i === 0}
                    className={`object-cover transition-opacity duration-1500 ease-in-out ${i === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                />
            ))}

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

            <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 pb-16 sm:pb-20 md:pb-24">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-white">
                    Arquitetura que<br />transforma espaços
                </h1>
                <p className="mt-3 sm:mt-4 max-w-lg text-base sm:text-lg md:text-xl text-white/70 font-light">
                    Projetos residenciais com design contemporâneo
                </p>
            </div>

            <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 z-10 flex gap-2">
                {heroImages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-8 sm:w-10 h-0.5 rounded-full transition-colors duration-500 ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
