import * as React from "react";
import { useEventLog } from "../../../utils/events";
interface EventListProps {
    rootId: number;
    events: ReturnType<typeof useEventLog>;
    showTimings: boolean;
}
declare const EventListMemo: React.MemoExoticComponent<({ rootId: rootFiberId, events, showTimings, }: EventListProps) => React.JSX.Element | null>;
export default EventListMemo;
