import type { ComponentProps, ReactNode } from "react";
import { sentenceCase } from "change-case";
import { cn } from "@/lib/cn";

export type SlimInputProps = {
  label?: ReactNode;
  name: string;
  rootClassName?: string;
};

export const slimInputClassName =
  "border-primary-foreground bg-white w-full rounded-sm border px-2 py-0.5 leading-6 outline-none";
export function SlimInput({
  label,
  className,
  rootClassName,
  ...props
}: SlimInputProps & ComponentProps<"input">) {
  return (
    <label className={cn("block", rootClassName)}>
      <div className="mb-1 px-2 font-medium">
        {label ?? sentenceCase(props.name)}
      </div>
      <input
        type="text"
        required
        className={cn(slimInputClassName, className)}
        id={props.id ?? props.name}
        {...props}
      />
    </label>
  );
}
