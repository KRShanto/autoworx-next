"use client"
import { useState, useEffect } from "react";

type UseServerGetResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export function useServerGet<T>(
  fn: (...args: any) => Promise<T>,
  ...args: any[]
): UseServerGetResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await fn(...args); // Spread the args here
        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        if (isMounted) {
          setError(error as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fn, ...args]); // Add `args` to the dependency array

  return { data, loading, error };
}
