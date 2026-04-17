'use client';

import { ImagePlus, Link2, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FileUploadProps = {
    value?: string;
    onChange: (url: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

/**
 * Hybrid image input: paste URL OR select local file for preview (upload on form submit)
 */
export function FileUpload({ value, onChange, placeholder = 'Paste image URL', disabled }: FileUploadProps) {
    const [isEditing, setIsEditing] = useState(!value);
    const [url, setUrl] = useState(value || '');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUrlSubmit = () => {
        if (url) onChange(url);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setUrl(objectUrl);
        }
    };

    const handleClear = () => {
        onChange('');
        setUrl('');
        setIsEditing(true);
    };

    if (value && !isEditing) {
        return (
            <div className="space-y-2">
                <div className="relative overflow-hidden rounded-lg border bg-muted">
                    <img src={value} alt="Preview" className="h-32 w-full object-cover" />
                    <Button type="button" size="sm" variant="destructive" className="absolute right-2 top-2 h-8 w-8 rounded-full p-0" onClick={handleClear} disabled={disabled}>
                        <X className="size-4" />
                    </Button>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)} disabled={disabled}>
                    <ImagePlus className="mr-2 size-4" />
                    Change
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} disabled={disabled} />
            <div className="flex gap-2">
                <Input value={url} onChange={e => setUrl(e.target.value)} placeholder={placeholder} disabled={disabled} className="flex-1" />
                <Button type="button" onClick={handleUrlSubmit} disabled={disabled || !url}>
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Link2 className="size-4" />}
                </Button>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
                    <ImagePlus className="size-4" />
                </Button>
            </div>
        </div>
    );
}