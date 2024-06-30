import type { ComponentProps, ReactNode } from "react";
import { sentenceCase } from "change-case";
import { cn } from "@/lib/cn";

export type SlimTextareaProps = {
  label?: ReactNode;
  name: string;
  rootClassName?: string;
};

export const slimTextareaClassName =
  "border-primary-foreground bg-white w-full rounded-sm border px-2 py-0.5 leading-6 outline-none";

export function SlimTextarea({
  label,
  className,
  rootClassName,
  ...props
}: SlimTextareaProps & ComponentProps<"textarea">) {
  return (
    <label className={cn("block", rootClassName)}>
      <div className="mb-1 px-2 font-medium">
        {label ?? sentenceCase(props.name)}
      </div>
      <textarea
        className={cn(slimTextareaClassName, className)}
        {...props}
      />
    </label>
  );
}
