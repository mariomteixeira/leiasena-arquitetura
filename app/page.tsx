import Navbar from "./navbar";
import Home from "./home";
import Projects from "./projects";
import Contact from "./contact";
import About from "./about";


export default function App() {
  return (
    <div className="scroll-smooth">
      <Navbar />

      <main>
        <section id="home" className="min-h-[90vh] md:min-h-screen scroll-mt-24">
          <Home />
        </section>
        <section id="projects" className="min-h-screen scroll-mt-24">
          <Projects />
        </section>
        <section id="about" className="min-h-screen scroll-mt-24">
          <About />
        </section>
        <section id="contact" className="min-h-screen scroll-mt-24">
          <Contact />
        </section>
      </main>
    </div>
  );
}
