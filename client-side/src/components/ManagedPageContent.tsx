import { PageShell } from "@/components/PageShell";
import type { BackendPage } from "@/lib/page-content";

type ManagedPageContentProps = {
  page: BackendPage | null;
  fallbackTitle: string;
  fallbackDescription: string;
  fallback: React.ReactNode;
};

function sanitizeManagedHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\shref=["']javascript:[^"']*["']/gi, "");
}

export function ManagedPageContent({
  page,
  fallbackTitle,
  fallbackDescription,
  fallback,
}: ManagedPageContentProps) {
  const content = page?.content?.trim();

  return (
    <PageShell
      title={page?.title?.trim() || fallbackTitle}
      description={fallbackDescription}
    >
      {content ? (
        <div
          className="text-sm leading-7 text-foreground/70 [&_a]:font-semibold [&_a]:text-primary [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-black [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-bold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: sanitizeManagedHtml(content) }}
        />
      ) : (
        fallback
      )}
    </PageShell>
  );
}
