import { redirect } from "next/navigation";

import { authOptions, getCurrentUser } from "@saasfly/auth";

import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";
import { ValidationHistory } from "~/components/watermark";

export default async function ValidationHistoryPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login");
  }
  const dict = await getDictionary(lang);
  return (
    <DashboardShell>
      <DashboardHeader
        heading={dict.watermark.validateHistory.title}
        text={dict.watermark.validateHistory.desc}
      />
      <div className="grid gap-10">
        <ValidationHistory
          lang={lang}
        />
      </div>
    </DashboardShell>
  );
}
