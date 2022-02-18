type Ref<K> = [ref: K];

type RefMap<K> = Map<K, Ref<K>>;
type RefWeakMap<K, V> = WeakMap<Ref<K>, V>;
type RefMutation = <V, K = string>(refs: Map<K, Ref<K>>, buffer: WeakMap<Ref<K>, V>) => void;
type Purge<K, V> = (refs: RefMap<K>, buffer: RefWeakMap<K, V>) => void;

type MapLike<K, V> = {
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => any;
  delete: (key: K) => void;
};

export function createWeakCache<V, K = string, U extends V = V>(purge: Purge<K, V>) {
  const refs = new Map<K, Ref<K>>();
  const buffer = new WeakMap<Ref<K>, V>();

  return (id: K, method: () => U) => {
    let ref: Ref<K> = set(refs, id, (v) => v ?? [id]);
    let value: V | undefined;
    return set(buffer, ref, (value) => {
      if (value == null) {
        purge?.(refs, buffer);
      }

      return value ?? method();
    });
  };
}

function set<K, V>(map: MapLike<K, V>, id: K, callback: (v?: V) => V): V {
  const source = map.get(id);
  const target = callback(source);

  if (source !== target) {
    map.set(id, target);
  }

  return target;
}

function purge<V, K = string>(
  refs: RefMap<K>,
  buffer: RefWeakMap<K, V>,
  shouldPurge?: (id: K, ref: Ref<K>, buffer: RefWeakMap<K, V>) => boolean,
): void {
  Array.from(refs.entries()).forEach(([id, ref]) => {
    // return when non-zero or the value is still retained
    if (shouldPurge?.(id, ref, buffer)) {
      return;
    }
    // remove from refs and buffer
    else {
      refs.delete(id);
      buffer.delete(ref);
    }
  });
}

export function willPurgeByInterval(interval: number = 1000) {
  let promise: Promise<unknown> | void;
  return <V, K = string>(refs: Map<K, Ref<K>>, buffer: WeakMap<Ref<K>, V>) => {
    if (promise) return;

    promise = new Promise((next) => setTimeout(next, interval)).then(() => {
      promise = purge(refs, buffer, (id, ref, buffer) => {
        return Boolean(buffer.get(ref));
      });
    });
  };
}

export function willPurgeByCallCount(frequency: number = 10) {
  const executions = new Map();

  return <V, K = string>(refs: Map<K, Ref<K>>, buffer: WeakMap<Ref<K>, V>) =>
    purge(refs, buffer, (id, ref) => {
      const count = set(executions, id, (v = 0) => (v + 1) % frequency);
      return Boolean(count || buffer.get(ref));
    });
}
