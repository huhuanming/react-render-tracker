import * as React from "react";
import { SourceCommitEvent, SourceFiberEvent } from "../../../types";
interface EventListFiberEventProps {
    op: SourceFiberEvent["op"] | SourceCommitEvent["op"];
    type: string;
    selected?: boolean;
    showTimings: boolean;
    selfTime?: number;
    totalTime?: number;
    prevConjunction: boolean;
    nextConjunction: boolean;
    updateTrigger?: boolean;
    indirectRootTrigger?: boolean;
    children: React.ReactNode;
    details?: React.ReactNode;
}
declare const EventListEntry: ({ op, type, selected, selfTime, totalTime, showTimings, prevConjunction, nextConjunction, updateTrigger, indirectRootTrigger, children: main, details, }: EventListFiberEventProps) => React.JSX.Element;
export default EventListEntry;
