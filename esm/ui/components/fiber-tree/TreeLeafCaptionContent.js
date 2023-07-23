import * as React from "react";
import ButtonExpand from "./ButtonExpand";
import FiberId from "../common/FiberId";
import FiberKey from "../common/FiberKey";
import FiberHocNames from "../common/FiberHocNames";
import { useFindMatch } from "../../utils/find-match";
import { fiberRootMode } from "../../../common/constants";
import FiberMaybeLeak from "../common/FiberMaybeLeak";
import { isHostType } from "../../utils/fiber";
const noop = () => undefined;
const TreeLeafCaptionContent = ({ fiber, expanded = false, setExpanded, setFiberElement = noop, }) => {
    const { id, type, key, mounted, leaked, events, hocDisplayNames, typeDef, rootMode, updatesCount, updatesBailoutCount, warnings, } = fiber;
    const setMainElementRef = React.useCallback(element => setFiberElement(id, element), [setFiberElement]);
    return (React.createElement("div", { className: "tree-leaf-caption__main" },
        React.createElement("div", { className: "tree-leaf-caption__main-content", ref: setMainElementRef },
            setExpanded && (React.createElement(ButtonExpand, { expanded: expanded, setExpanded: setExpanded })),
            React.createElement(DisplayName, { displayName: fiber.displayName, type: type, mounted: mounted, events: events.length > 0 }),
            React.createElement(FiberId, { id: id }),
            rootMode !== undefined ? (React.createElement("a", { className: "tree-leaf-caption__root-mode", href: "https://reactjs.org/docs/concurrent-mode-adoption.html#why-so-many-modes", rel: "noreferrer", target: "_blank", title: "Read more about render root modes" }, fiberRootMode[rootMode])) : null,
            key !== null && React.createElement(FiberKey, { fiber: fiber }),
            warnings > 0 && React.createElement("span", { className: "tree-leaf-caption__warnings" }),
            hocDisplayNames && React.createElement(FiberHocNames, { names: hocDisplayNames }),
            updatesCount > 0 && (React.createElement("span", { className: "tree-leaf-caption__update-count", title: "Number of updates" }, updatesCount)),
            updatesBailoutCount > 0 && (React.createElement("span", { className: "tree-leaf-caption__update-bailout-count", title: "Number of update bailouts" }, updatesBailoutCount)),
            Array.isArray(typeDef.contexts) && (React.createElement("span", { className: "tree-leaf-caption__context-count", title: "Number of used contexts" }, typeDef.contexts.length)),
            leaked ? React.createElement(FiberMaybeLeak, { leaked: leaked }) : null)));
};
const DisplayName = ({ displayName, type, mounted, events, }) => {
    const match = useFindMatch(displayName);
    let startStr = displayName;
    let matchStr = "";
    let endStr = "";
    if (displayName !== null && match !== null) {
        const [offset, length] = match;
        startStr = displayName.slice(0, offset);
        matchStr = displayName.slice(offset, offset + length);
        endStr = displayName.slice(offset + length);
    }
    // return displayName;
    return (React.createElement("span", { className: "tree-leaf-caption-content__name" +
            (isHostType(type) ? " host-type" : "") +
            (mounted ? "" : " unmounted") +
            (events ? "" : " no-events") },
        startStr,
        React.createElement("span", { className: "tree-leaf-caption-content__highlight" }, matchStr),
        endStr));
};
export default TreeLeafCaptionContent;
