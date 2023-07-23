import * as React from "react";
import { useFiber, useFiberChildren } from "../../utils/fiber-maps";
import { useTreeViewSettingsContext } from "./contexts";
import TreeLeafCaption from "./TreeLeafCaption";
const TreeLeaf = React.memo(({ fiberId, depth = 0 }) => {
    const { setFiberElement, groupByParent, showUnmounted, showTimings } = useTreeViewSettingsContext();
    const fiber = useFiber(fiberId);
    const children = useFiberChildren(fiberId, groupByParent, showUnmounted);
    const [expanded, setExpanded] = React.useState(true);
    const hasChildren = children.length > 0;
    if (!fiber) {
        return null;
    }
    return (React.createElement("div", { className: "tree-leaf" + (fiber.ownerId === 0 ? " render-root" : "") },
        React.createElement(TreeLeafCaption, { depth: Math.max(depth - 1, 0), fiber: fiber, expanded: expanded, setExpanded: hasChildren ? setExpanded : undefined, showTimings: showTimings, setFiberElement: setFiberElement }),
        expanded &&
            children.map(childId => (React.createElement(TreeLeaf, { key: childId, fiberId: childId, depth: depth + 1 })))));
});
TreeLeaf.displayName = "TreeLeaf";
export default TreeLeaf;
