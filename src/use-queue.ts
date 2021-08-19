import { useCallback, useState } from "react";

type UseQueue<T> = [queue: T[], append: (v: T | unknown) => void, clear: () => void];

export function useQueue<T extends string>(
  filter: (value: T | unknown) => boolean = Boolean,
): UseQueue<T> {
  const [queue, setQueue] = useState<T[]>([]);

  const append = useCallback(
    (value: T | unknown) => {
      if (filter(value)) setQueue((q) => q.concat(value as T));
    },
    [filter],
  );

  const clear = useCallback(() => {
    setQueue((queue) => (queue.length ? [] : queue));
  }, []);

  return [queue, append, clear];
}
