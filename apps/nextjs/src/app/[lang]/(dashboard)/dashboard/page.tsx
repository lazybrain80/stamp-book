import { authOptions, getCurrentUser } from "@saasfly/auth";
import { redirect } from "next/navigation";

import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";
import { CreateWatermark } from "~/components/watermark";
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
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login");
  }

  // const accout
    const dict = await getDictionary(lang);
    return (
      <DashboardShell>
        <DashboardHeader
          heading={dict.common.dashboard.title}
          text={dict.common.dashboard.desc}
        >
        </DashboardHeader>
        <div className="flex justify-center mt-5">
          <CreateWatermark
            title={dict.common.dragndrop.title}
            desc={dict.common.dragndrop.desc}
          />
        </div>
      </DashboardShell>
    );
}
