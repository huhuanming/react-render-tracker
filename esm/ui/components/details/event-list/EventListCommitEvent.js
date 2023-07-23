import * as React from "react";
import { useCommit } from "../../../utils/fiber-maps";
import EventListEntry from "./EventListEntry";
import { Fiber } from "../Fiber";
import { ResolveSourceLoc } from "../../common/SourceLoc";
const CommitTriggers = ({ triggers }) => {
    return (React.createElement("div", { className: "event-list-item__commit-details" }, triggers?.map((trigger, idx) => (React.createElement("div", { key: idx },
        trigger.relatedFiberId &&
            trigger.relatedFiberId !== trigger.fiberId && (React.createElement(React.Fragment, null,
            React.createElement(Fiber, { fiberId: trigger.relatedFiberId }),
            " → ")),
        React.createElement(Fiber, { fiberId: trigger.fiberId }),
        React.createElement("div", { style: { margin: "0 0 2px 10px" } },
            "[",
            trigger.event ? `${trigger.type} ${trigger.event}` : trigger.type,
            "]",
            " ",
            React.createElement(ResolveSourceLoc, { loc: trigger.loc }, trigger.kind)))))));
};
const EventListCommitEvent = ({ commitId, event, showTimings, prevConjunction, nextConjunction, }) => {
    const [expanded, setIsCollapsed] = React.useState(false);
    const commit = useCommit(commitId);
    const triggers = commit?.start.event.triggers;
    const triggerFiberCount = triggers?.reduce((ids, trigger) => ids.add(trigger.fiberId), new Set())
        .size || 0;
    const details = triggers && expanded && (React.createElement(CommitTriggers, { triggers: triggers }));
    return (React.createElement(EventListEntry, { op: event.op, type: "commit", details: details, showTimings: showTimings, prevConjunction: prevConjunction, nextConjunction: nextConjunction },
        React.createElement("span", { className: "event-list-item__commit-name" },
            "Commit #",
            commitId),
        false && triggers && (React.createElement("span", { className: "event-list-item__commit-triggers" + (expanded ? " expanded" : ""), onClick: () => setIsCollapsed(expanded => !expanded) },
            triggerFiberCount,
            triggerFiberCount > 1 ? " triggers" : " trigger"))));
};
export default EventListCommitEvent;
