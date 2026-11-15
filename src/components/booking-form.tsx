"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { USERS, STATUS_OPTIONS, STATUS_BADGE_COLORS } from "@/lib/constants";
import { Plus } from "lucide-react";
import type { BookingLog } from "@/db/schema";
import { cn } from "@/lib/utils";
import { format, differenceInCalendarDays } from "date-fns";

interface BookingFormProps {
  selectedDate: Date | null;
  selectedBooking: BookingLog | null;
  onClose: () => void;
}

// State machine for status transitions
function getNextStatuses(
  current: string
): { label: string; value: string; variant?: "destructive" | "default" }[] {
  const transitions: { label: string; value: string; variant?: "destructive" | "default" }[] = [];

  switch (current) {
    case "預約中":
      transitions.push({ label: "出車", value: "已出車" });
      transitions.push({ label: "取消", value: "已取消", variant: "destructive" });
      break;
    case "已出車":
      transitions.push({ label: "完成", value: "已完成" });
      transitions.push({ label: "取消", value: "已取消", variant: "destructive" });
      break;
    case "已完成":
      transitions.push({ label: "取消", value: "已取消", variant: "destructive" });
      break;
    case "已取消":
      // No transitions from cancelled
      break;
  }

  return transitions;
}

export function BookingForm({
  selectedDate,
  selectedBooking,
  onClose,
}: BookingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // New booking dialog state
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Form state for new booking
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userName, setUserName] = useState<string>(USERS[0]);
  const [purpose, setPurpose] = useState("");

  // Calculate preview applyDays
  const applyDaysPreview = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diff = differenceInCalendarDays(new Date(endDate), new Date(startDate));
    return diff >= 0 ? diff + 1 : 0;
  }, [startDate, endDate]);

  // Open new booking dialog when a date is clicked
  useEffect(() => {
    if (selectedDate && !selectedBooking) {
      const formatted = format(selectedDate, "yyyy-MM-dd");
      setStartDate(formatted);
      setEndDate(formatted);
      setUserName(USERS[0]);
      setPurpose("");
      setNewDialogOpen(true);
    }
  }, [selectedDate, selectedBooking]);

  // Open detail dialog when a booking is clicked
  useEffect(() => {
    if (selectedBooking) {
      setDetailDialogOpen(true);
      setDeleteConfirm(false);
    }
  }, [selectedBooking]);

  function handleNewDialogClose() {
    setNewDialogOpen(false);
    onClose();
  }

  function handleDetailDialogClose() {
    setDetailDialogOpen(false);
    setDeleteConfirm(false);
    onClose();
  }

  function handleCreateSubmit(formData: FormData) {
    startTransition(async () => {
      await createBooking(formData);
      handleNewDialogClose();
      router.refresh();
    });
  }

  function handleStatusChange(newStatus: string) {
    if (!selectedBooking) return;
    startTransition(async () => {
      await updateBookingStatus(selectedBooking.id, newStatus);
      handleDetailDialogClose();
      router.refresh();
    });
  }

  function handleDelete() {
    if (!selectedBooking) return;
    startTransition(async () => {
      await deleteBooking(selectedBooking.id);
      handleDetailDialogClose();
      router.refresh();
    });
  }

  const statusBadgeColor =
    selectedBooking?.status
      ? STATUS_BADGE_COLORS[selectedBooking.status as keyof typeof STATUS_BADGE_COLORS] ?? ""
      : "";

  return (
    <>
      {/* Floating + Button */}
      <Button
        className="fixed right-6 bottom-6 z-30 size-12 rounded-full shadow-lg"
        size="icon-lg"
        onClick={() => {
          const today = format(new Date(), "yyyy-MM-dd");
          setStartDate(today);
          setEndDate(today);
          setUserName(USERS[0]);
          setPurpose("");
          setNewDialogOpen(true);
        }}
      >
        <Plus className="size-6" />
        <span className="sr-only">新增預約</span>
      </Button>

      {/* ==================== New Booking Dialog ==================== */}
      <Dialog open={newDialogOpen} onOpenChange={(open) => {
        if (!open) handleNewDialogClose();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新增用車預約</DialogTitle>
          </DialogHeader>

          <form action={handleCreateSubmit} className="flex flex-col gap-4">
            {/* User Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="userName">使用者</Label>
              <Select
                name="userName"
                value={userName}
                onValueChange={(val) => { if (val) setUserName(val); }}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選擇使用者" />
                </SelectTrigger>
                <SelectContent>
                  {USERS.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startDate">開始日期</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endDate">結束日期</Label>
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            {/* Apply Days Preview */}
            {applyDaysPreview > 0 && (
              <div className="rounded-md bg-muted px-3 py-2 text-sm">
                預計用車天數：<span className="font-semibold">{applyDaysPreview}</span> 天
              </div>
            )}

            {/* Purpose */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="purpose">用途</Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="例如：上班通勤、家庭出遊..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                rows={3}
              />
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                取消
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "送出中..." : "新增預約"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==================== Booking Detail Dialog ==================== */}
      <Dialog open={detailDialogOpen} onOpenChange={(open) => {
        if (!open) handleDetailDialogClose();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>預約詳情</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="flex flex-col gap-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">狀態：</span>
                <Badge
                  variant="secondary"
                  className={cn(statusBadgeColor)}
                >
                  {selectedBooking.status}
                </Badge>
              </div>

              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">使用者</span>
                  <p className="font-medium">{selectedBooking.userName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">用車天數</span>
                  <p className="font-medium">{selectedBooking.applyDays} 天</p>
                </div>
                <div>
                  <span className="text-muted-foreground">開始日期</span>
                  <p className="font-medium">{selectedBooking.startDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">結束日期</span>
                  <p className="font-medium">{selectedBooking.endDate}</p>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">用途</span>
                <p className="mt-1 rounded-md bg-muted px-3 py-2">
                  {selectedBooking.purpose}
                </p>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">計入天數</span>
                <p className="font-medium">{selectedBooking.countedDays} 天</p>
              </div>

              {/* Status Transition Buttons */}
              {getNextStatuses(selectedBooking.status).length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">變更狀態：</span>
                  <div className="flex flex-wrap gap-2">
                    {getNextStatuses(selectedBooking.status).map(
                      ({ label, value, variant }) => (
                        <Button
                          key={value}
                          variant={variant ?? "outline"}
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleStatusChange(value)}
                        >
                          {isPending ? "處理中..." : `標記為${label}`}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Delete */}
              <div className="border-t pt-3">
                {!deleteConfirm ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteConfirm(true)}
                  >
                    刪除預約
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-destructive">確定要刪除？</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={handleDelete}
                    >
                      {isPending ? "刪除中..." : "確定刪除"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirm(false)}
                    >
                      取消
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
