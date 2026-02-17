"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type ToolTabProps = {
  id: string;
  label: string;
  Icon: any;
  onClick?: () => void;
  active?: boolean;
};

export function ToolTab({
  id,
  label,
  Icon,
  onClick,
  active = false,
}: ToolTabProps) {
  return (
    <Button
      aria-label={label}
      id={id}
      onClick={onClick}
      variant="ghost"
      size="icon"
      className={`w-14 h-14 flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out group relative
        ${
          active
            ? "bg-blue-600 scale-105 shadow-lg"
            : "hover:bg-gray-700 hover:scale-105"
        }`}
    >
      <Icon
        className={`transition-transform duration-200 ${active ? "text-white scale-110" : "text-gray-300 group-hover:text-white group-hover:scale-110"}`}
        size={20}
      />

      {/* Tooltip */}
      <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {label}
      </span>
    </Button>
  );
}

export default ToolTab;
