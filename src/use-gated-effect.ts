import { DependencyList, EffectCallback, useCallback, useEffect, useState } from "react";
import { useGate } from "./use-gate";

export function useGatedEffect(effect: EffectCallback, deps: DependencyList) {
  const [state, setState] = useGate(false);

  useEffect(() => {
    if (state) {
      return effect();
    }
  }, [state, ...deps]);

  return setState;
}

export function useGatedLayoutEffect(effect: EffectCallback, deps: DependencyList) {
  const [state, setState] = useGate(false);

  useEffect(() => {
    if (state) {
      return effect();
    }
  }, [state, ...deps]);

  return setState;
}
