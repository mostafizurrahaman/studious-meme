import { SeoScripts } from "@/components/SeoScripts";
import { MyAccountAuthForm } from "@/components/MyAccountAuthForm";
import { Card } from "@/components/ui/card";
import { myAccountMetadata, myAccountSchemas } from "@/lib/seo";
import { getCurrentUser } from "@/services/Auth";
import { getDashboardPath } from "@/lib/dashboard";
import { redirect } from "next/navigation";

export const metadata = myAccountMetadata;

export default async function MyAccountPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(getDashboardPath(user.role));
  }

  return (
    <>
      <SeoScripts data={myAccountSchemas} />
      <main className="flex-1 bg-background pb-16">
        <div className="px-4 py-6 lg:px-6">
          <Card className="p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Account access
            </p>
            <h1 className="mt-4 text-3xl font-black text-secondary sm:text-4xl">
              Sign in
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/65 sm:text-base">
              Sign in to continue to your role-based dashboard.
            </p>
          </Card>
          <MyAccountAuthForm />
        </div>
      </main>
    </>
  );
}
