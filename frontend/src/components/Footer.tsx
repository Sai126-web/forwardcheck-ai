import React from "react";
import Link from "next/link";
import { ShieldCheck, GitBranch, Terminal, Shield } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#283548] bg-[#0B0F17] text-[#94A3B8] text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#F1F3F7] font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-[#6665E8]" />
              <span>ForwardCheck AI</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Don’t just check the claim. Explore the truth behind it. Evidence-grounded forensic investigation platform for viral forwards, claims, and media.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
              <span>TruthGraph™</span>
              <span>•</span>
              <span>Bait Index™</span>
              <span>•</span>
              <span>Manifest V3 Ext</span>
            </div>
          </div>

          {/* Investigation Links */}
          <div className="space-y-2">
            <h4 className="text-[#F1F3F7] font-medium text-xs">Product</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/dashboard" className="hover:text-[#F1F3F7] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/investigations/new" className="hover:text-[#F1F3F7] transition-colors">
                  New Investigation
                </Link>
              </li>
              <li>
                <Link href="/investigations" className="hover:text-[#F1F3F7] transition-colors">
                  History Archive
                </Link>
              </li>
              <li>
                <Link href="/evidence" className="hover:text-[#F1F3F7] transition-colors">
                  Evidence Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Methodology & Science */}
          <div className="space-y-2">
            <h4 className="text-[#F1F3F7] font-medium text-xs">Evidence Principles</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/methodology" className="hover:text-[#F1F3F7] transition-colors">
                  Investigation Methodology
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F1F3F7] transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#F1F3F7] transition-colors">
                  FAQ & Verification FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#F1F3F7] transition-colors">
                  Report a Discrepancy
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="space-y-2">
            <h4 className="text-[#F1F3F7] font-medium text-xs">Trust & Privacy</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/privacy" className="hover:text-[#F1F3F7] transition-colors">
                  Zero Surveillance Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#F1F3F7] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-[#F1F3F7] transition-colors">
                  Guest Session & Data Retention
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1B2331] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748B]">
          <p>© 2026 ForwardCheck AI. Grounded in inspectable evidence.</p>
          <p>Strictly 5 Canonical Verdicts • No Hallucinated Probabilities</p>
        </div>
      </div>
    </footer>
  );
};
