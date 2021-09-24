import React, { ComponentType, FC, CSSProperties } from "react";
import cx, { Argument } from "classnames";

export type ElmProps<T = {}> = T & {
  as?: string | ComponentType<{ className: string }>;
  cx?: Argument;
  style?: CSSProperties;
};

export type ElmGlue<T = {}> = FC<ElmProps<Pick<T, Exclude<keyof T, keyof ElmProps>>>>;

/**
 * use Elm Props — the meat of the 🥧 :
 * The "elmers glue" of classnames and style props
 */
export const useElmProps = (a: ElmProps, b?: ElmProps) => {
  const { as: aas, cx: acx, style: astyle, ...aprops } = a;
  const { as: bas, cx: bcx, style: bstyle, ...bprops } = b ?? {};

  return {
    ...aprops,
    ...bprops,
    as: bas ?? aas,
    className: cx(acx, bcx),
    style: { ...astyle, ...bstyle },
  };
};

/**
 * Elm Create:
 * The "elemers glue factory" for creating shallow render
 * trees with prop extension for more expressive elements
 */
function create<D>(name?: string, defaults?: ElmProps<Partial<D>>) {
  const Elm: ElmGlue<Partial<D>> = (props) => {
    const { as: El = "div", ...elmProps } = useElmProps(props, defaults);

    return <El {...elmProps} />;
  };

  Elm.displayName = name;

  return Elm;
}

/**
 * Elm — Element Mapping:
 * The "elmers glue" for coalescing classnames as a
 * given element or component.
 */
export const Elm: ElmGlue = Object.assign(create(), { create: create, cx });
