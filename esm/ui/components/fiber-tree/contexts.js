import * as React from "react";
export const TreeViewSettingsContext = React.createContext({
    setFiberElement: () => undefined,
    getFiberElement: () => null,
    groupByParent: false,
    showUnmounted: true,
    showTimings: false,
});
export const useTreeViewSettingsContext = () => React.useContext(TreeViewSettingsContext);
