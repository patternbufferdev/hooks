import { useCallback, useState } from "react";

export function useGate(initialState?: boolean): [false | symbol, (s?: boolean) => void] {
  const [state, setState] = useState<false | symbol>(() => stateFor(initialState));

  return [
    state,
    useCallback((state?: boolean) => {
      setState((s) => {
        return state != null ? stateFor(state) : stateFor(s === false);
      });
    }, []),
  ];
}

const stateFor = (state?: boolean | Symbol) => (state ? Symbol() : false);
