export interface Project {
    slug: string;
    title: string;
    cover: string;
    images: string[];
}

function buildImages(folder: string, count: number, ext = "png"): string[] {
    return Array.from({ length: count }, (_, i) =>
        `/assets/projetos/${folder}/${String(i + 1).padStart(2, "0")}.${ext}`
    );
}

export const projects: Project[] = [
    { slug: "anny", title: "Anny", cover: "/assets/projetos/Anny/01.png", images: buildImages("Anny", 12) },
    { slug: "debora", title: "Débora", cover: "/assets/projetos/Debora/01.png", images: buildImages("Debora", 8) },
    { slug: "felipe", title: "Felipe", cover: "/assets/projetos/Felipe/01.png", images: buildImages("Felipe", 8) },
    { slug: "gustavo", title: "Gustavo", cover: "/assets/projetos/Gustavo/01.png", images: buildImages("Gustavo", 10) },
];
