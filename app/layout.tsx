import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import FloatingChat from "@/components/chat/FloatingChat";

export const metadata: Metadata = {
  title: "AIsisten Dompetku - Pengelolaan Keuangan Mandiri Berbasis AI",
  description:
    "Aplikasi pencatat dan pengelola keuangan pribadi canggih dengan integrasi AI Flash NLP, NextAuth, dan PostgreSQL Neon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen text-slate-900 dark:text-gold-300 antialiased selection:bg-gold-500 selection:text-slate-950">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <FloatingChat />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
