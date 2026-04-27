import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { siteConfig, siteAboutSections } from '@/lib/seo';

export function HomeAboutSection() {
  return (
    <Card className="mt-8 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-medium text-secondary sm:text-2xl">
          {siteConfig.name} - Online Hardware Store Bangladesh
        </h2>
        <Separator className="my-5" />
        <div className="space-y-6 text-sm leading-7 text-foreground/70">
          {siteAboutSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-secondary">{section.heading}</h3>
              <p className="mt-1">{section.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
