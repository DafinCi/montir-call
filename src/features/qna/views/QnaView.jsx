"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, Sparkles, Bot, AlertCircle } from "lucide-react";
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

  // Auto Scroll ke bagian paling bawah
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
      const historyPayload = updatedMessages
        .filter((msg) => msg.id !== "welcome-msg")
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      const response = await sendMechanicQuery({
        history: historyPayload.slice(0, -1),
        message: text,
      });

      if (response.success) {
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
      console.error("Error di QnaView:", err);
      setErrorText("Terjadi kesalahan jaringan atau sistem.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* TOMBOL KEMBALI KE DASHBOARD */}
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-xl text-muted-foreground shrink-0 hover:-translate-x-2"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="size-5" />
            </Button>
          </Link>

          {/* IKON AI */}
          <div className="size-10 rounded-sm bg-secondary/10 border border-secondary text-secondary flex items-center justify-center shadow-xs shrink-0">
            <Bot className="size-5" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-extrabold text-muted tracking-tight">
                Tanya AI Montir
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-secondary border border-primary-foreground/20">
                <span className="size-1.5 rounded-full bg-secondary animate-pulse" />
                Gemini Flash
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Konsultasi diagnosa & masalah teknis otomotif
            </p>
          </div>
        </div>

        {/* Tombol Hapus */}
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

      {/* chat messege*/}
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

        {/* Pesan Error */}
        {errorText && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-500/10 border border-red-500/20 p-3 rounded-2xl my-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        {/* scroll otomatis */}
        <div ref={messagesEndRef} />
      </div>

      {/* chat input */}
      <div className="sticky bottom-0 pt-2 bg-background/80 backdrop-blur-md m-3 z-10">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
