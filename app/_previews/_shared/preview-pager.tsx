import Link from "next/link";

/** Dev-only variant switcher for /preview/[n]. */
export default function PreviewPager({ current, total, name }: { current: number; total: number; name: string }) {
    const prev = current === 1 ? total : current - 1;
    const next = current === total ? 1 : current + 1;
    return (
        <div className="fixed bottom-3 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/80 px-1.5 py-1 font-mono text-[11px] text-white shadow-lg backdrop-blur">
            <Link href={`/preview/${prev}`} className="flex size-7 items-center justify-center rounded-full hover:bg-white/15" aria-label="Anterior">‹</Link>
            <span className="px-2 tabular-nums">{current}/{total} · {name}</span>
            <Link href={`/preview/${next}`} className="flex size-7 items-center justify-center rounded-full hover:bg-white/15" aria-label="Próxima">›</Link>
        </div>
    );
}
