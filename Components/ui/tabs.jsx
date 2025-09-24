import React, { useState } from "react";

export function Tabs({ defaultValue, children, className = "" }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className={className} data-tabs-value={value}>
      {React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child, { value, setValue }) : child
      )}
    </div>
  );
}

export function TabsList({ children, className = "", value, setValue }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value: triggerValue, children, className = "", value, setValue }) {
  const isActive = value === triggerValue;
  return (
    <button
      className={`${className}`}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => setValue(triggerValue)}
      type="button"
    >
      {children}
    </button>
  );
}

export function TabsContent({ value: contentValue, children, className = "", value }) {
  if (value !== contentValue) return null;
  return <div className={className}>{children}</div>;
}
