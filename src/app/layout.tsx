import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavBar } from "@/components/nav-bar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CX-30 家庭用車管理",
  description: "Mazda CX-30 家庭共用車輛預約與費用分攤系統",
  icons: {
    icon: "/images/cx30.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-stone-50 via-white to-amber-50/30">
        {/* 右下角半透明 CX-30 浮水印 */}
        <div className="fixed bottom-4 right-4 pointer-events-none z-0 opacity-[0.10]">
          <Image
            src="/images/cx30.jpg"
            alt=""
            width={480}
            height={270}
            className="grayscale-[40%]"
            priority={false}
          />
        </div>
        <TooltipProvider>
          <NavBar />
          <main className="relative z-10 flex-1 container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </main>
          {/* Footer */}
          <footer className="relative z-10 border-t bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
              <p>🚗 CX-30 家庭用車管理系統 · 鴻老爹家族共用</p>
            </div>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
