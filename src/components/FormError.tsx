"use client";

import { useFormErrorStore } from "@/stores/form-error";
import { useRef } from "react";
import { FaTimes } from "react-icons/fa";

export default function FormError() {
  const { error, clearError } = useFormErrorStore();
  const buttonRef = useRef<HTMLDivElement>(null);

  // close with animation
  const handleClose = () => {
    buttonRef.current?.classList.add("hide");

    setTimeout(() => {
      clearError();
    }, 400);
  };

  if (error && !error.success) {
    return (
      <div
        className="mb-4 flex items-center justify-between rounded-md bg-red-700 px-4 py-1 text-white"
        ref={buttonRef}
      >
        {error.errorSource && error?.errorSource?.length > 0 ? (
          <p key={error.errorSource[0].path} className="text-sm">
            {error.errorSource[0].message}
          </p>
        ) : (
          <p>{error.message}</p>
        )}

        <div>
          <button type="button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
      </div>
    );
  }
}
