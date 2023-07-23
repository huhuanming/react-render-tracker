import * as React from "react";
export declare const HighlightingContextProvider: ({ children, }: {
    children: React.ReactNode;
}) => React.JSX.Element;
export declare const useInspectMode: () => {
    inspectMode: boolean;
    startInspect: () => void;
    stopInspect: () => void;
    toggleInspect: () => void;
};
export declare const useHighlightingState: (id: number) => {
    highlighted: boolean;
    startHighlight: () => void;
    stopHighlight: () => void;
};
export declare const useHighlightedId: () => {
    highlightedId: number | null;
    highlight: (nextSelectedId: number | null, pushHistory?: boolean) => void;
};
