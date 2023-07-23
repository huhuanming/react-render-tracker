import * as React from "react";
interface Pinned {
    pinnedId: number;
    pin: (nextPinnedId: number) => void;
    subscribe: (fn: (value: number) => void) => () => void;
}
export declare const usePinnedContext: () => Pinned;
export declare const PinnedContextProvider: ({ children, }: {
    children: React.ReactNode;
}) => React.JSX.Element;
export declare const PinnedIdConsumer: ({ children, }: {
    children: (pinnedId: number) => JSX.Element;
}) => JSX.Element;
export declare const usePinnedId: () => {
    pinnedId: number;
    pin: (nextPinnedId: number) => void;
};
export {};
