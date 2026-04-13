import Link from 'next/link';
import { SeoScripts } from '@/components/SeoScripts';
import { accountBenefits } from '@/lib/malamal-content';
import { myAccountMetadata, myAccountSchemas } from '@/lib/seo';

export const metadata = myAccountMetadata;

export default function MyAccountPage() {
  return (
    <>
      <SeoScripts data={myAccountSchemas} />
      <main className="flex-1 bg-[#f5f6f8] pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15a24]">
              Account access
            </p>
            <h1 className="mt-4 text-3xl font-black text-[#0e2f56] sm:text-4xl">My Account</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-black/65 sm:text-base">
              Account login and registration area for the storefront customer dashboard.
            </p>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-[#0e2f56]">Login</h2>
              <div className="mt-5 grid gap-4">
                <input className="h-11 rounded-xl border border-black/10 px-4 outline-none" placeholder="Email address" />
                <input className="h-11 rounded-xl border border-black/10 px-4 outline-none" placeholder="Password" />
                <button type="button" className="inline-flex h-11 w-fit cursor-pointer items-center justify-center rounded-full bg-[#f15a24] px-6 text-sm font-bold text-white">
                  Sign in
                </button>
              </div>
              <div className="mt-6 text-sm text-black/55">
                New user? <span className="font-semibold text-[#0e2f56]">Create account</span>
              </div>
            </div>

            <div className="rounded-3xl bg-[#0e2f56] p-6 text-white shadow-sm">
              <h2 className="text-2xl font-black">Why create an account</h2>
              <div className="mt-4 space-y-3 text-sm text-white/80">
                {accountBenefits.map(item => (
                  <div key={item} className="rounded-2xl bg-white/10 px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/quotation-request" className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-bold text-white">
                Request B2B quotation
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
