export default function Projects() {
    return (
        <div className="mx-auto mx-w-6xl px-4 py-16 md:py-24">
            <h2 className="text-2xl md:text-3xl font-medium">Projetos</h2>
            <p>Lista de projetos</p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="h-40 rounded-2xl border border-black/10" />
                <div className="h-40 rounded-2xl border border-black/10" />
                <div className="h-40 rounded-2xl border border-black/10" />
                <div className="h-40 rounded-2xl border border-black/10" />
            </div>
        </div>
    )
}