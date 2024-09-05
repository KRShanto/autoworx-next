import { Switch } from "@/components/Switch";
import React, { useTransition } from "react";

type TProps = {
  onChecked: (value: boolean) => void;
  checked: boolean;
};
export default function MySwitch({ onChecked, checked }: TProps) {
  const [pending, startTransition] = useTransition();
  return (
    <Switch
      disabled={pending}
      checked={checked}
      setChecked={(value: boolean) => startTransition(() => onChecked(value))}
    />
  );
}
