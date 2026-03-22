export default function Contact() {
    return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-8 lg:flex lg:items-center lg:px-12 lg:py-8">
            <div className="w-full max-w-7xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">
                    Contato
                </h2>
                <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm uppercase tracking-widest text-foreground/50">Endereço</h3>
                        <p className="text-sm sm:text-base lg:text-lg font-light">Placeholder</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm uppercase tracking-widest text-foreground/50">Email</h3>
                        <p className="text-sm sm:text-base lg:text-lg font-light">Placeholder</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm uppercase tracking-widest text-foreground/50">Redes Sociais</h3>
                        <p className="text-sm sm:text-base lg:text-lg font-light">Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
