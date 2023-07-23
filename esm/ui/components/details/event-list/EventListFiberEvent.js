import * as React from "react";
import { useSelectionState } from "../../../utils/selection";
import { ResolveSourceLoc } from "../../common/SourceLoc";
import { EventChangesSummary } from "../EventChangesSummary";
import { Fiber } from "../Fiber";
import EventListEntry from "./EventListEntry";
import EventRenderReasons from "./EventRenderReasons";
function getSpecialBadges(event) {
    switch (event.op) {
        case "update":
            return event.specialReasons;
        case "update-bailout-state":
            return [{ name: "No state changes", bailout: true, loc: null }];
        case "update-bailout-memo":
            return [{ name: "React.memo()", bailout: true, loc: null }];
        case "update-bailout-scu":
            return [{ name: "shouldComponentUpdate()", bailout: true, loc: null }];
        default:
            return null;
    }
}
const EventListFiberEvent = ({ fiberId, event, changes, showTimings, prevConjunction, nextConjunction, indirectRootTrigger, }) => {
    const [expanded, setExpanded] = React.useState(false);
    const toggleExpanded = React.useCallback(() => setExpanded(expanded => !expanded), []);
    const { selected } = useSelectionState(fiberId);
    const isUpdateTrigger = event.op === "update" && event.trigger === undefined;
    const specialBadges = getSpecialBadges(event);
    const details = (event.op === "update" ||
        event.op === "update-bailout-scu") &&
        expanded && (React.createElement(EventRenderReasons, { fiberId: fiberId, changes: changes, nextConjunction: nextConjunction }));
    return (React.createElement(EventListEntry, { op: event.op, type: "fiber", selected: selected, showTimings: showTimings, selfTime: event.op === "mount" || event.op === "update"
            ? event.selfTime
            : undefined, totalTime: event.op === "mount" || event.op === "update"
            ? event.totalTime
            : undefined, prevConjunction: prevConjunction, nextConjunction: nextConjunction, updateTrigger: event.op === "update" && isUpdateTrigger, indirectRootTrigger: indirectRootTrigger, details: details },
        React.createElement(Fiber, { fiberId: fiberId, unmounted: event.op === "unmount" }),
        React.createElement(EventChangesSummary, { changes: changes, expanded: expanded, toggleExpanded: toggleExpanded }),
        specialBadges?.map((reason, index) => (React.createElement("span", { key: index, className: "special-reason" + (reason.bailout ? " special-reason_bailout" : "") },
            React.createElement(ResolveSourceLoc, { loc: reason.loc }, reason.name))))));
};
export default EventListFiberEvent;
