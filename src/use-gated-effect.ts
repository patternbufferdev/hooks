import { DependencyList, EffectCallback, useCallback, useEffect, useState } from "react";

export function useGatedEffect(effect: EffectCallback, deps: DependencyList) {
  const [state, setState] = useState(false);

  useEffect(() => {
    if (state) {
      effect();
    }
  }, [state, ...deps]);

  return useCallback((state?: boolean) => {
    setState((s) => (state == null ? !s : state));
  }, []);
}

export function useGatedLayoutEffect(effect: EffectCallback, deps: DependencyList) {
  const [state, setState] = useState(false);

  useEffect(() => {
    if (state) {
      effect();
    }
  }, [state, ...deps]);

  return useCallback((state?: boolean) => {
    setState((s) => (state == null ? !s : state));
  }, []);
}

export function useGate(): [boolean, (s?: boolean) => void] {
  const [state, setState] = useState(false);

  return [
    state,
    useCallback((state?: boolean) => {
      setState((s) => (state == null ? !s : state));
    }, []),
  ];
}
