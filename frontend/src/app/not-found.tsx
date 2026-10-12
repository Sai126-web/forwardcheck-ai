import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-20 text-center space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-[#1B2331] border border-[#283548] flex items-center justify-center text-[#6665E8] mx-auto shadow-lg">
        <HelpCircle className="w-6 h-6" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#F1F3F7]">404 — Dossier Not Found</h1>
      <p className="text-xs text-[#94A3B8] leading-relaxed">
        The requested investigation, evidence page, or route could not be located in the current workspace.
      </p>
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#6665E8] hover:bg-[#5756D1] text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}
