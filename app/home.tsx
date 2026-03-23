import fs from "fs";
import path from "path";
import HomeCarousel from "./components/home-carousel";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

function getHeroImages(): string[] {
    const projectsDir = path.join(process.cwd(), "public", "assets", "projetos");
    if (!fs.existsSync(projectsDir)) return [];

    return fs.readdirSync(projectsDir)
        .filter((name) => {
            const full = path.join(projectsDir, name);
            if (!fs.statSync(full).isDirectory()) return false;
            const files = fs.readdirSync(full);
            return files.some((f) => /^01\.(png|jpg|jpeg|webp|avif)$/i.test(f));
        })
        .sort((a, b) => a.localeCompare(b))
        .map((name) => {
            const files = fs.readdirSync(path.join(projectsDir, name));
            const cover = files.find((f) => f.startsWith("01.") && IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()));
            return `/assets/projetos/${name}/${cover}`;
        });
}

export default function Home() {
    const heroImages = getHeroImages();
    return <HomeCarousel images={heroImages} />;
}
