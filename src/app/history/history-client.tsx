"use client";

import { useState, useTransition } from "react";
import { deleteCostRecord } from "@/app/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Search, CheckCircle, XCircle, FileText } from "lucide-react";
import type { CostRecord } from "@/db/schema";
import { COST_ITEMS } from "@/lib/constants";

function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `NT$ ${num.toLocaleString("zh-TW", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  // Already YYYY-MM-DD from the DB
  return dateStr;
}

interface HistoryClientProps {
  records: CostRecord[];
}

export function HistoryClient({ records }: HistoryClientProps) {
  const [itemFilter, setItemFilter] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter records
  const filteredRecords = records.filter((record) => {
    if (itemFilter && record.item !== itemFilter) return false;
    if (startDate && record.settlementDate < startDate) return false;
    if (endDate && record.settlementDate > endDate) return false;
    return true;
  });

  // Calculate totals
  const totals = filteredRecords.reduce(
    (acc, record) => ({
      totalAmount: acc.totalAmount + parseFloat(record.totalAmount),
      parentAmount: acc.parentAmount + parseFloat(record.parentAmount),
      user1Amount: acc.user1Amount + parseFloat(record.user1Amount),
      user2Amount: acc.user2Amount + parseFloat(record.user2Amount),
      user3Amount: acc.user3Amount + parseFloat(record.user3Amount),
      daysUser1: acc.daysUser1 + record.daysUser1,
      daysUser2: acc.daysUser2 + record.daysUser2,
      daysUser3: acc.daysUser3 + record.daysUser3,
      totalDays: acc.totalDays + record.totalDays,
    }),
    {
      totalAmount: 0,
      parentAmount: 0,
      user1Amount: 0,
      user2Amount: 0,
      user3Amount: 0,
      daysUser1: 0,
      daysUser2: 0,
      daysUser3: 0,
      totalDays: 0,
    },
  );

  function handleDelete(id: number) {
    if (deletingId === id) {
      // Confirmed — execute delete
      startTransition(async () => {
        await deleteCostRecord(id);
        setDeletingId(null);
      });
    } else {
      // First click — ask for confirmation
      setDeletingId(id);
    }
  }

  function handleCancelDelete() {
    setDeletingId(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="size-5" />
          歷史記錄流水帳
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              費用項目
            </label>
            <Select
              value={itemFilter}
              onValueChange={(val) => setItemFilter(val ?? "")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="全部項目" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部項目</SelectItem>
                {COST_ITEMS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              起始日期
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-[160px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              結束日期
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-[160px]"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setItemFilter("");
              setStartDate("");
              setEndDate("");
            }}
          >
            <Search className="mr-1 size-4" />
            清除篩選
          </Button>
        </div>

        {/* Table */}
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="mb-4 size-16 opacity-30" />
            <p className="text-lg font-medium">尚無記錄</p>
            <p className="text-sm">目前沒有符合條件的費用記錄</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>結算日期</TableHead>
                  <TableHead>費用項目</TableHead>
                  <TableHead className="text-right">費用總額</TableHead>
                  <TableHead className="text-center">老大天數</TableHead>
                  <TableHead className="text-center">老二天數</TableHead>
                  <TableHead className="text-center">老三天數</TableHead>
                  <TableHead className="text-center">總天數</TableHead>
                  <TableHead className="text-right">父母</TableHead>
                  <TableHead className="text-right">老大</TableHead>
                  <TableHead className="text-right">老二</TableHead>
                  <TableHead className="text-right">老三</TableHead>
                  <TableHead className="text-center">檢核</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDate(record.settlementDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.item}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(record.totalAmount)}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.daysUser1}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.daysUser2}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.daysUser3}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.totalDays}
                    </TableCell>
                    <TableCell className="text-right font-mono text-purple-600 dark:text-purple-400">
                      {formatCurrency(record.parentAmount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-600 dark:text-blue-400">
                      {formatCurrency(record.user1Amount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                      {formatCurrency(record.user2Amount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-orange-600 dark:text-orange-400">
                      {formatCurrency(record.user3Amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.auditCheck ? (
                        <CheckCircle className="mx-auto size-5 text-emerald-500" />
                      ) : (
                        <XCircle className="mx-auto size-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {deletingId === record.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                            disabled={isPending}
                          >
                            確認
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelDelete}
                            disabled={isPending}
                          >
                            取消
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-semibold">
                  <TableCell>合計</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {filteredRecords.length} 筆
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(totals.totalAmount)}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.daysUser1}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.daysUser2}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.daysUser3}
                  </TableCell>
                  <TableCell className="text-center">
                    {totals.totalDays}
                  </TableCell>
                  <TableCell className="text-right font-mono text-purple-600 dark:text-purple-400">
                    {formatCurrency(totals.parentAmount)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-blue-600 dark:text-blue-400">
                    {formatCurrency(totals.user1Amount)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                    {formatCurrency(totals.user2Amount)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-orange-600 dark:text-orange-400">
                    {formatCurrency(totals.user3Amount)}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
