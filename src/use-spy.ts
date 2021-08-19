import { useCallback } from "react";

type Spyable = (...args: unknown[]) => any;
type Spy<T extends Spyable> = (method: T, args: Parameters<T>) => ReturnType<T>;
type SpyPipe<T extends Spyable> = (...args: Parameters<T>) => Spy<T>;
type SpyFactory<T extends Spyable> = (method: T) => Spy<T>;

export function useSpy<T extends Spyable>(spy: Spy<T>, method?: T) {
  return useCallback(method ? spyFor(spy, method) : spyFor(spy), [method]);
}

export function spyFor<T extends Spyable>(spy: Spy<T>): SpyFactory<T>;
export function spyFor<T extends Spyable>(spy: Spy<T>, method: T): SpyPipe<T>;
export function spyFor<T extends Spyable>(spy: Spy<T>, method?: T) {
  if (method == null) {
    return (method: T) => spyFor(spy, method);
  }

  const pipe: SpyPipe<T> = (...args: Parameters<T>) => {
    return spy(method, args);
  };

  return pipe;
}

// example
export function useLoggingSpy<T extends Spyable>(method: T, key?: string) {
  key = key || method.name || "unknown";
  return useSpy((wrapped, args) => {
    console.log(key, args);
    return wrapped(...args);
  }, method);
}
