import { PageShell } from '@/components/PageShell';
import { SeoScripts } from '@/components/SeoScripts';
import { deliveryReturnMetadata, deliveryReturnSchemas } from '@/lib/seo';

export const metadata = deliveryReturnMetadata;

export default function DeliveryReturnPage() {
  return (
    <>
      <SeoScripts data={deliveryReturnSchemas} />
      <PageShell
        title="Delivery & Return Policy"
        description="Delivery, return and refund policy for the storefront."
      >
        <div className="grid gap-4 text-sm leading-7 text-foreground/70">
          <p>
            Delivery details, shipping zones, return conditions and refund handling are
            outlined for the store experience.
          </p>
          <p>
            The policy covers order confirmation, shipment timelines and accepted return
            requests.
          </p>
        </div>
      </PageShell>
    </>
  );
}
