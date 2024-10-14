import { authOptions, getCurrentUser } from "@saasfly/auth";
import { redirect } from "next/navigation";

import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";
import { ValidateWatermark } from "~/components/watermark";
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
          heading={dict.watermark.validating.title}
          text={dict.watermark.validating.desc}
        >
        </DashboardHeader>
        <div className="flex justify-center mt-5">
          <ValidateWatermark
            lang={lang}
            dragndrop_title={dict.common.dragndrop.title}
            dragndrop_desc={dict.common.dragndrop.desc}
            dragndrop_warn={dict.common.dragndrop.waring}
            submit={dict.watermark.validating.submit}
            input_wm_warning={dict.common.watermark.input_wm_warning}
            correct_wm={dict.watermark.validating.correct_wm}
            incorrect_wm={dict.watermark.validating.incorrect_wm}
          />
        </div>
      </DashboardShell>
    );
}