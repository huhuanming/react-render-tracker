import * as React from "react";
import { ContextChange, PropChange, StateChange, } from "./EventRenderReasonsItem";
const EventRenderReasons = ({ fiberId, changes, nextConjunction, }) => {
    if (!changes) {
        return React.createElement(React.Fragment, null, "Unknown changes");
    }
    const warn = changes.warnings || new Set();
    return (React.createElement("div", { className: "event-render-reasons" +
            (nextConjunction ? " event-render-reasons_next" : "") },
        React.createElement("div", { className: "event-render-reasons__list" },
            changes.props?.map((entry, index) => (React.createElement(PropChange, { key: index, entry: entry, warn: warn.has(entry) }))),
            changes.context?.map((entry, index) => (React.createElement(ContextChange, { key: index, entry: entry, fiberId: fiberId }))),
            changes.state?.map((entry, index) => (React.createElement(StateChange, { key: index, entry: entry, warn: warn.has(entry) }))))));
};
export default EventRenderReasons;
