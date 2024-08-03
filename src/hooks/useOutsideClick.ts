import { useEffect } from "react";

function useOutsideClick(callback: () => void) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const popperContentWrapper = document.querySelector(
        "[data-radix-popper-content-wrapper]",
      );

      // Type assertion to treat event.target as a Node
      if (
        popperContentWrapper &&
        event.target instanceof Node &&
        !popperContentWrapper.contains(event.target)
      ) {
        setTimeout(() => {
          callback();
        }, 100);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [callback]);
}

export default useOutsideClick;
