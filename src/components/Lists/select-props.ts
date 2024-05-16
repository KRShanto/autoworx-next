import type { Dispatch, SetStateAction } from "react";

export type SelectProps<T> = {
  name?: string;
} & (
  | { value?: T; setValue?: undefined }
  | { value: T; setValue: Dispatch<SetStateAction<T>> }
);
