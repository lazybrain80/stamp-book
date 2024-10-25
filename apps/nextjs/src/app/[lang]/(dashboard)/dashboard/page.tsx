import { authOptions, getCurrentUser } from "@saasfly/auth";
import { redirect } from "next/navigation";

import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";
import { SecureStampDashboard } from "~/components/watermark"
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
          heading={dict.watermark.dashboard.title}
          text={dict.watermark.dashboard.desc}
        >
        </DashboardHeader>
        <div className="flex justify-center mt-5">
          <SecureStampDashboard
            total_wm_usage_title={dict.watermark.dashboard.total_watermark_usage}
            today_valid_usage_title={dict.watermark.dashboard.today_validate_usage}
            total_valid_usage_title={dict.watermark.dashboard.total_validate_usage}
            weekly_wm_usage_title={dict.watermark.dashboard.weekly_watermark_usage}
            weekly_valid_usage_title={dict.watermark.dashboard.weekly_validate_usage}
            weekdays={dict.common.weekdays}
          />
        </div>
      </DashboardShell>
    );
}
