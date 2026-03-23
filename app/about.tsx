export default function About() {
    return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-8 min-[1020px]:flex min-[1020px]:items-center min-[1020px]:px-12 min-[1020px]:py-8">
            <div className="w-full max-w-7xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl min-[1020px]:text-4xl font-light tracking-tight">
                    Sobre
                </h2>
                <div className="mt-6 sm:mt-8 min-[1020px]:mt-10 grid grid-cols-1 gap-6 min-[1020px]:grid-cols-2 min-[1020px]:gap-16">
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base min-[1020px]:text-lg text-foreground/80 font-light leading-relaxed">
                        <p>Placeholder para descrição do escritório.</p>
                        <p>Placeholder para filosofia de projeto.</p>
                    </div>
                    <div className="aspect-4/3 min-[1020px]:aspect-square rounded-lg border border-black/10 overflow-hidden">
                    </div>
                </div>
            </div>
        </div>
    )
}
