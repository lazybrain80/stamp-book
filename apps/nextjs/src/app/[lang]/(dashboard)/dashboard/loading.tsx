import { BasicItemSkeleton } from "~/components/base-item";
import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Loading pages..."
        text="Now loading the water creating pages."
      ></DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <BasicItemSkeleton />
        <BasicItemSkeleton />
        <BasicItemSkeleton />
      </div>
    </DashboardShell>
  );
}
