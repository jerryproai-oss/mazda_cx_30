"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Calendar, Calculator, History, BarChart3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "用車預約", icon: Calendar },
  { href: "/calculator", label: "費用計算機", icon: Calculator },
  { href: "/history", label: "歷史記錄", icon: History },
  { href: "/dashboard", label: "統計", icon: BarChart3 },
] as const;

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-stone-200/60 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo with CX-30 image */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className="relative size-9 overflow-hidden rounded-lg shadow-md ring-1 ring-stone-200/50 transition-transform group-hover:scale-105">
            <Image
              src="/images/cx30.jpg"
              alt="Mazda CX-30"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-stone-800">
              CX-30 家庭用車
            </span>
            <span className="text-[10px] font-medium text-stone-400 -mt-0.5">
              鴻老爹家族共用管理
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-200/50"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl" />
            }
          >
              <Menu className="size-5" />
              <span className="sr-only">開啟選單</span>
          </SheetTrigger>

          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <div className="relative size-8 overflow-hidden rounded-lg">
                  <Image
                    src="/images/cx30.jpg"
                    alt="Mazda CX-30"
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                CX-30 家庭用車
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-1 px-2 mt-4">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    )}
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile footer with car image */}
            <div className="mt-auto px-4 pb-6">
              <div className="relative h-32 w-full overflow-hidden rounded-2xl opacity-30">
                <Image
                  src="/images/cx30.jpg"
                  alt="Mazda CX-30"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
