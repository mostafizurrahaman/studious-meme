import { HomePage } from '@/components/HomePage';
import { SeoScripts } from '@/components/SeoScripts';
import { homeMetadata, homeSchemas } from '@/lib/seo';
import { getHomeContent } from '@/services/HeroSection';

export const metadata = homeMetadata;

export default async function Page() {
    const heroContent = await getHomeContent().catch(() => null);

    return (
        <>
            <SeoScripts data={homeSchemas} />
            <HomePage heroContent={heroContent?.data ?? null} />
        </>
    );
}
