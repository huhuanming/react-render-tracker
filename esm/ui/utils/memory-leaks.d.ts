import * as React from "react";
import { ExposedToGlobalLeaksState } from "rempl";
interface MemoryLeaksContext {
    breakLeakedObjectRefs: () => void;
    exposeLeakedObjectsToGlobal: (fiberIds?: number[]) => void;
    cancelExposingLeakedObjectsToGlobal: () => void;
    exposedLeaks: ExposedToGlobalLeaksState;
}
declare const MemoryLeaksContext: React.Context<MemoryLeaksContext>;
export declare const useMemoryLeaks: () => MemoryLeaksContext;
export declare function MemoryLeaksContextProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
export {};
