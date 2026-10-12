"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Trash2,
  Moon,
  Sun,
  Eye,
  Languages,
  Check,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [clearedData, setClearedData] = useState(false);

  const handleClearSession = () => {
    if (confirm("Are you sure you want to clear your local guest session and cached drafts?")) {
      localStorage.clear();
      sessionStorage.clear();
      setClearedData(true);
      setTimeout(() => setClearedData(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-[#283548] pb-6">
        <h1 className="text-2xl font-bold text-[#F1F3F7]">Settings & Privacy</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage workspace appearance, default report languages, and local data retention.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-[#141B26] border border-[#283548] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F1F3F7]">
            <Moon className="w-4 h-4 text-[#6665E8]" />
            <h3>Workspace Appearance</h3>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#283548]">
            <div>
              <span className="font-medium text-[#F1F3F7] block">Investigation Workspace Theme</span>
              <span className="text-[#94A3B8]">
                Dark mode is default for high-contrast graph visualization.
              </span>
            </div>
            <div className="flex items-center bg-[#0B0F17] rounded-lg p-0.5 border border-[#283548]">
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  theme === "dark" ? "bg-[#1B2331] text-[#F1F3F7]" : "text-[#94A3B8]"
                }`}
              >
                Dark (Default)
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  theme === "light" ? "bg-[#1B2331] text-[#F1F3F7]" : "text-[#94A3B8]"
                }`}
              >
                Light
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-3 border-t border-[#283548]">
            <div>
              <span className="font-medium text-[#F1F3F7] block">Reduced Motion</span>
              <span className="text-[#94A3B8]">
                Disable animated transitions on graph edges and progress meters.
              </span>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="w-4 h-4 accent-[#6665E8] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Localization Preferences */}
        <div className="bg-[#141B26] border border-[#283548] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F1F3F7]">
            <Languages className="w-4 h-4 text-[#35AA9E]" />
            <h3>Language & Localization</h3>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#283548]">
            <div>
              <span className="font-medium text-[#F1F3F7] block">Default Explanation Language</span>
              <span className="text-[#94A3B8]">
                Choose your preferred language for investigative summaries and WhatsApp rebuttals.
              </span>
            </div>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="bg-[#0B0F17] border border-[#283548] text-[#F1F3F7] rounded-lg px-3 py-1.5 text-xs outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>
        </div>

        {/* Guest Session & Privacy Retention */}
        <div className="bg-[#141B26] border border-[#283548] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F1F3F7]">
            <Shield className="w-4 h-4 text-[#DEA44C]" />
            <h3>Guest Session & Data Retention</h3>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">
            ForwardCheck AI does not require account creation to perform investigations. Records created during your session are scoped to your local guest identifier. You can permanently delete your local session data at any time.
          </p>

          <div className="pt-2 border-t border-[#283548] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#F1F3F7] block">Clear Guest Session</span>
              <span className="text-[11px] text-[#94A3B8]">
                Removes locally stored session tokens and cached drafts.
              </span>
            </div>

            <button
              onClick={handleClearSession}
              className="flex items-center gap-1.5 bg-[#E56D68]/15 hover:bg-[#E56D68]/25 text-[#E56D68] border border-[#E56D68]/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              {clearedData ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Session Cleared!</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Local Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
