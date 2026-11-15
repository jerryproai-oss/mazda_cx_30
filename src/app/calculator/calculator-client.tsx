"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCostRecord } from "@/app/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { COST_ITEMS } from "@/lib/constants";
import {
  calculateCostSharing,
  type CostInput,
  type CostResult,
} from "@/lib/cost-calculator";
import { Calculator, Check, RotateCcw } from "lucide-react";

interface CalculatorClientProps {
  accumulatedDays: { user1: number; user2: number; user3: number };
}

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const EQUAL_SPLIT_ITEMS = new Set(["牌照稅與燃料稅", "強制險與超額險"]);

export function CalculatorClient({ accumulatedDays }: CalculatorClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [item, setItem] = useState<CostInput["item"]>(COST_ITEMS[0]);
  const [settlementDate, setSettlementDate] = useState(todayString());
  const [totalAmount, setTotalAmount] = useState("");
  const [daysUser1, setDaysUser1] = useState(String(accumulatedDays.user1));
  const [daysUser2, setDaysUser2] = useState(String(accumulatedDays.user2));
  const [daysUser3, setDaysUser3] = useState(String(accumulatedDays.user3));

  // Preview state
  const [preview, setPreview] = useState<CostResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isEqualSplit = EQUAL_SPLIT_ITEMS.has(item);

  function handleCalculate() {
    const amount = Number(totalAmount);
    if (!amount || amount <= 0) return;

    const input: CostInput = {
      item,
      totalAmount: amount,
      daysUser1: isEqualSplit ? 0 : Number(daysUser1) || 0,
      daysUser2: isEqualSplit ? 0 : Number(daysUser2) || 0,
      daysUser3: isEqualSplit ? 0 : Number(daysUser3) || 0,
    };

    const result = calculateCostSharing(input);
    setPreview(result);
    setSubmitted(false);
  }

  function handleSubmit() {
    if (!preview) return;

    const formData = new FormData();
    formData.set("item", item);
    formData.set("totalAmount", totalAmount);
    formData.set("settlementDate", settlementDate);
    formData.set("daysUser1", isEqualSplit ? "0" : daysUser1);
    formData.set("daysUser2", isEqualSplit ? "0" : daysUser2);
    formData.set("daysUser3", isEqualSplit ? "0" : daysUser3);

    startTransition(async () => {
      await createCostRecord(formData);
      setSubmitted(true);
      router.refresh();
    });
  }

  function handleReset() {
    setItem(COST_ITEMS[0]);
    setSettlementDate(todayString());
    setTotalAmount("");
    setDaysUser1(String(accumulatedDays.user1));
    setDaysUser2(String(accumulatedDays.user2));
    setDaysUser3(String(accumulatedDays.user3));
    setPreview(null);
    setSubmitted(false);
  }

  // Compute bar widths for preview
  const totalAmountNum = Number(totalAmount) || 1;
  const barData = preview
    ? [
        { label: "鴻老爹", amount: preview.parentAmount, color: "bg-purple-500" },
        { label: "老大", amount: preview.user1Amount, color: "bg-blue-500" },
        { label: "老二", amount: preview.user2Amount, color: "bg-green-500" },
        { label: "老三", amount: preview.user3Amount, color: "bg-orange-500" },
      ]
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="size-5" />
            費用計算機
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cost Item Select */}
          <div className="space-y-2">
            <Label>費用項目</Label>
            <Select value={item} onValueChange={(val) => setItem(val as CostInput["item"])}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COST_ITEMS.map((costItem) => (
                  <SelectItem key={costItem} value={costItem}>
                    {costItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Formula explanation */}
          <div className="rounded-lg border p-3 text-sm text-muted-foreground">
            {isEqualSplit ? (
              <>
                <Badge className="mb-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  均分制 (B)
                </Badge>
                <p>
                  父母負擔 30%，剩餘 70% 由三位子女均分。不參考使用天數。
                </p>
              </>
            ) : (
              <>
                <Badge className="mb-1.5 bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
                  雙軌制 (A)
                </Badge>
                <p>
                  {item === "一般保養"
                    ? "父母不負擔，100% 子女分攤。"
                    : "父母負擔 30%，剩餘 70% 子女分攤。"}
                  {" "}子女池 50% 均分 + 50% 按使用天數比例。
                </p>
              </>
            )}
          </div>

          {/* Settlement Date */}
          <div className="space-y-2">
            <Label htmlFor="settlementDate">結算日期</Label>
            <Input
              id="settlementDate"
              type="date"
              value={settlementDate}
              onChange={(e) => setSettlementDate(e.target.value)}
            />
          </div>

          {/* Total Amount */}
          <div className="space-y-2">
            <Label htmlFor="totalAmount">費用總額 (NT$)</Label>
            <Input
              id="totalAmount"
              type="number"
              min="0"
              step="1"
              placeholder="輸入費用總額"
              value={totalAmount}
              onChange={(e) => {
                setTotalAmount(e.target.value);
                setPreview(null);
              }}
            />
          </div>

          {/* Days inputs – hidden for equal split items */}
          {!isEqualSplit && (
            <div className="space-y-4">
              <Separator />
              <p className="text-sm font-medium">累計使用天數</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daysUser1" className="text-blue-600 dark:text-blue-400">
                    老大天數
                  </Label>
                  <Input
                    id="daysUser1"
                    type="number"
                    min="0"
                    value={daysUser1}
                    onChange={(e) => {
                      setDaysUser1(e.target.value);
                      setPreview(null);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysUser2" className="text-green-600 dark:text-green-400">
                    老二天數
                  </Label>
                  <Input
                    id="daysUser2"
                    type="number"
                    min="0"
                    value={daysUser2}
                    onChange={(e) => {
                      setDaysUser2(e.target.value);
                      setPreview(null);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysUser3" className="text-orange-600 dark:text-orange-400">
                    老三天數
                  </Label>
                  <Input
                    id="daysUser3"
                    type="number"
                    min="0"
                    value={daysUser3}
                    onChange={(e) => {
                      setDaysUser3(e.target.value);
                      setPreview(null);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator className="mr-2 size-4" />
              計算預覽
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 size-4" />
              重設
            </Button>
          </div>

          {/* Preview Section */}
          {preview && (
            <div className="space-y-4">
              <Separator />
              <h3 className="text-sm font-medium">分攤預覽</h3>

              {/* Amount breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 dark:border-purple-800 dark:bg-purple-900/20">
                  <span className="text-sm text-purple-700 dark:text-purple-300">鴻老爹應付</span>
                  <span className="font-semibold text-purple-900 dark:text-purple-100">
                    NT$ {preview.parentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-900/20">
                  <span className="text-sm text-blue-700 dark:text-blue-300">老大應付</span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                    NT$ {preview.user1Amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-900/20">
                  <span className="text-sm text-green-700 dark:text-green-300">老二應付</span>
                  <span className="font-semibold text-green-900 dark:text-green-100">
                    NT$ {preview.user2Amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 dark:border-orange-800 dark:bg-orange-900/20">
                  <span className="text-sm text-orange-700 dark:text-orange-300">老三應付</span>
                  <span className="font-semibold text-orange-900 dark:text-orange-100">
                    NT$ {preview.user3Amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Audit check */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">總額檢核：</span>
                {preview.auditCheck ? (
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <Check className="mr-1 size-3" />
                    通過 ✓
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    未通過 ✗
                  </Badge>
                )}
              </div>

              {/* Visual bar chart */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">比例圖</p>
                <div className="flex h-6 w-full overflow-hidden rounded-lg">
                  {barData.map((bar) => {
                    const pct =
                      totalAmountNum > 0
                        ? (bar.amount / totalAmountNum) * 100
                        : 0;
                    if (pct <= 0) return null;
                    return (
                      <div
                        key={bar.label}
                        className={`${bar.color} flex items-center justify-center text-[10px] font-medium text-white transition-all`}
                        style={{ width: `${pct}%` }}
                        title={`${bar.label}: NT$ ${bar.amount.toLocaleString()} (${pct.toFixed(1)}%)`}
                      >
                        {pct >= 10 ? `${bar.label} ${pct.toFixed(0)}%` : ""}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {barData.map((bar) => (
                    <div key={bar.label} className="flex items-center gap-1">
                      <span className={`inline-block size-2.5 rounded-full ${bar.color}`} />
                      {bar.label}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Submit button */}
              {submitted ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <Check className="size-4" />
                  已成功入帳！費用紀錄已建立。
                </div>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isPending || !preview.auditCheck}
                  className="w-full"
                  variant="default"
                >
                  <Check className="mr-2 size-4" />
                  {isPending ? "入帳中…" : "確認入帳"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
