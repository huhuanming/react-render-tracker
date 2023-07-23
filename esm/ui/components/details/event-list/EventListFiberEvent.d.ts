import * as React from "react";
import { SourceFiberEvent, FiberChanges } from "../../../types";
interface EventListFiberEventProps {
    fiberId: number;
    event: SourceFiberEvent;
    changes: FiberChanges | null;
    showTimings: boolean;
    prevConjunction: boolean;
    nextConjunction: boolean;
    indirectRootTrigger?: boolean;
}
declare const EventListFiberEvent: ({ fiberId, event, changes, showTimings, prevConjunction, nextConjunction, indirectRootTrigger, }: EventListFiberEventProps) => React.JSX.Element;
export default EventListFiberEvent;
