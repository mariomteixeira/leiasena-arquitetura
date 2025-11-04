'use client';

import Image from "next/image";
import Menu from "./menu";

export default function Navbar() {
    return (
        <header className="sticky top-0 w-full border-b border-b-black/10 bg-ice-white/70 backdrop-blur">
            <nav className="mx-auto flex w-full items-center px-3 py-3 sm:px-4 lg:px-6">
                <Image
                    src="/assets/logo/svg/Horizontal/HORIZONTAL - NEG 1.svg"
                    alt=""
                    width={800}
                    height={250}
                    className="h-auto w-[180px] sm:w-[220px] md:w-[280px] lg:w-[340px] xl:w-60"
                />
                <div className="ml-auto">
                    <Menu />
                </div>
            </nav>
        </header>
    )
}