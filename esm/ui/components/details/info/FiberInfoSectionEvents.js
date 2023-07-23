import * as React from "react";
import { useEventLog } from "../../../utils/events";
import ButtonToggle from "../../common/ButtonToggle";
import { SubtreeToggle } from "../../common/icons";
import EventList from "../event-list/EventList";
import { FiberInfoSection } from "./FiberInfoSection";
export function FiberInfoSectionEvents({ fiber, groupByParent, showUnmounted, showTimings, }) {
    const [showSubtreeEvents, setShowSubtreeEvents] = React.useState(false);
    const events = useEventLog(fiber.id, groupByParent, showUnmounted, showSubtreeEvents);
    return (React.createElement(FiberInfoSection, { id: "events", header: `${"Events"} ${events.length ? ` (${events.length})` : ""}`, emptyText: "No events", expandedOpts: React.createElement(ButtonToggle, { icon: SubtreeToggle, isActive: showSubtreeEvents, onChange: setShowSubtreeEvents, className: "fiber-info-section-events__subtree-toggle", tooltip: showSubtreeEvents
                ? "Show component's events only"
                : "Include events for descendant components of selected component" }) }, events.length === 0 ? undefined : (React.createElement("div", { className: "fiber-info-section-events" },
        React.createElement(EventList
        // key used to reset state of visible records on component & settings change
        , { 
            // key used to reset state of visible records on component & settings change
            key: [
                fiber.id,
                groupByParent,
                showUnmounted,
                showSubtreeEvents,
            ].join("-"), rootId: fiber.id, events: events, showTimings: showTimings })))));
}
