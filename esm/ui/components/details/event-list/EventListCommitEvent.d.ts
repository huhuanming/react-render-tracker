import * as React from "react";
import { SourceCommitEvent } from "../../../types";
interface EventListCommitEventProps {
    commitId: number;
    event: SourceCommitEvent;
    showTimings: boolean;
    prevConjunction: boolean;
    nextConjunction: boolean;
}
declare const EventListCommitEvent: ({ commitId, event, showTimings, prevConjunction, nextConjunction, }: EventListCommitEventProps) => React.JSX.Element;
export default EventListCommitEvent;
