import { useEffect } from "react";

export function useStateEffect<T = undefined>(
  effect: (state: T | undefined) => ReturnType<typeof useEffect>,
  state: T | undefined,
) {
  return useEffect(() => effect(state), [state]);
}
