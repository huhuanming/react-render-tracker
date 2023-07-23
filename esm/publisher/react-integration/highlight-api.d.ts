import { HighlightState } from "rempl";
import { ReactInterationApi } from "../types";
declare type StateChangeHandler = (state: HighlightState) => void;
export declare function createHighlightApi({ getFiberIdForNative, findNativeNodesForFiberId, getDisplayNameForFiberId, }: ReactInterationApi): {
    subscribe: (fn: StateChangeHandler) => () => void;
    startHighlight: (fiberId: number) => void;
    stopHighlight: () => void;
    startInspect: () => void;
    stopInspect: () => void;
};
export {};
