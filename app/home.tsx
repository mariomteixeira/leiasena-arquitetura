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
        <div className="relative h-full lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-12 lg:py-8">
            {/* Mobile/tablet: full bleed hero */}
            <div className="relative h-full lg:hidden">
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
                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-8 pb-20 sm:pb-24">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight tracking-tight text-white">
                        Arquitetura que<br />transforma espaços
                    </h1>
                    <p className="mt-2 sm:mt-3 max-w-md text-sm sm:text-base text-white/70 font-light">
                        Projetos residenciais com design contemporâneo
                    </p>
                </div>
                <div className="absolute bottom-8 sm:bottom-10 right-4 sm:right-8 z-10 flex gap-2">
                    {heroImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-6 sm:w-8 h-0.5 rounded-full transition-colors duration-500 ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop: contained hero */}
            <div className="hidden lg:block w-full max-w-7xl">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
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
                    <div className="absolute bottom-0 left-0 right-0 z-10 px-10 pb-10">
                        <h1 className="text-5xl xl:text-6xl font-light leading-tight tracking-tight text-white">
                            Arquitetura que<br />transforma espaços
                        </h1>
                        <p className="mt-3 max-w-lg text-lg text-white/70 font-light">
                            Projetos residenciais com design contemporâneo
                        </p>
                    </div>
                    <div className="absolute bottom-8 right-10 z-10 flex gap-2">
                        {heroImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-10 h-0.5 rounded-full transition-colors duration-500 ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
