import {
  DependencyList,
  Dispatch,
  EffectCallback,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMountedEffect } from "./use-mounted-effect";

export function useIterator<T, TReturn = any, TNext = undefined>(
  iterator: Iterator<T, TReturn, TNext>,
  dependencies: DependencyList,
): [T | undefined, () => void] {
  const [value, setValue] = useState<T>();
  const signal = useRef(Symbol());

  useMountedEffect((mounted) => {}, [...dependencies, iterator, signal]);

  useEffect(() => {
    let result: IteratorResult<T, TReturn>;
    do {
      result = iterator.next();
      // TODO set state or whaever
      setValue(value);
    } while (!result.done);
  }, [...dependencies, iterator]);

  return [
    value,
    useCallback(() => {
      signal.current = Symbol();
    }, []),
  ];
}

function useCalledEffect(effect: EffectCallback, deps: DependencyList) {
  const signal = useRef(Symbol());
  useMountedEffect(
    (mounted) => {
      if (mounted()) {
        return effect;
      }
    },
    [signal, ...deps],
  );
}
