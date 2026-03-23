import HomeCarousel from "./_components/home-carousel";
import { projects } from "./_lib/projects";

export default function Home() {
    const heroImages = projects.map((p) => p.cover);
    return <HomeCarousel images={heroImages} />;
}
