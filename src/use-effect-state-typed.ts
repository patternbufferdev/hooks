import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";

type UseEffectConsumer<Request, Response> = (
  request: Request | undefined,
) => Response | Promise<Response>;

type UseEffectStateReturnType<Response> = [
  Response | undefined,
  Dispatch<SetStateAction<Response | undefined>>,
];

export function useEffectState<Request, Response>(
  consumable: Request | undefined,
  consume: UseEffectConsumer<Request, Response>,
  initialValue?: Response,
): UseEffectStateReturnType<Response> {
  const [effectState, setEffectState] = useState(initialValue);
  const ref = useRef(effectState);

  useEffect(() => {
    ref.current = effectState;
  }, [effectState]);

  useEffect(() => {
    let mounted = true;

    if (ref.current !== effectState) {
      Promise.resolve(consume(consumable)).then((response) => {
        if (mounted) {
          setEffectState(response);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [consumable, effectState]);

  return [effectState ?? ref.current, setEffectState] as UseEffectStateReturnType<Response>;
}
