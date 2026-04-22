'use client';

import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableFilter } from '@/components/ui/table-filter';
import { TablePagination } from '@/components/ui/table-pagination';
import { formatDashboardDate } from '@/lib/formatDate';
import type { BackendContact } from '@/services/Contact';

type Props = {
  contacts: BackendContact[];
  meta: { page: number; limit: number; total: number; totalPage: number };
  searchTerm?: string;
};

export function DashboardQuotationRequestsManager({ contacts, meta, searchTerm = '' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchTerm);

  const updateQuery = useCallback(
    (updates: { page?: number; limit?: number; searchTerm?: string }) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      const nextSearch = updates.searchTerm ?? search;

      nextParams.set('page', String(updates.page ?? meta.page));
      nextParams.set('limit', String(updates.limit ?? meta.limit));

      if (nextSearch.trim()) {
        nextParams.set('searchTerm', nextSearch.trim());
      } else {
        nextParams.delete('searchTerm');
      }

      router.push(`${pathname}?${nextParams.toString()}`);
    },
    [meta.limit, meta.page, pathname, router, search, searchParams],
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    updateQuery({ page: 1, searchTerm: value });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Quotation Requests</CardTitle>
          <CardDescription>
            Showing {contacts.length} of {meta.total} quotation/contact submissions.
          </CardDescription>
        </div>
        <TableFilter
          key={searchTerm}
          value={search}
          onChange={handleSearchChange}
          placeholder="Search requests..."
          className="w-full max-w-xs"
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No quotation requests found.
                </TableCell>
              </TableRow>
            ) : null}
            {contacts.map(contact => (
              <TableRow key={contact._id}>
                <TableCell className="min-w-40 font-medium">
                  <div>{contact.name}</div>
                  <div className="text-xs text-muted-foreground">{contact.subject}</div>
                </TableCell>
                <TableCell>{contact.company || '-'}</TableCell>
                <TableCell className="min-w-44">
                  <div>{contact.email}</div>
                  <div className="text-xs text-muted-foreground">{contact.phone}</div>
                </TableCell>
                <TableCell>{contact.brand || 'Any suitable brand'}</TableCell>
                <TableCell className="max-w-70 whitespace-pre-wrap text-sm leading-6">
                  {contact.products || '-'}
                </TableCell>
                <TableCell className="max-w-80 whitespace-pre-wrap text-sm leading-6">
                  {contact.message}
                </TableCell>
                <TableCell>
                  <Badge variant={contact.isReplied ? 'default' : 'secondary'}>
                    {contact.isReplied ? 'Replied' : 'New'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span title={formatDashboardDate(contact.createdAt, { time: true })}>
                    {formatDashboardDate(contact.createdAt)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {meta.total > 0 ? (
          <div className="mt-4 border-t pt-4">
            <TablePagination
              page={meta.page}
              limit={meta.limit}
              total={meta.total}
              onPageChange={page => updateQuery({ page })}
              onLimitChange={limit => updateQuery({ page: 1, limit })}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
