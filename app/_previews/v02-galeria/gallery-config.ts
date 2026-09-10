/**
 * Layout of the floating prints. Shared by the WebGL scene and the static CSS
 * collage so both show the same first frame.
 */
import { projects } from "../_shared/content";

export interface PrintPose {
    x: number;
    y: number;
    z: number;
    /** width in world units */
    w: number;
    /** base yaw in radians */
    yaw: number;
}

export interface Print {
    id: string;
    src: string;
    alt: string;
    /** width / height of the source render */
    aspect: number;
    /** width requested from the image optimizer */
    size: 1080 | 640;
    /** bob phase */
    phase: number;
    desktop: PrintPose;
    /** only the five prints with a mobile pose are shown on phones */
    mobile?: PrintPose;
}

export interface CameraSpec {
    fov: number;
    zStart: number;
    zEnd: number;
    /** viewport aspect assumed by the CSS collage projection */
    aspect: number;
}

export const CAMERA: { desktop: CameraSpec; mobile: CameraSpec } = {
    desktop: { fov: 45, zStart: 8, zEnd: -6, aspect: 1.6 },
    mobile: { fov: 60, zStart: 8, zEnd: -3, aspect: 0.46 },
};

export const FOG = { color: "#ddd9ce", near: 4, far: 18 };
/** white border around each print, world units */
export const FRAME = 0.05;
/** fraction of the mount texture reserved for the shadow on each side */
export const MOUNT_PAD = 0.2;

export function optimized(src: string, w: number) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
}

export function clamp(v: number, a: number, b: number) {
    return Math.min(b, Math.max(a, v));
}

function pick(slug: string) {
    const p = projects.find((x) => x.slug === slug);
    if (!p) throw new Error(`projeto ${slug} ausente`);
    return p;
}

const anny = pick("anny");
const debora = pick("debora");
const felipe = pick("felipe");
const gustavo = pick("gustavo");

const WIDE = 16 / 9;

export const PRINTS: Print[] = [
    {
        id: "anny-01",
        src: anny.cover,
        alt: `Projeto ${anny.title}`,
        aspect: WIDE,
        size: 1080,
        phase: 0,
        desktop: { x: 1.7, y: -0.55, z: 2.8, w: 3.6, yaw: -0.1 },
        mobile: { x: 0.35, y: -1.15, z: 2.6, w: 2.2, yaw: -0.06 },
    },
    {
        id: "felipe-01",
        src: felipe.cover,
        alt: `Projeto ${felipe.title}`,
        aspect: 7 / 4,
        size: 1080,
        phase: 1.3,
        desktop: { x: -2.4, y: 0.55, z: -0.6, w: 3.2, yaw: 0.14 },
        mobile: { x: -0.6, y: 1.25, z: 0.2, w: 2.0, yaw: 0.08 },
    },
    {
        id: "gustavo-01",
        src: gustavo.cover,
        alt: `Projeto ${gustavo.title}`,
        aspect: 2176 / 1856,
        size: 1080,
        phase: 2.1,
        desktop: { x: -0.55, y: -1.75, z: 0.6, w: 2.4, yaw: 0.05 },
        mobile: { x: 1.3, y: 2.6, z: -1.6, w: 1.5, yaw: -0.06 },
    },
    {
        id: "debora-01",
        src: debora.cover,
        alt: `Projeto ${debora.title}`,
        aspect: WIDE,
        size: 1080,
        phase: 0.7,
        desktop: { x: 3.2, y: 1.7, z: -2.6, w: 3.0, yaw: -0.18 },
        mobile: { x: -0.5, y: -2.7, z: -3.2, w: 2.0, yaw: 0.1 },
    },
    {
        id: "anny-03",
        src: anny.images[2] ?? anny.cover,
        alt: `Projeto ${anny.title}`,
        aspect: WIDE,
        size: 640,
        phase: 2.9,
        desktop: { x: -3.4, y: -1.2, z: -4.6, w: 2.8, yaw: 0.2 },
    },
    {
        id: "felipe-03",
        src: felipe.images[2] ?? felipe.cover,
        alt: `Projeto ${felipe.title}`,
        aspect: WIDE,
        size: 640,
        phase: 1.7,
        desktop: { x: 0.8, y: 2.3, z: -6.2, w: 3.4, yaw: -0.05 },
    },
    {
        id: "gustavo-03",
        src: gustavo.images[2] ?? gustavo.cover,
        alt: `Projeto ${gustavo.title}`,
        aspect: WIDE,
        size: 640,
        phase: 3.6,
        desktop: { x: 1.1, y: -0.35, z: -8, w: 2.6, yaw: -0.12 },
        mobile: { x: 0.4, y: 0.3, z: -6.5, w: 2.0, yaw: 0 },
    },
    {
        id: "debora-03",
        src: debora.images[2] ?? debora.cover,
        alt: `Projeto ${debora.title}`,
        aspect: WIDE,
        size: 640,
        phase: 4.4,
        desktop: { x: -1.1, y: 0.55, z: -8, w: 2.6, yaw: 0.1 },
    },
];

export function printsFor(compact: boolean) {
    return compact ? PRINTS.filter((p) => p.mobile) : PRINTS;
}

export function poseOf(p: Print, compact: boolean): PrintPose {
    return compact && p.mobile ? p.mobile : p.desktop;
}

/** fog factor 0..1 at distance d from the camera */
export function fogAt(d: number) {
    return clamp((d - FOG.near) / (FOG.far - FOG.near), 0, 1);
}

/** Projects a print onto the CSS collage (percent of the stage) at the starting camera. */
export function cssBox(p: Print, compact: boolean) {
    const cam = compact ? CAMERA.mobile : CAMERA.desktop;
    const pose = poseOf(p, compact);
    const d = cam.zStart - pose.z;
    const hh = Math.tan((cam.fov * Math.PI) / 360) * d;
    const hw = hh * cam.aspect;
    return {
        left: 50 + (pose.x / hw) * 50,
        top: 50 - (pose.y / hh) * 50,
        width: (pose.w / hw) * 50,
        opacity: 1 - fogAt(d) * 0.85,
        z: Math.round(pose.z * 10) + 100,
    };
}
