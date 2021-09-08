import { useEffect, useMemo, useRef } from "react";

type Callback = <T, Params extends any[]>(...args: Params) => T | void;

export function useMounted() {
  const state = useRef(true);

  useEffect(
    () => () => {
      state.current = false;
    },
    [],
  );

  return useMemo(() => {
    const run = (call: Callback) => (state.current ? call() : undefined);
    return {
      run,
      callback:
        (call: Callback) =>
        // TODO: how can we infer types from the caller when its a promise?
        <Params extends Parameters<typeof call>>(...params: Params) =>
          run(() => call(...params)),
      get state() {
        return state.current;
      },
    };
  }, []);
}
