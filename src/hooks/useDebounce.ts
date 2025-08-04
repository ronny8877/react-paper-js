import { useCallback, useRef } from "react";

export function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timerRef = useRef<any | null>(null);

  const debouncedCallback = useCallback(
    (...args: any[]) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedCallback;
}
