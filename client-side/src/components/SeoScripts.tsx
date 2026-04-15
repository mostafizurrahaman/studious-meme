import { serializeJsonLd } from '@/lib/seo';
import Script from 'next/script';

type Props = {
    data: unknown | unknown[];
};

export function SeoScripts({ data }: Props) {
    const schemas = Array.isArray(data) ? data : [data];

    return (
        <>
            {schemas.map((schema, index) => (
                <Script
                    key={index}
                    id="org-jsonld"
                    type="application/ld+json"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
                />
            ))}
        </>
    );
}
