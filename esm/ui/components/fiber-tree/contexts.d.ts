import * as React from "react";
export interface TreeViewSettings {
    setFiberElement: (id: number, element: HTMLElement | null) => void;
    getFiberElement: (id: number) => HTMLElement | null;
    groupByParent: boolean;
    showUnmounted: boolean;
    showTimings: boolean;
}
export declare const TreeViewSettingsContext: React.Context<TreeViewSettings>;
export declare const useTreeViewSettingsContext: () => TreeViewSettings;
