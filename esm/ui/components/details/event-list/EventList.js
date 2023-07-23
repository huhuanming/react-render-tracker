import * as React from "react";
import EventListFiberEvent from "./EventListFiberEvent";
import EventListCommitEvent from "./EventListCommitEvent";
import { useFiberMaps } from "../../../utils/fiber-maps";
const SECTION_SIZE = 50;
const SECTION_MIN_SIZE = 10;
const EventList = ({ rootId: rootFiberId, events, showTimings, }) => {
    const { commitById, fiberById } = useFiberMaps();
    const rootFiber = fiberById.get(rootFiberId);
    const [startOffset, setStartOffset] = React.useState(() => {
        const offset = Math.max(0, events.length - SECTION_SIZE);
        return offset < SECTION_MIN_SIZE ? 0 : offset;
    });
    const eventElementMap = React.useMemo(() => new WeakMap(), [rootFiberId, showTimings]);
    const getEventListItem = React.useCallback((fiberEvent, prevConjunction, nextConjunction, indirectRootTrigger) => {
        const existing = eventElementMap.get(fiberEvent);
        if (existing &&
            existing.props.prevConjunction === prevConjunction &&
            existing.props.nextConjunction === nextConjunction &&
            existing.props.indirectRootTrigger === indirectRootTrigger) {
            return existing;
        }
        const { target, targetId, event } = fiberEvent;
        let element = null;
        switch (target) {
            case "commit":
                element = (React.createElement(EventListCommitEvent, { key: event.id, commitId: targetId, event: event, showTimings: showTimings, prevConjunction: prevConjunction, nextConjunction: nextConjunction }));
                break;
            default:
                element = (React.createElement(EventListFiberEvent, { key: event.id, fiberId: targetId, event: event, changes: fiberEvent.changes, showTimings: showTimings, prevConjunction: prevConjunction, nextConjunction: nextConjunction, indirectRootTrigger: indirectRootTrigger }));
        }
        eventElementMap.set(fiberEvent, element);
        return element;
    }, [rootFiberId, showTimings]);
    if (events === null) {
        return null;
    }
    if (!events.length) {
        return React.createElement("div", { className: "fiber-event-list__no-events" }, "No events found");
    }
    const listEvents = [];
    for (let i = startOffset; i < events.length; i++) {
        const { target, targetId, event, trigger } = events[i];
        const prevCommitId = events[i - 1]?.event?.commitId;
        const nextCommitId = events[i + 1]?.event?.commitId;
        let prevConjunction = event.commitId !== -1 && event.commitId === prevCommitId;
        const nextConjunction = event.commitId !== -1 && event.commitId === nextCommitId;
        if (event.commitId !== prevCommitId) {
            const commit = commitById.get(event.commitId);
            if (commit) {
                listEvents.push(getEventListItem(commit.start, false, true, false));
                prevConjunction = true;
            }
        }
        if (target === "fiber" && targetId === rootFiberId) {
            if ("trigger" in event && trigger !== null) {
                listEvents.push(getEventListItem(trigger, true, true, rootFiber?.ownerId !== trigger.targetId));
                prevConjunction = true;
            }
        }
        listEvents.push(getEventListItem(events[i], prevConjunction, nextConjunction, false));
    }
    return (React.createElement(React.Fragment, null,
        startOffset > 0 && (React.createElement("div", { className: "fiber-event-list__show-more" },
            startOffset > SECTION_SIZE + SECTION_MIN_SIZE && (React.createElement("button", { onClick: () => setStartOffset(Math.max(0, startOffset - SECTION_SIZE)) },
                "Show ",
                Math.min(startOffset, SECTION_SIZE),
                " more...")),
            React.createElement("button", { onClick: () => setStartOffset(0) },
                "Show all the rest ",
                startOffset,
                "..."))),
        React.createElement("div", { className: "fiber-event-list" +
                (showTimings ? " fiber-event-list_show-timings" : "") }, listEvents)));
};
const EventListMemo = React.memo(EventList);
EventListMemo.displayName = "EventList";
export default EventListMemo;
