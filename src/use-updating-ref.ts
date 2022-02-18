import { useEffect, useRef } from "react";

export function useUpdatingRef<T>(value: T) {
  const ref = useRef<T>(value);

  // is there any harm in just doing it this way?
  // ref.current = value;
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
