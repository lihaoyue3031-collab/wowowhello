import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/nav/Sidebar";

export const metadata: Metadata = {
  title: "Lee Space",
  description: "Lee的个人数字空间 — Dashboard, English Learning, AI Gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex" style={{ background: "var(--bg-primary)" }}>
        <Sidebar />
        <main
          className="flex-1"
          style={{
            marginLeft: 220,
            padding: "40px 48px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
