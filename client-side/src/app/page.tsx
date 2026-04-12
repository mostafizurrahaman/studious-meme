import { HomePage } from '@/components/HomePage';
import { SeoScripts } from '@/components/SeoScripts';
import { homeMetadata, homeSchemas } from '@/lib/seo';

export const metadata = homeMetadata;

export default function Page() {
  return (
    <>
      <SeoScripts data={homeSchemas} />
      <HomePage />
    </>
  );
}
