import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
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
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <FloatingChat />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
