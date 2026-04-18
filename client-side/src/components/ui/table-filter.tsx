'use client';

import { X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TableFilterProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export function TableFilter({ value, onChange, placeholder = 'Search...', className }: TableFilterProps) {
    const debouncedChange = useDebouncedCallback(onChange, 300);

    return (
        <div className={`flex gap-2 ${className}`}>
            <Input
                defaultValue={value}
                onChange={e => debouncedChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1"
            />
            {value && (
                <Button type="button" variant="outline" size="icon" onClick={() => onChange('')}>
                    <X className="size-4" />
                </Button>
            )}
        </div>
    );
}
