import Logo from "./_components/logo";
import Avatar from "./_components/avatar";
import { ChevronRightIcon, linkIcons } from "./_components/icons";
import { bio } from "./_lib/bio";
import { delay } from "./_lib/motion";

/* /bio — hub de links. Creme + azul da marca, pílulas serifadas, foto circular com anel que se desenha. */
export default function BioPage() {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center bg-[#F4F1EA] px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.75rem,env(safe-area-inset-bottom))] text-navy">
            <style href="bio" precedence="default">{`body{background:#F4F1EA}`}</style>

            <div className="flex w-full max-w-[420px] flex-col items-center text-center">
                <Logo className="w-28 bio-rise" style={delay(0)} />

                <div className="relative mt-6 bio-rise" style={delay(120)}>
                    <svg className="absolute -inset-2.5 size-[calc(100%+1.25rem)] -rotate-90" viewBox="0 0 100 100" fill="none" aria-hidden>
                        <circle cx="50" cy="50" r="48.75" stroke="currentColor" strokeWidth="1.5" pathLength="1" className="bio-draw" style={delay(300)} />
                    </svg>
                    <Avatar className="size-28" />
                </div>

                <h1 className="mt-5 font-serif text-[1.55rem] leading-tight tracking-tight bio-rise" style={delay(200)}>
                    {bio.role}
                </h1>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-navy/80 bio-rise" style={delay(260)}>
                    {bio.text}
                </p>

                <nav className="mt-6 flex w-full flex-col gap-2.5" aria-label="Links">
                    {bio.links.map((link, i) => {
                        const Icon = linkIcons[link.id];
                        return (
                            <div key={link.id} className="bio-rise" style={delay(380 + i * 90)}>
                                <a
                                    href={link.href}
                                    target={link.external ? "_blank" : undefined}
                                    rel={link.external ? "noopener noreferrer" : undefined}
                                    className="group relative flex h-[60px] items-center rounded-full bg-navy pl-3 pr-[52px] text-[#F4F1EA] shadow-[0_14px_28px_-14px_rgba(49,60,89,0.6)] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
                                >
                                    <span className="flex size-10 items-center justify-center rounded-full border border-[#F4F1EA]/55 transition-colors duration-300 group-hover:bg-[#F4F1EA] group-hover:text-navy">
                                        <Icon className="size-5" />
                                    </span>
                                    <span className="flex-1 px-2 text-center font-serif text-[1.3rem] tracking-wide">
                                        {link.label}
                                    </span>
                                    <ChevronRightIcon className="absolute right-5 size-5 opacity-60 transition-transform duration-300 group-hover:translate-x-1" />
                                </a>
                            </div>
                        );
                    })}
                </nav>
            </div>
        </main>
    );
}
