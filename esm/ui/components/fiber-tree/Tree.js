import * as React from "react";
import { useFiberChildren } from "../../utils/fiber-maps";
import { ScrollFiberIntoViewIfNeeded } from "./ScrollSelectedIntoViewIfNeeded";
import TreeLeaf from "./TreeLeaf";
import { TreeViewSettingsContext } from "./contexts";
const Tree = ({ rootId = 0, groupByParent = false, showUnmounted = true, showTimings = false, }) => {
    const children = useFiberChildren(rootId, groupByParent, showUnmounted);
    const viewSettings = React.useMemo(() => {
        const fiberElementById = new Map();
        return {
            setFiberElement: (id, element) => element
                ? fiberElementById.set(id, element)
                : fiberElementById.delete(id),
            getFiberElement: id => fiberElementById.get(id) || null,
            groupByParent,
            showUnmounted,
            showTimings,
        };
    }, [groupByParent, showUnmounted, showTimings]);
    return (React.createElement("div", { className: "fiber-tree" + (showTimings ? " timings" : "") },
        React.createElement("div", { className: "fiber-tree__scroll-area" },
            React.createElement("div", { className: "fiber-tree__content" },
                React.createElement(TreeViewSettingsContext.Provider, { value: viewSettings },
                    rootId !== 0 && children.length === 0 ? (React.createElement("div", { className: "fiber-tree__no-children" }, "No children yet")) : (children.map(childId => (React.createElement(TreeLeaf, { key: childId, fiberId: childId, depth: rootId === 0 ? 0 : 1 })))),
                    React.createElement(ScrollFiberIntoViewIfNeeded, null))))));
};
const TreeMemo = React.memo(Tree);
TreeMemo.displayName = "Tree";
export default TreeMemo;
