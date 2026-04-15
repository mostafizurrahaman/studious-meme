import { policySections } from '@/lib/malamal-content';
import { SeoScripts } from '@/components/SeoScripts';
import { Card } from '@/components/ui/card';
import { privacyPolicyMetadata, privacyPolicySchemas } from '@/lib/seo';

export const metadata = privacyPolicyMetadata;

export default function PrivacyPolicyPage() {
  return (
    <>
      <SeoScripts data={privacyPolicySchemas} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-240 px-4 py-6 lg:px-6">
          <Card className="p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-black text-secondary sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-sm leading-7 text-foreground/65 sm:text-base">
              Privacy policy for the Malamal storefront.
            </p>
            <div className="mt-8 space-y-6">
              {policySections.map(section => (
                <div key={section.title}>
                  <h2 className="text-xl font-black text-secondary">{section.title}</h2>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-foreground/65">
                    {section.items.map(item => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
