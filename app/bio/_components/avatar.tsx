import type { CSSProperties } from "react";
import Image from "next/image";
import { bio } from "../_lib/bio";

export default function Avatar({
    className = "",
    style,
    sizes = "176px",
}: {
    className?: string;
    style?: CSSProperties;
    sizes?: string;
}) {
    return (
        <div className={`relative shrink-0 overflow-hidden rounded-full ${className}`} style={style}>
            <Image
                src={bio.photo}
                alt={bio.name}
                fill
                priority
                sizes={sizes}
                className="object-cover object-[50%_28%]"
            />
        </div>
    );
}
