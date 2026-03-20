export default function About() {
    return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
                    Sobre
                </h2>
                <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                    <div className="space-y-4 text-base sm:text-lg text-foreground/80 font-light leading-relaxed">
                        <p>Placeholder para descrição do escritório.</p>
                        <p>Placeholder para filosofia de projeto.</p>
                    </div>
                    <div className="aspect-4/3 lg:aspect-square rounded-lg border border-black/10 overflow-hidden">
                    </div>
                </div>
            </div>
        </div>
    )
}
