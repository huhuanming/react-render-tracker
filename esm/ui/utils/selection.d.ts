import * as React from "react";
interface SelectionHistoryState {
    hasPrev: boolean;
    prev(): void;
    hasNext: boolean;
    next(): void;
}
export declare const SelectionContextProvider: ({ children, }: {
    children: React.ReactNode;
}) => React.JSX.Element;
export declare const SelectedIdConsumer: ({ children, }: {
    children: (selectedId: number | null) => JSX.Element;
}) => JSX.Element;
export declare const useSelectionState: (id: number) => {
    selected: boolean;
    select: (nextSelectedId: number | null, pushHistory?: boolean) => void;
};
export declare const useSelectionHistoryState: () => SelectionHistoryState;
export declare const useSelectedId: () => {
    selectedId: number | null;
    select: (nextSelectedId: number | null, pushHistory?: boolean) => void;
};
export {};
