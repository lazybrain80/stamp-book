import { authOptions, getCurrentUser } from "@saasfly/auth";
import { redirect } from "next/navigation";

import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  //don't need to check auth here, because we have a global auth check in _app.tsx
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login");
  }

  // const accout
    const dict = await getDictionary(lang);
    return (
      <DashboardShell>
        <DashboardHeader
          heading="kubernetes"
          text={dict.common.dashboard.title_text}
        >
        </DashboardHeader>
        <div>
          <EmptyPlaceholder>
            {/*<EmptyPlaceholder.Icon />*/}
            <EmptyPlaceholder.Title>
              {dict.business.billing.billing}
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              {dict.business.billing.billing}
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        </div>
      </DashboardShell>
    );
}
