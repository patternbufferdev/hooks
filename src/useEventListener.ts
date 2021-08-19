import { DependencyList, EffectCallback, useEffect } from "react";
import { useGate } from "./use-gate";

type EventMap = WindowEventMap | DocumentEventMap | HTMLElementEventMap;
type EventTarget = Window | Document | HTMLInputElement | HTMLElement;
export function useEventListener<
  K extends keyof (WindowEventMap | DocumentEventMap | HTMLElementEventMap),
>(
  target: Window | Document | HTMLInputElement,
  type: K,
  listener: (
    this: Window | Document | HTMLInputElement,
    ev: WindowEventMap[K] | DocumentEventMap[K] | HTMLElementEventMap[K],
  ) => unknown,
  options?: boolean | AddEventListenerOptions,
) {
  const [gate, toggleGate] = useGate(true);

  useEffect(() => {
    if (gate) {
      return createEventListener(target, type, listener, options);
    }
  }, [listener, gate]);

  return [Boolean(gate), toggleGate];
}

// export function createEventListener<K extends keyof WindowEventMap>(
//   target: Window,
//   type: K,
//   listener: (this: Window, ev: WindowEventMap[K]) => unknown,
//   options?: boolean | AddEventListenerOptions,
// ): () => void;

// export function createEventListener<K extends keyof DocumentEventMap>(
//   target: Document,
//   type: K,
//   listener: (this: Document, ev: DocumentEventMap[K]) => unknown,
//   options?: boolean | AddEventListenerOptions,
// ): () => void;

// export function createEventListener<K extends keyof HTMLElementEventMap>(
//   target: HTMLInputElement,
//   type: K,
//   listener: (this: HTMLInputElement, ev: HTMLElementEventMap[K]) => unknown,
//   options?: boolean | AddEventListenerOptions,
// ): () => void;

export function createEventListener<
  K extends keyof (WindowEventMap | DocumentEventMap | HTMLElementEventMap),
>(
  target: Window | Document | HTMLInputElement,
  type: K,
  listener: (
    this: Window | Document | HTMLInputElement,
    ev: WindowEventMap[K] | DocumentEventMap[K] | HTMLElementEventMap[K],
  ) => unknown,
  options?: boolean | AddEventListenerOptions,
) {
  options = typeof options === "undefined" ? true : options;
  target.addEventListener(type, listener as EventListener, options);
  return () => target.removeEventListener(type, listener as EventListener, options);
}
