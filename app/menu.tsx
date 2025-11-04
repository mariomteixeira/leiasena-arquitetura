'use client';

import { useState } from "react";
import Image from "next/image";


export default function Menu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <button
            type="button"
            onClick={() => setIsMenuOpen(v => !v)}
            aria-pressed={isMenuOpen}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex items-center justify-center transition active:scale-95 h-10 w-10 lg:h-12 lg:w-12"
        >
            <span className={`inline-block h-5 w-5 transform transition-transform duration-200 ease-out ${isMenuOpen ? 'rotate-90' : ''} size-6 sm:size-7 md:size-8 lg:size-9`}>
                <Image
                    src="/assets/icons/menu-burger-horizontal-light.svg"
                    alt=""
                    aria-hidden="true"
                    width={64}
                    height={64}
                    priority
                    className="object-contain"
                />
            </span>
        </button >
    )
}
