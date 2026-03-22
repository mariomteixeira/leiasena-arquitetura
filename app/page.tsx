import Navbar from "./navbar";
import Home from "./home";
import Projects from "./projects";
import Contact from "./contact";
import About from "./about";

export default function App() {
    return (
        <>
            <Navbar />
            <main>
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
        </>
    );
}
