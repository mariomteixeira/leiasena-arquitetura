import Navbar from "./navbar";
import Home from "./home";
import Projects from "./projects";
import Contact from "./contact";
import About from "./about";


export default function App() {
  return (
    <>
      <Navbar />

      <main className="snap-y snap-mandatory">
        <section id="home" className="h-screen snap-start">
          <Home />
        </section>
        <section id="projects" className="min-h-screen snap-start">
          <Projects />
        </section>
        <section id="about" className="h-screen snap-start">
          <About />
        </section>
        <section id="contact" className="h-screen snap-start">
          <Contact />
        </section>
      </main>
    </>
  );
}
