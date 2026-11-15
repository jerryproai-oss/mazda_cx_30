import { Suspense } from "react";
import { connection } from "next/server";
import { getCostRecords } from "@/app/actions";
import { HistoryClient } from "./history-client";

async function HistoryContent() {
  await connection();
  const records = await getCostRecords();
  return <HistoryClient records={records} />;
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><span className="text-muted-foreground animate-pulse">載入歷史記錄...</span></div>}>
      <HistoryContent />
    </Suspense>
  );
}
