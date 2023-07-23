import * as React from "react";
import { FindMatchContextProvider } from "../utils/find-match";
import Toolbar from "../components/toolbar/Toolbar";
import FiberTree from "../components/fiber-tree/Tree";
import FiberTreeHeader from "../components/fiber-tree/TreeHeader";
import Details from "../components/details/Details";
import FiberTreeKeyboardNav from "../components/misc/FiberTreeKeyboardNav";
import { useSelectedId } from "../utils/selection";
import { usePinnedId } from "../utils/pinned";
function ComponentsTreePage() {
    const [groupByParent, setGroupByParent] = React.useState(false);
    const [showUnmounted, setShowUnmounted] = React.useState(true);
    const [showTimings, setShowTimings] = React.useState(false);
    const { selectedId } = useSelectedId();
    const { pinnedId } = usePinnedId();
    return (React.createElement("div", { className: "app-page app-page-components-tree", "data-has-selected": selectedId !== null || undefined },
        React.createElement(FindMatchContextProvider, null,
            React.createElement(Toolbar, { onGroupingChange: setGroupByParent, groupByParent: groupByParent, onShowUnmounted: setShowUnmounted, showUnmounted: showUnmounted, onShowTimings: setShowTimings, showTimings: showTimings }),
            React.createElement(FiberTreeHeader, { rootId: pinnedId, groupByParent: groupByParent, showTimings: showTimings }),
            React.createElement(FiberTreeKeyboardNav, { groupByParent: groupByParent, showUnmounted: showUnmounted }),
            React.createElement(FiberTree, { rootId: pinnedId, groupByParent: groupByParent, showUnmounted: showUnmounted, showTimings: showTimings })),
        selectedId !== null && (React.createElement(Details, { rootId: selectedId, groupByParent: groupByParent, showUnmounted: showUnmounted, showTimings: showTimings }))));
}
const ComponentsTreePageMemo = React.memo(ComponentsTreePage);
ComponentsTreePageMemo.displayName = "ComponentsTreePage";
export { ComponentsTreePageMemo as ComponentsTreePage };
