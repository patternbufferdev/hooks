import { DependencyList, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useStateEffect } from "./use-state-effect";

export function useCallEffect<T>(
  producer: (produce: Dispatch<SetStateAction<T | undefined>>) => T,
  consumer: (product: T | undefined) => ReturnType<typeof useEffect>,
  dependencies: DependencyList,
) {
  const [returnedValue, setReturnedValue] = useState<T>();

  useStateEffect(consumer, returnedValue);

  return useCallback(() => producer(setReturnedValue), [...dependencies, producer]);
}
