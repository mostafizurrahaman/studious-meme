import { COD_MIN_SUBTOTAL_BDT, COD_REASONS, SHIPPING_RULES, SHIPPING_ZONE, type TShippingZone } from './order.constants';

export type CodEligibilityInput = {
    subtotal: number;
    itemBlocksCod: boolean;
};

export function normalizeText(value?: string) {
    return (value ?? '').trim().toLowerCase();
}

export function deriveShippingZone(city?: string, address?: string): TShippingZone {
    const combined = `${normalizeText(city)} ${normalizeText(address)}`;

    return combined.includes('dhaka') ? SHIPPING_ZONE.INSIDE_DHAKA : SHIPPING_ZONE.OUTSIDE_DHAKA;
}

export function calculateShippingCharge({ totalWeightKg, zone }: { totalWeightKg: number; zone: TShippingZone }) {
    const rules = SHIPPING_RULES[zone];

    if (!Number.isFinite(totalWeightKg) || totalWeightKg <= 0) {
        return 0;
    }

    if (totalWeightKg <= 1) {
        return rules.baseCharge;
    }

    const extraKg = Math.ceil(totalWeightKg - 1);
    return rules.baseCharge + extraKg * rules.additionalCharge;
}

export function calculateCodEligibility({ subtotal, itemBlocksCod }: CodEligibilityInput) {
    const reasons: string[] = [];

    if (!Number.isFinite(subtotal) || subtotal <= COD_MIN_SUBTOTAL_BDT) {
        reasons.push(COD_REASONS.subtotal);
    }

    if (itemBlocksCod) {
        reasons.push(COD_REASONS.blockedByProduct);
    }

    return {
        eligible: reasons.length === 0,
        reasons,
    };
}

export function formatShippingZoneLabel(zone: TShippingZone) {
    return zone === SHIPPING_ZONE.INSIDE_DHAKA ? 'Inside Dhaka' : 'Outside Dhaka';
}

export function getTotalWeightKg(totalWeightKg: number) {
    return Number(totalWeightKg.toFixed(2));
}
