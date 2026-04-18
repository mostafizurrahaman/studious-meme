'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import {
    submitQuotationRequest,
    type QuotationRequestState,
} from '@/app/(withNavFooter)/quotation-request/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type QuotationRequestFormClientProps = {
    brands: string[];
};

const initialState: QuotationRequestState = {
    ok: false,
    message: '',
};

export function QuotationRequestFormClient({ brands }: QuotationRequestFormClientProps) {
    const [state, formAction, isPending] = useActionState(submitQuotationRequest, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!state.message) {
            return;
        }

        if (state.ok) {
            toast.success(state.message);
            formRef.current?.reset();
            return;
        }

        toast.error(state.message);
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Full name
                    <Input name="name" placeholder="Your name" required />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Company
                    <Input name="company" placeholder="Company / organization" />
                </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Email
                    <Input name="email" type="email" placeholder="name@company.com" required />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-foreground">
                    Phone
                    <Input name="phone" placeholder="01XXXXXXXXX" required />
                </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
                Interested products
                <Textarea
                    name="products"
                    placeholder="List the items, quantity and any specification details"
                    className="min-h-32"
                    required
                />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
                Brand preference
                <select
                    name="brand"
                    defaultValue=""
                    className="h-11 rounded-2xl border border-input bg-background px-4 outline-none"
                >
                    <option value="">Any suitable brand</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-foreground">
                Message
                <Textarea
                    name="message"
                    placeholder="Tell us about the project timeline, delivery location and special requirements"
                    className="min-h-36"
                    required
                />
            </label>
            <Button
                type="submit"
                disabled={isPending}
                className="h-11 w-fit rounded-full px-6 text-sm font-bold shadow-sm"
            >
                {isPending ? 'Submitting...' : 'Request quotation'}
            </Button>
        </form>
    );
}
