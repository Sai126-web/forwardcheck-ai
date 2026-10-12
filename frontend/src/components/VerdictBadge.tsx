import React from "react";
import { VerdictType } from "@/lib/types";
import { CheckCircle2, XCircle, Clock, AlertTriangle, HelpCircle } from "lucide-react";

interface VerdictBadgeProps {
  verdict?: VerdictType;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict = "Cannot Confirm",
  size = "md",
  className = "",
  showIcon = true,
}) => {
  const configs: Record<
    VerdictType,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    Verified: {
      label: "Verified",
      bg: "bg-[#35AA9E]/15",
      text: "text-[#35AA9E]",
      border: "border-[#35AA9E]/40",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    False: {
      label: "False",
      bg: "bg-[#E56D68]/15",
      text: "text-[#E56D68]",
      border: "border-[#E56D68]/40",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    Outdated: {
      label: "Outdated",
      bg: "bg-[#DEA44C]/15",
      text: "text-[#DEA44C]",
      border: "border-[#DEA44C]/40",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    "Partially Supported": {
      label: "Partially Supported",
      bg: "bg-[#E28B57]/15",
      text: "text-[#E28B57]",
      border: "border-[#E28B57]/40",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    "Cannot Confirm": {
      label: "Cannot Confirm",
      bg: "bg-[#64748B]/15",
      text: "text-[#94A3B8]",
      border: "border-[#64748B]/40",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[verdict] || configs["Cannot Confirm"];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border-2 font-mono uppercase tracking-wider shadow-sm select-none ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && current.icon}
      <span>{current.label}</span>
    </span>
  );
};
