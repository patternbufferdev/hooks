import { useEffect, DependencyList } from "react";
// TODO: mounted.run(effect)
// import { useMounted } from "./use-mounted";

type Effect = (run: Condition | (() => Destructor)) => Destructor;
type Condition = () => boolean;
type Operation = (condition: Condition) => Destructor;
type Destructor = void | (() => void);

export function useMountedEffect(effect: Effect, dependencies?: DependencyList) {
  useEffect(() => {
    let mounted = true;
    const destructor = effect(onCondition(() => mounted));

    return () => {
      mounted = false;
      destructor?.();
    };
  }, dependencies);
}

function onCondition(condition: Condition) {
  return (operation?: Operation) =>
    typeof operation === "function" ? () => condition() && operation(condition) : condition;
}
