'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

type TablePaginationProps = {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
};

export function TablePagination({ page, limit, total, onPageChange, onLimitChange }: TablePaginationProps) {
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                    Showing {start}-{end} of {total}
                </span>
                {onLimitChange && (
                    <div className="h-8 w-20">
                        <Select
                            value={String(limit)}
                            onValueChange={value => onLimitChange(Number(value))}
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </Select>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                >
                    <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm">
                    Page {page} of {totalPages}
                </span>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}
