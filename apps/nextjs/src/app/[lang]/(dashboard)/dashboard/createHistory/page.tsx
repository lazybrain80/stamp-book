import { redirect } from "next/navigation";

import { authOptions, getCurrentUser } from "@saasfly/auth";

import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";
import { CreationHistory } from "~/components/watermark";

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
};

export default async function CreationHistoryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login");
  }
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Watermark Creation History"
        text="Search and view your watermark creation history."
      />
      <div className="grid gap-10">
        <CreationHistory />
      </div>
    </DashboardShell>
  );
}
