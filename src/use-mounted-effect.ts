import { useEffect, DependencyList } from "react";

type Effect = (run: Condition | (() => Destructor)) => Destructor;
type Condition = () => boolean;
type Operation = (condition: Condition) => Destructor;
type Destructor = void | (() => void);

export function useMountedEffect(
  effect: (isMounted: Condition) => Destructor,
  dependencies?: DependencyList,
) {
  useEffect(() => {
    let mounted = true;
    let destructor = effect(() => mounted);

    return () => {
      mounted = false;
      destructor?.();
    };
  }, dependencies);
}

export function useEffectGate(effect: Effect, dependencies?: DependencyList) {
  return useMountedEffect((isMounted) => effect(onCondition(isMounted)), dependencies);
}

export function useMountedEffectRun(effect: Effect, dependencies?: DependencyList) {
  useEffect(() => {
    let mounted = true;
    const condition = () => mounted;
    const destructor = effect(onCondition(condition));

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
