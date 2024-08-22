import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";
import type { DashboardConfig } from "~/types";

export const getDashboardConfig = async ({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}): Promise<DashboardConfig> => {
  const dict = await getDictionary(lang);

  return {
    mainNav: [
      {
        title: dict.common.dashboard.main_nav_documentation,
        href: "/docs",
        auth: false
      },
    ],
    sidebarNav: [
      {
        id: "wm_maker",
        title: dict.common.dashboard.sidebar_nav_wm_maker,
        href: "/dashboard/",
      },
      {
        id: "wm_maker_validate",
        title: dict.common.dashboard.sidebar_nav_wm_validater,
        href: "/dashboard/validate",
      },
      {
        id: "settings",
        title: dict.common.dashboard.sidebar_nav_settings,
        href: "/dashboard/settings",
      },
    ],
  };
};
