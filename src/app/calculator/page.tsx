import { Suspense } from "react";
import { connection } from "next/server";
import { getAccumulatedDays } from "@/app/actions";
import { CalculatorClient } from "./calculator-client";

async function CalculatorContent() {
  await connection();
  const accumulatedDays = await getAccumulatedDays();
  return <CalculatorClient accumulatedDays={accumulatedDays} />;
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><span className="text-muted-foreground animate-pulse">載入計算機...</span></div>}>
      <CalculatorContent />
    </Suspense>
  );
}
