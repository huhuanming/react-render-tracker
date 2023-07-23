import * as React from "react";
import { useFiber, useFiberMaps } from "../../utils/fiber-maps";
import { usePinnedContext } from "../../utils/pinned";
import FiberId from "../common/FiberId";
import TreeLeafCaption from "./TreeLeafCaption";
function FiberLink({ id, name, pin, }) {
    return (React.createElement("span", { className: "fiber-tree-header-fiber-link" },
        React.createElement("span", { className: "fiber-tree-header-fiber-link__name", onClick: () => pin(id) }, name || "Unknown"),
        React.createElement(FiberId, { id: id })));
}
function FiberPath({ fiber, groupByParent, }) {
    const { fiberById } = useFiberMaps();
    const { pin } = usePinnedContext();
    const path = [];
    const ancestorProp = groupByParent ? "parentId" : "ownerId";
    let cursor = fiber[ancestorProp];
    while (cursor !== 0) {
        const ancestor = fiberById.get(cursor);
        path.unshift(React.createElement(FiberLink, { key: cursor, id: cursor, name: ancestor?.displayName || "Unknown", pin: pin }));
        cursor = ancestor?.[ancestorProp] || 0;
    }
    if (path.length === 0) {
        return null;
    }
    return React.createElement("div", { className: "fiber-tree-header__path" }, path);
}
const FiberTreeHeader = React.memo(({ rootId, groupByParent, showTimings, }) => {
    const fiber = useFiber(rootId);
    if (rootId === 0 || !fiber) {
        return null;
    }
    return (React.createElement("div", { className: "fiber-tree-header" },
        React.createElement(FiberPath, { fiber: fiber, groupByParent: groupByParent }),
        React.createElement(TreeLeafCaption, { key: rootId, fiber: fiber, pinned: true, showTimings: showTimings })));
});
FiberTreeHeader.displayName = "FiberTreeHeader";
export default FiberTreeHeader;
