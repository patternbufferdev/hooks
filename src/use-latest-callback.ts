import { useMemo, useRef } from "react";
import { useMountedEffect } from "./use-mounted-effect";

const squelch = () => {};

export function useLatestCallback<T extends (...args: any[]) => any>(callback: T) {
  const callbackRef = useRef(callback);

  useMountedEffect(
    (mounted) => {
      callbackRef.current = mounted() ? callback : <T>squelch;
    },
    [callback],
  );

  return useMemo(() => <T>((...args) => callbackRef.current?.(...args)), []);
}
