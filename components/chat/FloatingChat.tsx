"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  transaction?: {
    type: "INCOME" | "EXPENSE";
    amount: number;
    category: string;
    note: string;
  };
}

export default function FloatingChat() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Halo! Saya AIsisten Dompetku. Ceritakan transaksi Anda dengan bahasa santai, misalnya: 'Tadi beli kopi 25rb' atau 'Gaji masuk 5 juta'. Saya akan otomatis mencatatnya!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Don't render chat if user is not logged in
  if (!session) return null;

  const quickPrompts = [
    "Beli kopi kekinian 25 ribu tunai",
    "Gaji bulanan masuk 5 juta",
    "Bayar tagihan listrik 150rb",
    "Makan siang bakso 20.000",
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses pesan.");
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.reply,
        transaction: data.parsed,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Trigger automatic refresh event for Dashboard and Transactions pages
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("dompetku:refresh"));
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `⚠️ Maaf, terjadi kesalahan: ${err.message || "Gagal menghubungi layanan AI."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-gold-500 text-white shadow-xl hover:scale-105 active:scale-95 transition-all ai-glow dark:border dark:border-gold-400/40 dark:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        title="Buka AIsisten Dompetku"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <Sparkles className="h-7 w-7 text-white dark:text-gold-200" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </div>
        )}
      </button>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] max-h-[82vh] flex flex-col rounded-3xl border border-slate-200 dark:border-gold-500/40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 px-4 py-3.5 text-white border-b border-white/10 dark:border-gold-500/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 dark:bg-gold-500/20 backdrop-blur-sm border border-white/20 dark:border-gold-500/40">
                <Bot className="h-5 w-5 text-white dark:text-gold-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5 dark:text-gold-200">
                  AIsisten Dompetku
                  <span className="text-[10px] bg-emerald-400/30 dark:bg-gold-500/30 dark:text-gold-200 px-1.5 py-0.5 rounded-full border border-white/20 dark:border-gold-400/40 font-bold">
                    Flash NLP
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100 dark:text-gold-400/80">
                  Ketik natural, langsung tersimpan ke database
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1.5 text-white/80 hover:bg-white/10 hover:text-white dark:hover:bg-slate-800 dark:hover:text-gold-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-gold-500/20 dark:text-gold-300 dark:border dark:border-gold-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none dark:from-gold-600 dark:to-gold-500 dark:text-slate-950 dark:font-semibold"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none dark:bg-slate-900 dark:text-gold-100 dark:border-gold-500/30"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Structured Card if parsed transaction */}
                  {msg.transaction && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-gold-500/20 bg-slate-50 dark:bg-slate-950/80 rounded-xl p-2.5 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1 text-slate-700 dark:text-gold-300">
                          {msg.transaction.type === "INCOME" ? (
                            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ArrowUpRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                          )}
                          {msg.transaction.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                        </span>
                        <span
                          className={
                            msg.transaction.type === "INCOME"
                              ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                              : "text-rose-600 dark:text-rose-400 font-extrabold"
                          }
                        >
                          {formatRupiah(msg.transaction.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-gold-400/80 text-[11px]">
                        <span>Kategori:</span>
                        <span className="font-semibold text-slate-700 dark:text-gold-200">
                          {msg.transaction.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-gold-400 font-bold pt-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Tersimpan di Neon PostgreSQL
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-gold-500/30 dark:text-gold-200">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 dark:text-gold-400/70 text-xs pl-2 font-medium">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-gold-400" />
                <span>AIsisten sedang memproses catatan Anda...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-2 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-gold-500/20 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="shrink-0 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-900 dark:text-gold-300 dark:hover:bg-gold-500/20 dark:border-gold-500/30 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full transition-colors font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-gold-500/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Contoh: Beli bensin 35rb..."
              disabled={isLoading}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:border-gold-500/30 dark:bg-slate-900 dark:text-gold-100 placeholder-slate-400 dark:placeholder-gold-500/40 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:border-gold-400 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:from-gold-600 dark:to-gold-500 dark:text-slate-950"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white dark:text-slate-950" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
