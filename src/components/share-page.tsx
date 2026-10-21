"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

export function SharePage({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyLink() {
    try {
      const url = new URL(window.location.href);
      url.search = "";
      url.hash = "";
      await navigator.clipboard.writeText(url.href);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <button type="button" onClick={copyLink} className={className}>
        {status === "copied" ? <Check size={16} aria-hidden="true" /> : <LinkIcon size={16} aria-hidden="true" />}
        {status === "copied" ? "Link copied" : "Copy page link"}
      </button>
      <span role="status" className={status === "error" ? "mt-2 block text-sm" : "sr-only"}>
        {status === "copied" ? "Page link copied to clipboard." : status === "error" ? "Copy the address from your browser to share this page." : ""}
      </span>
    </div>
  );
}
