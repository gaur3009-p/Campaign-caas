import React from "react";

export function Button({ children, className = "", variant = "solid", size = "md", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = variant === "ghost"
    ? "bg-transparent text-gray-300 hover:text-white"
    : variant === "link"
    ? "bg-transparent text-purple-500 hover:text-purple-400 underline"
    : variant === "outline"
    ? "bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-50"
    : "bg-purple-600 text-white hover:bg-purple-500";
  const sizes = size === "icon" ? "h-9 w-9 p-0" : "h-10 px-4 py-2";
  return (
    <button className={`${base} ${variants} ${sizes} ${className}`} {...props}>
      {children}
    </button>
  );
}
