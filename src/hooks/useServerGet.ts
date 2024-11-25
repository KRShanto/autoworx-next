"use client";
import { useState, useEffect } from "react";

type UseServerGetResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
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
  }, [...args]); // Add `args` to the dependency array

  return { data, loading, error, setData, setLoading, setError };
}

export function useServerGetInterval<T>(
  fn: (...args: any) => Promise<T>,
  interval: number = 5000, // New interval parameter with a default of 5 seconds
  ...args: any[]
): UseServerGetResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fn(...args);
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

    // Call fetchData immediately, then set interval
    fetchData();
    const intervalId = setInterval(fetchData, interval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [interval, ...args]);

  return { data, loading, error, setData, setLoading, setError };
}
