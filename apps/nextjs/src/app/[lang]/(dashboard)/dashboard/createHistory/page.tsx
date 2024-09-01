import { redirect } from "next/navigation";

import { authOptions, getCurrentUser } from "@saasfly/auth";

import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";
import { CreationHistory } from "~/components/watermark";
import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";


export default async function CreationHistoryPage({
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
        heading={dict.watermark.createHistory.title}
        text={dict.watermark.createHistory.desc}
      />
      <div className="grid gap-10">
        <CreationHistory />
      </div>
    </DashboardShell>
  );
}
