import type { Metadata } from "next";
import { Archivo, Big_Shoulders, Bodoni_Moda } from "next/font/google";
import "./preview.css";

const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-bodoni-moda", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const bigShoulders = Big_Shoulders({ subsets: ["latin"], variable: "--font-big-shoulders", display: "swap" });

export const metadata: Metadata = {
    title: "Léia Sena Arquitetura",
    description: "Projetos de arquitetura residencial e comercial em Brasília, com imagens 3D.",
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
    return <div className={`${bodoni.variable} ${archivo.variable} ${bigShoulders.variable} font-sans`}>{children}</div>;
}
