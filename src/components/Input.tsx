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
  placeholder,
  value,
  onChange,
}: {
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
  placeholder?: string;
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
        value={value || inputValue}
        onChange={(e) => {
          onChange ? onChange(e) : setInputValue(e.target.value);
        }}
        placeholder={placeholder}
      />

      {error && error.field === name && (
        <p className="text-red-500">{error.message}</p>
      )}
    </>
  );
}
