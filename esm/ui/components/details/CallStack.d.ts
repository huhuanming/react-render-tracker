import * as React from "react";
import { TransferCallTrace, TransferCallTracePoint } from "../../types";
export declare function CallTracePath({ path, expanded, }: {
    path: TransferCallTracePoint[] | null | undefined;
    expanded?: boolean;
}): React.JSX.Element | null;
export declare function CallTraceList({ traces, expanded, compat, }: {
    traces: TransferCallTrace[];
    expanded?: boolean;
    compat?: boolean;
}): React.JSX.Element;
