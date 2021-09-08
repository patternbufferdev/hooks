import { useEffect, useState, DependencyList } from "react";
import { useMounted } from "./use-mounted";

export { useAsyncResult, Result, Status };

enum Status {
  Loading = "Loading",
  Failure = "Failure",
  Success = "Success",
}

type Loading = { status: Status.Loading };
type Failed<Error> = { status: Status.Failure; error: Error };
type Loaded<Payload> = { status: Status.Success; payload: Payload };

type Result<Payload, Error = unknown> = Loading | Failed<Error> | Loaded<Payload>;

function useAsyncResult<Payload>(
  process: () => Promise<Payload>,
  dependencies: DependencyList = [],
) {
  const mounted = useMounted();
  const [result, setResult] = useState<Result<Payload>>({
    status: Status.Loading,
  });

  useEffect(() => {
    if (result.status !== Status.Loading) {
      setResult({ status: Status.Loading });
    }

    (async () => {
      let result: Result<Payload>;
      try {
        result = { status: Status.Success, payload: await process() };
      } catch (error) {
        result = { status: Status.Failure, error };
      }
      mounted.run(() => setResult(result));
    })();
  }, dependencies);

  return result;
}
