"use client";

import { useState, useRef, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  parseISO,
  getDay,
} from "date-fns";
import { zhTW } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { USER_COLORS } from "@/lib/constants";
import { getHoliday } from "@/lib/taiwan-holidays";
import type { BookingLog } from "@/db/schema";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  bookings: BookingLog[];
  onDateClick: (date: Date) => void;
  onBookingClick: (booking: BookingLog) => void;
}

const DAY_HEADERS = ["日", "一", "二", "三", "四", "五", "六"] as const;

export function BookingCalendar({
  bookings,
  onDateClick,
  onBookingClick,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ── Touch swipe for month navigation ──
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; // minimum px to trigger swipe

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Only trigger if horizontal movement is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          // Swipe left → next month
          setCurrentMonth((prev) => addMonths(prev, 1));
        } else {
          // Swipe right → previous month
          setCurrentMonth((prev) => subMonths(prev, 1));
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    },
    []
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad beginning with days from previous month to align with day-of-week
  const startDayOfWeek = getDay(monthStart);
  const paddingBefore = Array.from({ length: startDayOfWeek }, (_, i) => {
    const d = new Date(monthStart);
    d.setDate(d.getDate() - (startDayOfWeek - i));
    return d;
  });

  // Pad end to fill the last row
  const endDayOfWeek = getDay(monthEnd);
  const paddingAfter = Array.from({ length: 6 - endDayOfWeek }, (_, i) => {
    const d = new Date(monthEnd);
    d.setDate(d.getDate() + (i + 1));
    return d;
  });

  const allDays = [...paddingBefore, ...days, ...paddingAfter];

  const today = new Date();

  function getBookingsForDay(day: Date): BookingLog[] {
    return bookings.filter((booking) => {
      const start = parseISO(booking.startDate);
      const end = parseISO(booking.endDate);
      return isWithinInterval(day, { start, end });
    });
  }

  return (
    <div
      className="w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Month Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "yyyy年 M月", { locale: zhTW })}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-px">
        {DAY_HEADERS.map((header, i) => (
          <div
            key={header}
            className={cn(
              "py-2 text-center text-xs font-medium",
              i === 0 ? "text-red-400" : i === 6 ? "text-red-400" : "text-muted-foreground"
            )}
          >
            {header}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px rounded-lg border bg-border">
        {allDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);
          const dayBookings = getBookingsForDay(day);
          const dayOfWeek = getDay(day);
          const isSunday = dayOfWeek === 0;
          const isSaturday = dayOfWeek === 6;
          const dateStr = format(day, "yyyy-MM-dd");
          const holiday = getHoliday(dateStr);
          const isWeekend = isSunday || isSaturday;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onDateClick(day)}
              className={cn(
                "relative flex min-h-16 flex-col gap-0.5 bg-background p-1 text-left transition-colors hover:bg-muted/50 sm:min-h-24 sm:p-2",
                !isCurrentMonth && "bg-muted/30 text-muted-foreground/50",
                holiday && isCurrentMonth && "bg-red-50/60",
                isWeekend && isCurrentMonth && !holiday && "bg-stone-50/80",
                idx === 0 && "rounded-tl-lg",
                idx === 6 && "rounded-tr-lg",
                idx === allDays.length - 7 && "rounded-bl-lg",
                idx === allDays.length - 1 && "rounded-br-lg"
              )}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium sm:size-7 sm:text-sm",
                    isToday && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                    !isToday && (isSunday || isSaturday) && isCurrentMonth && "text-red-500",
                    !isToday && holiday && isCurrentMonth && "text-red-600 font-bold"
                  )}
                >
                  {format(day, "d")}
                </span>
                {/* Holiday label */}
                {holiday && isCurrentMonth && (
                  <span className="hidden truncate text-[11px] font-medium text-red-500 sm:inline">
                    {holiday.name}
                  </span>
                )}
              </div>

              {/* Holiday dot on mobile */}
              {holiday && isCurrentMonth && (
                <span className="text-[10px] text-red-400 sm:hidden">🔴</span>
              )}

              {/* Booking dots — compact mobile view */}
              <div className="flex flex-wrap gap-0.5 sm:hidden">
                {dayBookings.map((booking) => {
                  const colorKey = booking.userName as keyof typeof USER_COLORS;
                  const colors = USER_COLORS[colorKey];
                  return (
                    <span
                      key={booking.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick(booking);
                      }}
                      className={cn("size-2 rounded-full", colors?.dot ?? "bg-gray-400")}
                    />
                  );
                })}
              </div>

              {/* Booking badges — desktop view */}
              <div className="hidden flex-col gap-0.5 overflow-hidden sm:flex">
                {dayBookings.slice(0, 2).map((booking) => {
                  const colorKey = booking.userName as keyof typeof USER_COLORS;
                  const colors = USER_COLORS[colorKey];
                  return (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick(booking);
                      }}
                      className={cn(
                        "flex items-center gap-1 truncate rounded px-1 py-0.5 text-xs leading-tight transition-opacity hover:opacity-80",
                        colors?.bg,
                        colors?.text
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          colors?.dot ?? "bg-gray-400"
                        )}
                      />
                      <span className="truncate">{booking.userName}</span>
                    </button>
                  );
                })}
                {dayBookings.length > 2 && (
                  <span className="px-1 text-xs text-muted-foreground">
                    +{dayBookings.length - 2} 筆
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span className="text-xs text-muted-foreground">圖例：</span>
        {(Object.entries(USER_COLORS) as [string, (typeof USER_COLORS)[keyof typeof USER_COLORS]][]).map(
          ([name, colors]) => (
            <div key={name} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full", colors.dot)} />
              <span className="text-xs">{name}</span>
            </div>
          )
        )}
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="text-xs text-red-500">國定假日</span>
        </div>
      </div>
    </div>
  );
}
