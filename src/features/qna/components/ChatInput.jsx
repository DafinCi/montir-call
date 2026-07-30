"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";

export default function ChatInput({ onSendMessage, isLoading = false }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

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

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2 w-full max-w-4xl mx-auto pt-2">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-card border border-border rounded-sm p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
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
          className="size-9 shrink-0 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40"
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
