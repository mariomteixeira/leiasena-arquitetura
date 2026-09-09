import type { ComponentType } from "react";

export interface HomeVariant {
    id: string;
    name: string;
    /** Loaded lazily so one broken variant does not break the others. */
    load: () => Promise<{ default: ComponentType }>;
}

export const variants: HomeVariant[] = [
    { id: "maquete", name: "Maquete", load: () => import("./v01-maquete") },
    { id: "galeria", name: "Galeria flutuante", load: () => import("./v02-galeria") },
    { id: "prancha", name: "Prancha", load: () => import("./v03-prancha") },
    { id: "cinema", name: "Cinema", load: () => import("./v04-cinema") },
    { id: "indice", name: "Índice", load: () => import("./v05-indice") },
    { id: "concreto", name: "Concreto", load: () => import("./v06-concreto") },
    { id: "corte", name: "Corte", load: () => import("./v07-corte") },
    { id: "marquise", name: "Marquise", load: () => import("./v08-marquise") },
    { id: "vitrine", name: "Vitrine", load: () => import("./v09-vitrine") },
    { id: "revista", name: "Revista", load: () => import("./v10-revista") },
];
