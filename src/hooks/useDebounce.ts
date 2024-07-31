import { useRef } from "react";

export const useDebounce = (fn: Function, delay: number) => {
  const timeRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  return (...args: any) => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
