import React, { FC } from "react";
import cx, { Argument } from "classnames";

export type ElmComponent = FC<ElmProps>;
export type ElmProps = {
  as?: string | React.ComponentType<{ className: string }>;
  cx?: Argument;
};

/**
 * Element Map
 * The Element Map component is a convenience for
 * coallescing css on to a given element
 */
export const Elm: FC<ElmProps> = ({ as: Elm = "div", cx: classNames }) => (
  <Elm className={cx(classNames)} />
);

export const useElm = (props: ElmProps) => <Elm {...props} />;
