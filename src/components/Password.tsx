"use client";

import { useFormErrorStore } from "@/stores/form-error";
import { useState, useRef } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Input({
  name,
  className,
  placeholder,
  value,
  onChange,
  required,
}: {
  name: string;
  className?: string;
  placeholder?: string;
  value?: any;
  onChange?: (e: any) => void;
  required?: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { error } = useFormErrorStore();

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        id={name}
        className={className + " pr-10"}
        required={required}
        value={value || inputValue}
        onChange={(e) => {
          onChange ? onChange(e) : setInputValue(e.target.value);
        }}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>

      {error && error.field === name && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  );
}
