import type { ComponentProps, ReactNode } from "react";
import { sentenceCase } from "change-case";
import { cn } from "@/lib/cn";

export type SlimInputProps = {
  label?: ReactNode;
  name: string;
};

export const slimInputClassName =
  "border-primary-foreground bg-white w-full rounded-sm border px-2 py-0.5 leading-6";

export function SlimInput({
  label,
  name,
  className,
  ...props
}: SlimInputProps & ComponentProps<"input">) {
  return (
    <label className="block">
      <div className="mb-1 px-2 font-medium">{label ?? sentenceCase(name)}</div>
      <input
        type="text"
        name={name}
        className={cn(slimInputClassName, className)}
        {...props}
      />
    </label>
  );
}
