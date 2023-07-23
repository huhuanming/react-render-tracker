import React from "react";
import { useMemoryLeaks } from "../../utils/memory-leaks";
import { Cancel as CancelIcon } from "../common/icons";
function ExposedLeaks() {
    const { exposedLeaks, cancelExposingLeakedObjectsToGlobal } = useMemoryLeaks();
    if (!exposedLeaks) {
        return null;
    }
    const fiberCount = exposedLeaks.fiberIds.length;
    const objectCount = exposedLeaks.objectRefsCount;
    return (React.createElement("div", { className: "statebar-exposed-leaks" },
        React.createElement("span", { className: "statebar-exposed-leaks__message" },
            React.createElement("b", null, objectCount),
            " potentially leaked React object",
            objectCount > 1 ? "s" : "",
            " (",
            fiberCount,
            " fibers) stored as a global variable ",
            React.createElement("b", null, exposedLeaks.globalName)),
        React.createElement("button", { className: "statebar-exposed-leaks__cancel-button", onClick: cancelExposingLeakedObjectsToGlobal }, CancelIcon)));
}
function StateBar() {
    return (React.createElement("div", { className: "statebar" },
        React.createElement(ExposedLeaks, null)));
}
const StateBarMemo = React.memo(StateBar);
StateBarMemo.displayName = "StateBar";
export default StateBarMemo;
