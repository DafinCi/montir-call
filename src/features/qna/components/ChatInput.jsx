"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendHorizontal, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatInput({ onSendMessage, isLoading = false }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

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
          placeholder="Ask to automotive engineer .. "
          disabled={isLoading}
          rows={1}
          className="w-full resize-none bg-transparent px-2 py-1.5 text-xs sm:text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 max-h-32 leading-relaxed"
        />

        <Button
          variant="outline"
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
