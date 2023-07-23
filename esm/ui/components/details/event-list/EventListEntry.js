import * as React from "react";
import { formatDuration } from "../../../utils/duration";
const opTooltip = {
    mount: "Mount",
    update: "Update",
    "update-bailout-state": "Update bailout (rendered but return is discarded and further update is prevented due to no changes in state)",
    "update-bailout-memo": "React.memo() update bailout (render and further updates are prevented due to no changes in props)",
    "update-bailout-scu": 'shouldComponentUpdate() bailout (state and props are set, but render and further updates are prevented due "shouldComponentUpdate" method returned false)',
    unmount: "Unmount",
    "effect-create": "Create effect",
    "effect-destroy": "Destroy effect",
    "commit-start": "Commit start",
    "maybe-leaks": "Potential memory leaks list changed",
};
const EventListEntry = ({ op, type, selected = false, selfTime, totalTime, showTimings, prevConjunction, nextConjunction, updateTrigger = false, indirectRootTrigger, children: main, details, }) => {
    return (React.createElement("div", { "data-op": op + (updateTrigger ? "-trigger" : ""), "data-type": type, className: "event-list-item" +
            (indirectRootTrigger ? " event-list-item_indirect-root-trigger" : "") +
            (selected ? " event-list-item_selected" : "") },
        showTimings && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "event-list-item__time", title: "Self time" }, typeof selfTime === "number" && formatDuration(selfTime)),
            React.createElement("div", { className: "event-list-item__time", title: "Total time" }, typeof totalTime === "number" && formatDuration(totalTime)))),
        React.createElement("div", { className: "event-list-item__dots" },
            React.createElement("div", { className: "event-list-item__dot", title: opTooltip[op] }),
            prevConjunction && React.createElement("div", { className: "event-list-item__dots-prev" }),
            nextConjunction && React.createElement("div", { className: "event-list-item__dots-next" }),
            indirectRootTrigger && (React.createElement("div", { className: "event-list-item__indirect-root-trigger" }))),
        React.createElement("div", { className: "event-list-item__content" },
            React.createElement("div", { className: "event-list-item__main" }, main),
            details)));
};
export default EventListEntry;
