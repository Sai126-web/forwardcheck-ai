"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Search,
  PlusCircle,
  History,
  BookOpen,
  Settings,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [healthStatus, setHealthStatus] = useState<string>("checking");

  useEffect(() => {
    api
      .getHealth()
      .then((h) => setHealthStatus(h.status === "healthy" ? "online" : "partial"))
      .catch(() => setHealthStatus("offline"));
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <Layers className="w-4 h-4" /> },
    { href: "/investigations/new", label: "New Investigation", icon: <PlusCircle className="w-4 h-4" /> },
    { href: "/investigations", label: "History", icon: <History className="w-4 h-4" /> },
    { href: "/evidence", label: "Evidence Library", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#283548]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6665E8] to-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-[#6665E8]/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#F1F3F7] tracking-tight">ForwardCheck</span>
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-[#6665E8]/20 text-[#6665E8] border border-[#6665E8]/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[#94A3B8] hidden sm:block">Explore the truth behind the forward</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#1B2331] text-[#F1F3F7] border border-[#283548]"
                      : "text-[#94A3B8] hover:text-[#F1F3F7] hover:bg-[#1B2331]/50"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Status / CTAs */}
          <div className="flex items-center gap-3">
            {/* System Status Pill */}
            <div
              title={`Engine Status: ${healthStatus}`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141B26] border border-[#283548] text-[11px] text-[#94A3B8]"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  healthStatus === "online"
                    ? "bg-[#35AA9E]"
                    : healthStatus === "checking"
                    ? "bg-amber-400 animate-pulse"
                    : "bg-[#E56D68]"
                }`}
              />
              <span className="capitalize">{healthStatus}</span>
            </div>

            {/* Quick Action Button */}
            <Link
              href="/investigations/new"
              className="inline-flex items-center gap-1.5 bg-[#6665E8] hover:bg-[#5756D1] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Investigate</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
