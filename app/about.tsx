export default function About() {
    return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-8 min-[1020px]:flex min-[1020px]:items-center min-[1020px]:px-12 min-[1020px]:py-8 font-mono">
            <div className="w-full max-w-7xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl min-[1020px]:text-5xl font-light tracking-tight">
                    Sobre
                </h2>
                <div className="mt-6 sm:mt-8 min-[1020px]:mt-10 grid grid-cols-1 gap-6 min-[1020px]:grid-cols-2 min-[1020px]:gap-16">
                    <div className="space-y-4 sm:space-y-6 text-base sm:text-lg min-[1020px]:text-xl text-foreground/80 font-light leading-relaxed">
                        <p>
                            <span className="text-foreground font-normal">Leia Sena</span>, arquiteta e urbanista formada pelo UniCEUB, com Pós-Graduação Master em Design de Interiores & Experiência do Ambiente pelo IPOG.
                        </p>
                        <p>
                            Atua com metodologia BIM e renderização autoral para transformar cada projeto em uma experiência sensorial — criando ambientes residenciais e interiores harmônicos onde funcionalidade, estética e bem-estar se encontram.
                        </p>
                    </div>
                    <div className="aspect-4/3 min-[1020px]:aspect-square rounded-lg border border-black/10 overflow-hidden">
                    </div>
                </div>
            </div>
        </div>
    )
}
