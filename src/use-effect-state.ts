import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";

import { isPromise } from "./is-promise";
import { useMountedEffect } from "./use-mounted-effect";

export function useEffectState<I, O>(
  input: I | undefined,
  relay: (request: I | undefined) => O | Promise<O>,
  initialValue?: O,
): [O | undefined, Dispatch<SetStateAction<O | undefined>>] {
  const [output, setOutput] = useState(initialValue);
  const result = useRef(output);
  const dependencies = [input, output];

  useMountedEffect((isMounted) => {
    const relayed = relay(input);

    return isPromise(relayed)
      ? relayed.then((resolved) => isMounted() && setOutput(resolved))
      : setOutput(relayed);
  }, dependencies);

  useEffect(() => {
    result.current = output;
  }, [output]);

  return [output ?? result.current, setOutput];
}
