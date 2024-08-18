import { authOptions, getCurrentUser } from "@saasfly/auth";
import { redirect } from "next/navigation";

import { DragAndDropBox } from "~/components/drag-n-drop-box";
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
          heading={dict.common.dashboard.title}
          text={dict.common.dashboard.desc}
        >
        </DashboardHeader>
        <div className="flex justify-center mt-5">
          <DragAndDropBox>
            <DragAndDropBox.Icon name={"Add"}/>
            <DragAndDropBox.Title>
              {dict.common.dragndrop.title}
            </DragAndDropBox.Title>
            <DragAndDropBox.Description>
              {dict.common.dragndrop.desc}
            </DragAndDropBox.Description>
          </DragAndDropBox>
        </div>
      </DashboardShell>
    );
}
