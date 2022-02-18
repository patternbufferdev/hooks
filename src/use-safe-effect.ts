import { useEffect, DependencyList } from "react";

export function useSafeEffect(
  effect: (isMounted: () => boolean) => unknown | (() => void),
  dependencies?: DependencyList,
) {
  useEffect(() => {
    let mounted = true;
    let destructor = effect(() => mounted);
    // TODO only return unmount when destructor not undefined?
    return () => {
      mounted = false;
      if (typeof destructor === "function") destructor();
    };
  }, dependencies);
}


type Effect<T> = (run: EffectFlag | EffectRunner<T>) => void | (() => void)
type EffectFlag = () => boolean
type EffectRunner<T> = <T>(op: () => T | void) => T | void

export function useEffectRunner<T>(
  effect: Effect<T>,
  dependencies?: DependencyList
) {
  useEffect(() => {
    let mounted = true;
    const callback = (runner: EffectFlag && EffectRunner<T>) =>
    let destructor = effect((operation) => mounted && typeof operation === function ? mounted && operation() : mounted);
    // TODO only return unmount when destructor not undefined?
    return () => {
      mounted = false;
      if (typeof destructor === 'function') destructor();
    };
  }, dependencies);

  return;
}
