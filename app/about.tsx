export default function About() {
    return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-8 lg:flex lg:items-center lg:px-12 lg:py-8">
            <div className="w-full max-w-7xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">
                    Sobre
                </h2>
                <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16">
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-foreground/80 font-light leading-relaxed">
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
