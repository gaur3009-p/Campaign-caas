import React from "react";

export const Select = ({ value, onValueChange, children }) => (
  <select className="w-full md:w-[280px] bg-white shadow-sm border border-gray-300 rounded px-3 py-2" value={value || ''} onChange={(e) => onValueChange(e.target.value)}>
    {children}
  </select>
);
export const SelectTrigger = ({ children }) => children;
export const SelectValue = ({ placeholder }) => <option value="" disabled>{placeholder}</option>;
export const SelectContent = ({ children }) => children;
export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
