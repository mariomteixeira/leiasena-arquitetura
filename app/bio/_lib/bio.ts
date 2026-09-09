export type LinkId = "instagram" | "portfolio" | "site" | "contato";

export interface BioLink {
    id: LinkId;
    label: string;
    href: string;
    external?: boolean;
}

export const bio = {
    name: "Léia Sena",
    role: "Arquiteta e urbanista",
    text: "Registrada no CAU, com pós-graduação em Design de Interiores e Experiência do Ambiente (IPOG). Realizo projetos tanto residenciais quanto comerciais. Produzo as imagens 3D que mostram o resultado antes da sua obra começar.",
    photo: "/assets/images/about.jpg",
    logo: "/assets/logo/svg/svgs/vertical-azul.svg",
    links: [
        { id: "instagram", label: "Instagram", href: "https://www.instagram.com/arqleiasena/", external: true },
        { id: "portfolio", label: "Portfólio", href: "https://drive.google.com/file/d/1IKuKRY1vfrqR_YlocuZg2FrAiIeTfrJW/view", external: true },
        { id: "site", label: "Site", href: "https://arqleiasena.com.br/" },
        {
            id: "contato",
            label: "Fale Comigo",
            href: "https://api.whatsapp.com/send/?phone=5561995747603&text=Ol%C3%A1%2C+estou+entrando+em+contato+pois+gostaria+de+fazer+um+or%C3%A7amento+de+projeto.&type=phone_number&app_absent=0",
            external: true,
        },
    ] as BioLink[],
};
