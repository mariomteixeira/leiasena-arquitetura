import type { Metadata, Viewport } from "next";
import { Bodoni_Moda } from "next/font/google";
import "./bio.css";

const bodoni = Bodoni_Moda({
    subsets: ["latin"],
    style: ["normal", "italic"],
    variable: "--font-bodoni-moda",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Léia Sena Arquitetura",
    description: "Arquiteta e urbanista. Projetos residenciais e comerciais com imagens 3D.",
};

export const viewport: Viewport = {
    themeColor: "#F4F1EA",
    viewportFit: "cover",
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
    return <div className={`${bodoni.variable} font-sans`}>{children}</div>;
}
