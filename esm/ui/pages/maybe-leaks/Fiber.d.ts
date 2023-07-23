import * as React from "react";
declare type FiberProps = {
    fiberId: number;
    setFiberElement?: (id: number, element: HTMLElement) => void;
};
export declare const Fiber: ({ fiberId, setFiberElement }: FiberProps) => React.JSX.Element;
export {};
