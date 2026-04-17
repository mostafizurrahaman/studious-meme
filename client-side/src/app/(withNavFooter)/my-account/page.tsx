import { SeoScripts } from '@/components/SeoScripts';
import { MyAccountAuthForm } from '@/components/MyAccountAuthForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { myAccountMetadata, myAccountSchemas } from '@/lib/seo';
import { submitSignOut } from '@/app/(withNavFooter)/my-account/actions';
import { getCurrentUser } from '@/services/Auth';
import { getDashboardPath } from '@/lib/dashboard';
import Link from 'next/link';

export const metadata = myAccountMetadata;

export default async function MyAccountPage() {
  const user = await getCurrentUser();

  return (
    <>
      <SeoScripts data={myAccountSchemas} />
      <main className="flex-1 bg-background pb-16">
        <div className="mx-auto w-full max-w-350 px-4 py-6 lg:px-6">
          <Card className="p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Account access
            </p>
            <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">
              My Account
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
              Account access and profile summary backed by the current auth session.
            </p>
          </Card>

          {user ? (
            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <Card className="p-6 shadow-sm">
                <h2 className="text-2xl font-black text-secondary">Current session</h2>
                <div className="mt-5 grid gap-4 text-sm text-foreground/70">
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-foreground/45">Name</div>
                    <div className="mt-1 font-semibold text-foreground">{user.name}</div>
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-foreground/45">Email</div>
                    <div className="mt-1 font-semibold text-foreground">{user.email}</div>
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-foreground/45">Role</div>
                    <div className="mt-1 font-semibold text-foreground">{user.role}</div>
                  </div>
                </div>

                <form action={submitSignOut} className="mt-6">
                  <div className="flex flex-wrap gap-3">
                    <Button asChild type="button" className="h-11 rounded-full px-6 text-sm font-bold shadow-sm">
                      <Link href={getDashboardPath(user.role)}>Open dashboard</Link>
                    </Button>
                    <Button type="submit" variant="outline" className="h-11 rounded-full px-6 text-sm font-bold shadow-sm">
                      Sign out
                    </Button>
                  </div>
                </form>
              </Card>

              <Card className="border-0 bg-secondary p-6 text-secondary-foreground shadow-sm">
                <h2 className="text-2xl font-black">Account shortcuts</h2>
                <div className="mt-4 space-y-3 text-sm text-secondary-foreground/80">
                  {[
                    'Open dashboard for admin tasks',
                    'Continue with compare and order history flows',
                    'Use quotation requests for B2B buying support',
                  ].map(item => (
                    <div key={item} className="rounded-2xl bg-white/10 px-4 py-3">
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          ) : (
            <MyAccountAuthForm />
          )}
        </div>
      </main>
    </>
  );
}
