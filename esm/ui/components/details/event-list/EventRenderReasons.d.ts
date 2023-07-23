import * as React from "react";
import { FiberEvent } from "../../../types";
interface EventRenderReasonsProps {
    fiberId: number;
    changes: FiberEvent["changes"];
    nextConjunction: boolean;
}
declare const EventRenderReasons: ({ fiberId, changes, nextConjunction, }: EventRenderReasonsProps) => React.JSX.Element;
export default EventRenderReasons;
