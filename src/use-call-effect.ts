import { DependencyList, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useMountedEffect } from "./use-mounted-effect";

// can be used to multiplex a source to many sinks … maybe
// I don't really remmeber why I wrote this
export function useCallEffect<T>(
  source: (produce: Dispatch<SetStateAction<T | undefined>>) => T,
  sink: (product: T | undefined) => ReturnType<typeof useEffect>,
  deps: DependencyList,
) {
  const [message, setMessage] = useState<T>();

  useMountedEffect(
    (mounted) => {
      return mounted() ? sink(message) : undefined;
    },
    [sink, message],
  );

  return useCallback(() => source(setMessage), [source, ...deps]);
}
