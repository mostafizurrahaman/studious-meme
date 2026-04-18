'use server';

import { createContact } from '@/services/Contact';

export type QuotationRequestState = { ok: false; message: string } | { ok: true; message: string };

function readValue(formData: FormData, key: string) {
    return String(formData.get(key) ?? '').trim();
}

export async function submitQuotationRequest(
    _prevState: QuotationRequestState,
    formData: FormData,
): Promise<QuotationRequestState> {
    const name = readValue(formData, 'name');
    const company = readValue(formData, 'company');
    const email = readValue(formData, 'email').toLowerCase();
    const phone = readValue(formData, 'phone');
    const products = readValue(formData, 'products');
    const brand = readValue(formData, 'brand');
    const message = readValue(formData, 'message');

    if (!name || !email || !phone || !products || !message) {
        return { ok: false, message: 'Please complete all required quotation fields.' };
    }

    const subjectParts = ['Quotation Request', company, brand].filter(Boolean);
    const payload = {
        name,
        email,
        phone,
        subject: subjectParts.join(' - ').slice(0, 120),
        message: [
            company ? `Company: ${company}` : '',
            brand ? `Brand preference: ${brand}` : '',
            `Interested products: ${products}`,
            `Project details: ${message}`,
        ]
            .filter(Boolean)
            .join('\n\n'),
    };

    const result = await createContact(payload);

    if (!result?.success) {
        return { ok: false, message: result?.message ?? 'Failed to submit quotation request.' };
    }

    return {
        ok: true,
        message: result.message ?? 'Quotation request submitted successfully.',
    };
}
