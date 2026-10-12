import React from "react";

interface PushPinProps {
  color?: "red" | "yellow" | "brass" | "blue" | "green" | "purple";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const PushPin: React.FC<PushPinProps> = ({
  color = "red",
  className = "",
  size = "md",
}) => {
  const pinColors = {
    red: {
      head: "from-rose-500 via-red-600 to-rose-900",
      rim: "border-red-400/80",
      glow: "shadow-[0_2px_5px_rgba(239,68,68,0.7)]",
    },
    yellow: {
      head: "from-amber-300 via-amber-400 to-amber-700",
      rim: "border-amber-200/80",
      glow: "shadow-[0_2px_5px_rgba(245,158,11,0.7)]",
    },
    brass: {
      head: "from-amber-600 via-amber-700 to-yellow-950",
      rim: "border-amber-500/80",
      glow: "shadow-[0_2px_5px_rgba(180,83,9,0.7)]",
    },
    blue: {
      head: "from-sky-400 via-blue-500 to-blue-800",
      rim: "border-sky-300/80",
      glow: "shadow-[0_2px_5px_rgba(59,130,246,0.7)]",
    },
    green: {
      head: "from-emerald-400 via-teal-500 to-emerald-800",
      rim: "border-emerald-300/80",
      glow: "shadow-[0_2px_5px_rgba(16,185,129,0.7)]",
    },
    purple: {
      head: "from-purple-400 via-purple-600 to-purple-950",
      rim: "border-purple-300/80",
      glow: "shadow-[0_2px_5px_rgba(168,85,247,0.7)]",
    },
  };

  const sizes = {
    sm: "w-3 h-3 border-[1.5px]",
    md: "w-4 h-4 border-2",
    lg: "w-5 h-5 border-2",
  };

  const selected = pinColors[color] || pinColors.red;

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Pin Shadow */}
      <div className="absolute w-3.5 h-3.5 rounded-full bg-black/60 blur-[1.5px] translate-x-1 translate-y-1.5" />
      {/* 3D Round Pushpin Head */}
      <div
        className={`relative rounded-full bg-gradient-to-br ${selected.head} ${selected.rim} ${selected.glow} ${sizes[size]} z-10 flex items-center justify-center`}
      >
        {/* Specular Highlight dot */}
        <div className="w-1 h-1 rounded-full bg-white/70 absolute top-0.5 left-0.5" />
      </div>
    </div>
  );
};
