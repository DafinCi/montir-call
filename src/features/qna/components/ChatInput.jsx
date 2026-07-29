"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendHorizontal, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatInput({ onSendMessage, isLoading = false }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Rekomendasi Pertanyaan Cepat khas Bengkel
  const quickPrompts = [
    "Cek kode error DTC P0300",
    "Penyebab mesin Vario brebet saat panas?",
    "Berapa torsi baut cylinder head umum?",
    "Langkah cek sistem pengisian aki drop",
  ];

  // Auto-resize tinggi textarea sesuai jumlah baris teks
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120,
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput("");

    // Reset tinggi textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    // Submit saat tekan Enter (tanpa Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPromptClick = (prompt) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div className="space-y-2 w-full max-w-4xl mx-auto pt-2">
      {/* Quick Prompts Horizontal Scrollable */}
      {!isLoading && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[10px] font-semibold text-muted-foreground shrink-0 flex items-center gap-1 pr-1">
            <Sparkles className="size-3 text-amber-500" /> Cepat:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPromptClick(prompt)}
              className="shrink-0 bg-secondary/80 hover:bg-secondary text-secondary-foreground text-[11px] px-2.5 py-1 rounded-full border border-border/50 transition-all active:scale-95 whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Box Form */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-card border border-border rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan masalah teknis, kode DTC, torsi baut..."
          disabled={isLoading}
          rows={1}
          className="w-full resize-none bg-transparent px-2 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 max-h-32 leading-relaxed"
        />

        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="size-9 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <SendHorizontal className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
