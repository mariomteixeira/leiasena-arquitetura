/**
 * Verified site content for the home redesign previews.
 * Everything here exists on the current site or in the brief. Do not add claims.
 */
import { projects, type Project } from "./projects";

export { projects };
export type { Project };

export const brand = {
    name: "Léia Sena Arquitetura",
    shortName: "Léia Sena",
    role: "Arquiteta e urbanista",
    city: "Brasília - DF",
    email: "contato@arqleiasena.com.br",
    instagram: { handle: "@arqleiasena", href: "https://www.instagram.com/arqleiasena/" },
    whatsapp: {
        display: "(61) 99574-7603",
        href: "https://api.whatsapp.com/send/?phone=5561995747603&text=Ol%C3%A1%2C+estou+entrando+em+contato+pois+gostaria+de+fazer+um+or%C3%A7amento+de+projeto.&type=phone_number&app_absent=0",
    },
    portrait: "/assets/images/about.jpg",
    logos: {
        /** black lockups (for light grounds) */
        verticalNeg1: "/assets/logo/svg/Vertical/VERTICAL-NEG1.svg",
        verticalNeg2: "/assets/logo/svg/Vertical/VERTICAL - NEG 2.svg",
        horizontalNeg1: "/assets/logo/svg/Horizontal/HORIZONTAL - NEG 1.svg",
        horizontalNeg2: "/assets/logo/svg/Horizontal/HORIZONTAL - NEG 2.svg",
        symbolNeg1: "/assets/logo/svg/Símbolo/SÍMBOLO - NEG 1.svg",
        /** colored versions (check before use) */
        horizontalV1: "/assets/logo/svg/Horizontal/HORIZONTAL - V1.svg",
        symbolV1: "/assets/logo/svg/Símbolo/SÍMBOLO - V1.svg",
    },
    menuIcon: "/assets/icons/menu-burger-horizontal-light.svg",
};

/** Approved copy. Pick from here; rephrasing is fine as long as no new fact appears. */
export const copy = {
    heroTitle: "Arquitetura que transforma espaços",
    heroSubtitle: "Projetos residenciais com design contemporâneo",
    roleLine: "Arquiteta e urbanista em Brasília",
    bioShort:
        "Registrada no CAU, com pós-graduação em Design de Interiores e Experiência do Ambiente (IPOG). Realizo projetos tanto residenciais quanto comerciais. Produzo as imagens 3D que mostram o resultado antes da sua obra começar.",
    aboutP1:
        "Leia Sena, arquiteta e urbanista formada pelo UniCEUB, com Pós-Graduação Master em Design de Interiores & Experiência do Ambiente pelo IPOG.",
    aboutP2:
        "Atua com metodologia BIM e renderização autoral para transformar cada projeto em uma experiência sensorial — criando ambientes residenciais e interiores harmônicos onde funcionalidade, estética e bem-estar se encontram.",
    services: ["Projetos residenciais", "Projetos comerciais", "Design de interiores", "Imagens 3D"],
    sections: [
        { id: "home", label: "Home" },
        { id: "projects", label: "Projetos" },
        { id: "about", label: "Sobre" },
        { id: "contact", label: "Contato" },
    ],
    formTitle: "Deixe suas informações e entraremos em contato:",
};
