import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl bg-white shadow-lg border border-gray-200 ${className}`}>{children}</div>
);
export const CardHeader = ({ children, className = "" }) => (
  <div className={`p-5 border-b border-gray-100 ${className}`}>{children}</div>
);
export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
);
export const CardContent = ({ children, className = "" }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);
