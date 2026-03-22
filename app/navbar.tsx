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
        <>
            <nav className="fixed right-0 top-0 z-50 hidden lg:flex flex-col items-center gap-14 px-8 xl:px-15 pt-24">
                <a href="#home">
                    <Image
                        src="/assets/logo/svg/Vertical/VERTICAL-NEG1.svg"
                        alt="Leia Sena Arquitetura"
                        width={160}
                        height={200}
                        className="h-auto w-20 xl:w-24"
                    />
                </a>

                <ul className="flex flex-col items-center gap-5">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="text-base font-semibold tracking-widest uppercase text-foreground/50 hover:text-foreground transition-colors duration-300"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <header className="fixed top-0 right-0 z-50 lg:hidden p-4">
                <div className="relative">
                    <button
                        ref={buttonRef}
                        type="button"
                        onClick={() => setIsMenuOpen(v => !v)}
                        aria-pressed={isMenuOpen}
                        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        className="inline-flex items-center justify-center transition active:scale-95 h-10 w-10"
                    >
                        <span className={`inline-block transform transition-transform duration-300 ease-out ${isMenuOpen ? 'rotate-90' : ''} size-6 sm:size-7`}>
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
                                    className="px-6 py-3 text-sm font-semibold tracking-widest uppercase text-foreground/70 hover:text-foreground hover:bg-black/5 transition-colors duration-200"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}
