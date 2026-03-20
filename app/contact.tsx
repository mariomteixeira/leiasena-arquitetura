export default function Contact() {
    return (
        <div className="flex flex-col justify-center h-full px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
                    Contato
                </h2>
                <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-widest text-foreground/50">Endereço</h3>
                        <p className="text-base sm:text-lg font-light">Placeholder</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-widest text-foreground/50">Email</h3>
                        <p className="text-base sm:text-lg font-light">Placeholder</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm uppercase tracking-widest text-foreground/50">Redes Sociais</h3>
                        <p className="text-base sm:text-lg font-light">Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
