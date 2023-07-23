import * as React from "react";
import { MessageFiber } from "../../types";
interface FiberKeyProps {
    fiber: MessageFiber;
}
declare const FiberKey: ({ fiber: { displayName, key } }: FiberKeyProps) => React.JSX.Element;
export default FiberKey;
