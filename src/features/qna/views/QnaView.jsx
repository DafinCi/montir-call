"use client";

import React, { useState, useRef, useEffect } from "react";
import { Trash2, Sparkles, Bot, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import ChatCard from "../components/ChatCard";
import ChatInput from "../components/ChatInput";
import { sendMechanicQuery } from "../actions/qna.action";

export default function QnaView() {
  // Pesan Selamat Datang Awal dari AI
  const INITIAL_MESSAGE = {
    id: "welcome-msg",
    role: "assistant",
    content:
      "Halo Montir! Saya **AI automotive engineer**.\n\nAda kendala mesin, kode DTC/error, atau butuh data teknis (torsi/skema) yang mau didiagnosa hari ini?",
    timestamp: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto Scroll ke bagian paling bawah setiap kali ada pesan baru / loading state
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Fungsi Kirim Pesan ke Backend Server Action
  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    setErrorText(null);

    // 1. Tambahkan pesan user ke UI
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // 2. Siapkan riwayat percakapan untuk dikirim ke Gemini
      // Saring pesan selamat datang agar tidak mengotori riwayat AI
      const historyPayload = updatedMessages
        .filter((msg) => msg.id !== "welcome-msg")
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      // 3. Panggil Server Action
      const response = await sendMechanicQuery({
        history: historyPayload.slice(0, -1), // Riwayat sebelum pesan terakhir
        message: text,
      });

      if (response.success) {
        // 4. Tambahkan balasan AI ke UI
        const aiMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setErrorText(response.error || "Gagal mendapatkan respon dari AI.");
      }
    } catch (err) {
      console.error(" Error di QnaView:", err);
      setErrorText("Terjadi kesalahan jaringan atau sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Reset Percakapan
  const handleResetChat = () => {
    if (window.confirm("Apakah kamu yakin ingin menghapus semua obrolan?")) {
      setMessages([
        {
          ...INITIAL_MESSAGE,
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setErrorText(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] mx-auto">
      {/* HEADER BAR QnA */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-card shadow-xs mb-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-sm bg-secondary/10 border border-secondary text-secondary flex items-center justify-center shadow-xs">
            <Bot className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-extrabold text-muted tracking-tight">
                Tanya AI Montir
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-secondary animate-pulse" />
                Gemini Flash
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Konsultasi diagnosa & masalah teknis otomotif
            </p>
          </div>
        </div>

        {/* Tombol Hapus / Reset Sesi */}
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetChat}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
            title="Bersihkan obrolan"
          >
            <Trash2 className="size-4.5" />
          </Button>
        )}
      </div>

      {/* CHAT MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-border">
        {messages.map((msg) => (
          <ChatCard key={msg.id} message={msg} />
        ))}

        {/* Indikator AI Sedang Mengetik */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground my-3 p-3 bg-muted/40 rounded-2xl w-fit animate-pulse border border-border/50">
            <Sparkles className="size-4 text-secondary animate-spin" />
            <span>Asisten AI sedang menganalisis masalah teknis...</span>
          </div>
        )}

        {/* Pesan Error Jika Ada Kegagalan */}
        {errorText && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-500/10 border border-red-500/20 p-3 rounded-2xl my-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Anchor scroll otomatis */}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER CHAT INPUT */}
      <div className="sticky bottom-0 pt-2 bg-background/80 backdrop-blur-md m-3 z-10">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
