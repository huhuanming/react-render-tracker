import * as React from "react";
interface SourceLocationsContext {
    subscribe: (loc: string, fn: (resolved: string) => void) => () => void;
    resolvedLocation: (loc?: string | null) => string | null;
}
declare const SourceLocationsContext: React.Context<SourceLocationsContext>;
export declare const useSourceLocations: () => SourceLocationsContext;
export declare function SourceLocationsContextProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare const useResolvedLocation: (loc: string | null | undefined) => string | null;
export {};
