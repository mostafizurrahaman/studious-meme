'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Bold,
  ExternalLink,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { pageLabels, publicPagePathBySlug, type BackendPage, type DashboardPageSlug } from '@/lib/page-content';
import { createOrUpdatePageByType } from '@/services/Page';

type DashboardPagesManagerProps = {
  page: BackendPage | null;
  slug: DashboardPageSlug;
};

const emptyContent = '<p>Write page content here.</p>';

function runEditorCommand(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export function DashboardPagesManager({ page, slug }: DashboardPagesManagerProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(page?.title ?? pageLabels[slug]);
  const [content, setContent] = useState(page?.content ?? emptyContent);
  const [isPending, startTransition] = useTransition();
  const publicPath = publicPagePathBySlug[slug];

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const plainText = useMemo(() => content.replace(/<[^>]+>/g, '').trim(), [content]);

  function syncEditorContent() {
    setContent(editorRef.current?.innerHTML ?? '');
  }

  function focusEditor() {
    editorRef.current?.focus();
  }

  function handleFormat(command: string, value?: string) {
    focusEditor();
    runEditorCommand(command, value);
    syncEditorContent();
  }

  function handleLink() {
    const url = window.prompt('Enter link URL');
    if (!url) return;

    handleFormat('createLink', url);
  }

  function handleSave() {
    startTransition(async () => {
      if (!title.trim()) {
        toast.error('Title is required.');
        return;
      }

      if (plainText.length < 10) {
        toast.error('Content must be at least 10 characters long.');
        return;
      }

      const result = await createOrUpdatePageByType({
        slug,
        title: title.trim(),
        content,
      });

      if (!result?.success) {
        toast.error(result?.message ?? 'Failed to save page.');
        return;
      }

      toast.success(result.message ?? 'Page saved successfully.');
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="shadow-sm">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{pageLabels[slug]}</CardTitle>
              <CardDescription>
                Update storefront page content from the dashboard rich text editor.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link href={publicPath} target="_blank">
                <ExternalLink className="size-4" />
                View page
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="page-title">
              Page title
            </label>
            <Input
              id="page-title"
              value={title}
              onChange={event => setTitle(event.target.value)}
              className="h-10 bg-background text-sm"
            />
          </div>

          <div className="overflow-hidden rounded-xl border bg-background">
            <div className="flex flex-wrap items-center gap-1 border-b bg-muted/35 p-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat('bold')}>
                <Bold className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat('italic')}>
                <Italic className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat('formatBlock', 'h2')}>
                <Heading2 className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat('insertUnorderedList')}>
                <List className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat('insertOrderedList')}>
                <ListOrdered className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleLink}>
                <LinkIcon className="size-4" />
              </Button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncEditorContent}
              onBlur={syncEditorContent}
              className="min-h-[360px] px-5 py-4 text-sm leading-7 outline-none [&_a]:font-semibold [&_a]:text-primary [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-black [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Last updated: {page?.updatedAt ? new Date(page.updatedAt).toLocaleString() : 'Not saved yet'}
            </p>
            <Button type="button" size="lg" disabled={isPending} onClick={handleSave}>
              <Save className="size-4" />
              {isPending ? 'Saving...' : 'Save content'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit shadow-sm">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>This is how the saved rich content will flow on the public page.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border bg-muted/20 p-4">
            <h2 className="text-xl font-black text-secondary">{title || pageLabels[slug]}</h2>
            <div
              className="mt-4 text-sm leading-7 text-foreground/70 [&_a]:font-semibold [&_a]:text-primary [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-black [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
