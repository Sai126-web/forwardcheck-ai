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
    <header className="sticky top-0 z-50 bg-[#120E0A]/95 backdrop-blur-md border-b border-[#342418]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-red-800 flex items-center justify-center text-amber-100 shadow-md border border-amber-500/50 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#F1E8D9] tracking-tight font-mono">ForwardCheck</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#DC2626]/20 text-[#EF4444] border border-[#DC2626]/40 uppercase font-bold tracking-wider">
                  CASE-AI
                </span>
              </div>
              <p className="text-[10px] text-[#A3907C] font-mono hidden sm:block">Explore the truth behind the forward</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-mono">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#241A12] text-[#F59E0B] border border-[#4D331E]"
                      : "text-[#A3907C] hover:text-[#F1E8D9] hover:bg-[#1D150F]"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Status / CTAs */}
          <div className="flex items-center gap-3 font-mono">
            {/* System Status Pill */}
            <div
              title={`Engine Status: ${healthStatus}`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18120C] border border-[#3A281A] text-[11px] text-[#A3907C]"
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
              className="inline-flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Investigate</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
