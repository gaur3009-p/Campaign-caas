import React from "react";

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      {...props}
    />
  );
}
