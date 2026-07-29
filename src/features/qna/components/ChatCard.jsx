"use client";

import React, { useState } from "react";
import { Wrench, User, Copy, Check, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui";

export default function ChatCard({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  // Fungsi menyalin teks balasan AI ke clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks:", err);
    }
  };

  // Helper sederhana untuk merender format teks AI 
  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split("\n");

    return lines.map((line, lineIdx) => {
      // Deteksi bullet points 
      const isBullet =
        line.trim().startsWith("- ") || line.trim().startsWith("* ");
      const cleanLine = isBullet ? line.trim().substring(2) : line;

      // Parsing format bold
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const parsedParts = parts.map((part, partIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={partIdx} className="font-bold text-secondary">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-4 list-disc space-y-1 my-0.5">
            {parsedParts}
          </li>
        );
      }

      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      return (
        <p key={lineIdx} className="leading-relaxed">
          {parsedParts}
        </p>
      );
    });
  };

  return (
    <div
      className={`flex gap-3 w-full my-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar Icon */}
      <Avatar
        className={`size-8 shrink-0 shadow-xs ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-primary"
        }`}
      >
        <AvatarFallback className="bg-transparent text-current flex items-center justify-center">
          {isUser ? (
            <User className="size-4.5" />
          ) : (
            <Wrench className="size-4" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* Gelembung Pesan */}
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-xs ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-xs"
            : "bg-card border border-border text-card-foreground rounded-tl-xs space-y-1"
        }`}
      >
        {/* Label Pengirim (Khusus AI) */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5 mb-2">
            <span className="text-[11px] font-bold text-secondary flex items-center gap-1">
              <Sparkles className="size-3" />
              Asisten Montir Pro
            </span>
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
              title="Salin jawaban"
            >
              {copied ? (
                <Check className="size-3.5 text-secondary" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        )}

        {/* Isi Pesan */}
        <div className="space-y-1">
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          ) : (
            renderFormattedText(message.content)
          )}
        </div>

        {/* Timestamp Waktu */}
        <div
          className={`text-[10px] mt-2 text-right ${
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {message.timestamp ||
            new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </div>
      </div>
    </div>
  );
}
