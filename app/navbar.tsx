'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#projects', label: 'Projetos' },
    { href: '#about', label: 'Sobre' },
    { href: '#contact', label: 'Contato' },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isMenuOpen) return;

        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node;
            if (
                menuRef.current && !menuRef.current.contains(target) &&
                buttonRef.current && !buttonRef.current.contains(target)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    return (
        <header className="fixed top-0 left-0 w-full z-50 border-b border-b-black/5 bg-ice-white/60 backdrop-blur-xl backdrop-saturate-150">
            <nav className="mx-auto flex w-full items-center px-4 py-3 sm:px-6 lg:px-8">
                <Image
                    src="/assets/logo/svg/Horizontal/HORIZONTAL - NEG 1.svg"
                    alt="Leia Sena Arquitetura"
                    width={800}
                    height={250}
                    className="h-auto w-[180px] sm:w-[220px] md:w-[280px] lg:w-[340px] xl:w-60"
                />

                <ul className="hidden lg:flex items-center gap-8 ml-auto">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="text-sm tracking-widest uppercase text-foreground/60 hover:text-foreground transition-colors duration-300"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="ml-auto lg:hidden relative">
                    <button
                        ref={buttonRef}
                        type="button"
                        onClick={() => setIsMenuOpen(v => !v)}
                        aria-pressed={isMenuOpen}
                        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        className="inline-flex items-center justify-center transition active:scale-95 h-10 w-10"
                    >
                        <span className={`inline-block transform transition-transform duration-300 ease-out ${isMenuOpen ? 'rotate-90' : ''} size-6 sm:size-7 md:size-8`}>
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
                    </button>

                    <div
                        ref={menuRef}
                        className={`absolute right-0 top-full mt-2 w-56 origin-top-right rounded-lg bg-ice-white/80 backdrop-blur-xl backdrop-saturate-150 shadow-lg border border-black/5 transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                    >
                        <nav className="flex flex-col py-2">
                            {navLinks.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-6 py-3 text-sm tracking-widest uppercase text-foreground/70 hover:text-foreground hover:bg-black/5 transition-colors duration-200"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </nav>
        </header>
    )
}
