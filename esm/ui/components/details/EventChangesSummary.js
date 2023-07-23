import * as React from "react";
function getChangesSummary(changes) {
    const { context, props, state } = changes;
    const reasons = [];
    if (props && props.length) {
        reasons.push("props");
    }
    if (context) {
        reasons.push("context");
    }
    if (state) {
        reasons.push("state");
    }
    return reasons.length > 0 ? reasons : null;
}
export function EventChangesSummary({ changes = null, expanded = false, toggleExpanded, }) {
    const changesSummary = changes !== null ? getChangesSummary(changes) : null;
    if (changesSummary === null) {
        return null;
    }
    return (React.createElement("span", { className: "event-changes-summary" +
            (expanded ? " expanded" : "") +
            (changes?.warnings ? " has-warnings" : ""), onClick: toggleExpanded },
        "± ",
        changesSummary.map(reason => (React.createElement("span", { key: reason, className: "event-changes-summary-reason" }, reason)))));
}
