import React from "react";

export function Progress({ value = 0, className = "" }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={`w-full h-2 rounded bg-gray-200 overflow-hidden ${className}`}>
      <div
        className="h-full bg-purple-600 transition-all"
        style={{ width: `${clamped}%` }}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}
