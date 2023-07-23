import * as React from "react";
import FiberHocNames from "../../components/common/FiberHocNames";
import FiberKey from "../../components/common/FiberKey";
import FiberId from "../../components/common/FiberId";
import { useSelectionState } from "../../utils/selection";
import { useFiber } from "../../utils/fiber-maps";
import FiberMaybeLeak from "../../components/common/FiberMaybeLeak";
const noop = () => {
    /* noop */
};
export const Fiber = ({ fiberId, setFiberElement = noop }) => {
    const { selected, select } = useSelectionState(fiberId);
    const fiber = useFiber(fiberId);
    const { id, key, leaked, hocDisplayNames, typeDef, updatesCount, updatesBailoutCount, warnings, } = fiber;
    const handleSelect = React.useCallback((event) => {
        event.stopPropagation();
        select(id);
    }, []);
    const setMainElementRef = React.useCallback(element => setFiberElement(id, element), [setFiberElement]);
    return (React.createElement("div", { className: "maybe-leaks-page-fiber" + (selected ? " selected" : ""), onClick: handleSelect },
        React.createElement("div", { className: "maybe-leaks-page-fiber__content", ref: setMainElementRef },
            React.createElement("span", { className: "maybe-leaks-page-fiber__name" + (leaked ? " leaked" : "") }, fiber.displayName),
            React.createElement(FiberId, { id: id }),
            key !== null && React.createElement(FiberKey, { fiber: fiber }),
            warnings > 0 && React.createElement("span", { className: "tree-leaf-caption__warnings" }),
            hocDisplayNames && React.createElement(FiberHocNames, { names: hocDisplayNames }),
            updatesCount > 0 && (React.createElement("span", { className: "tree-leaf-caption__update-count", title: "Number of updates" }, updatesCount)),
            updatesBailoutCount > 0 && (React.createElement("span", { className: "tree-leaf-caption__update-bailout-count", title: "Number of update bailouts" }, updatesBailoutCount)),
            Array.isArray(typeDef.contexts) && (React.createElement("span", { className: "tree-leaf-caption__context-count", title: "Number of used contexts" }, typeDef.contexts.length)),
            leaked ? React.createElement(FiberMaybeLeak, { leaked: leaked }) : null)));
};
