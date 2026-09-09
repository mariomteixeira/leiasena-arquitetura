import { notFound } from "next/navigation";
import { variants } from "../../_previews";
import PreviewPager from "../../_previews/_shared/preview-pager";

export default async function PreviewPage({
    params,
    searchParams,
}: {
    params: Promise<{ n: string }>;
    searchParams: Promise<{ clean?: string }>;
}) {
    const { n } = await params;
    const { clean } = await searchParams;
    const index = Number.parseInt(n, 10) - 1;
    const variant = variants[index];
    if (!variant) notFound();
    const { default: Variant } = await variant.load();
    const showPager = process.env.NODE_ENV !== "production" && clean === undefined;
    return (
        <>
            <Variant />
            {showPager && <PreviewPager current={index + 1} total={variants.length} name={variant.name} />}
        </>
    );
}
