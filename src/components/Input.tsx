"use client";

import { useFormErrorStore } from "@/stores/form-error";
import { useState, useRef } from "react";

export default function Input({
  name,
  type = "text",
  required,
  defaultValue,
  autoFocus,
  className,
  value,
  onChange,
}: {
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
  value?: any;
  onChange?: (e: any) => void;
}) {
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const { error } = useFormErrorStore();

  return (
    <>
      <input
        type={type}
        name={name}
        id={name}
        className={className}
        required={required}
        autoFocus={autoFocus}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {error && error.field === name && (
        <p className="error">{error.message}</p>
      )}
    </>
  );
}
