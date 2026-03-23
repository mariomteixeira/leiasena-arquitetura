export default function Contact() {
    return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-8 min-[1020px]:flex min-[1020px]:items-center min-[1020px]:px-12 min-[1020px]:py-8">
            <div className="w-full max-w-7xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl min-[1020px]:text-4xl font-light tracking-tight">
                    Contato
                </h2>
                <div className="mt-6 sm:mt-8 min-[1020px]:mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 min-[1020px]:grid-cols-3">
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm uppercase tracking-widest text-foreground/50">Endereço</h3>
                        <p className="text-sm sm:text-base min-[1020px]:text-lg font-light">Placeholder</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm uppercase tracking-widest text-foreground/50">Email</h3>
                        <p className="text-sm sm:text-base min-[1020px]:text-lg font-light">Placeholder</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm uppercase tracking-widest text-foreground/50">Redes Sociais</h3>
                        <p className="text-sm sm:text-base min-[1020px]:text-lg font-light">Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
