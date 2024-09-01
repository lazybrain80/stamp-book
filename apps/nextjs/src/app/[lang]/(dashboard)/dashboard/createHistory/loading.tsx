import { CardSkeleton } from "~/components/card-skeleton";
import { DashboardHeader } from "~/components/header";
import { DashboardShell } from "~/components/shell";

export default function CreationHistoryLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Loading pages..."
        text="Now loading the watermark history pages."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  );
}
