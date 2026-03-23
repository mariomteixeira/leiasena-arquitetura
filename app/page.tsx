import Navbar from "./components/navbar";
import Home from "./home";
import Projects from "./components/projects";
import Contact from "./components/contact";
import About from "./components/about";
import ScrollToTop from "./components/scroll-to-top";

export default function App() {
    return (
        <>
            <Navbar />
            <main className="min-[1020px]:pr-32 xl:pr-40">
                <section id="home" className="h-screen">
                    <Home />
                </section>
                <section id="projects" className="min-h-screen">
                    <Projects />
                </section>
                <section id="about" className="min-h-screen">
                    <About />
                </section>
                <section id="contact" className="min-h-screen">
                    <Contact />
                </section>
            </main>
            <ScrollToTop />
        </>
    );
}
