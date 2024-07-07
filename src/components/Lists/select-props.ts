import type { Dispatch, SetStateAction } from "react";

export type SelectProps<T> = {
  name?: string;
  openDropdown?: boolean;
  setOpenDropdown?: Dispatch<SetStateAction<boolean>>;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
} & (
  | { value?: T; setValue?: undefined }
  | { value: T; setValue: Dispatch<SetStateAction<T>> }
);
