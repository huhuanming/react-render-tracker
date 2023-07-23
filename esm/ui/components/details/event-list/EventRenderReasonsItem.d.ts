import * as React from "react";
import { FiberContextChange, TransferPropChange, FiberStateChange } from "../../../types";
export declare function PropChange({ entry, warn, }: {
    entry: TransferPropChange;
    warn: boolean;
}): React.JSX.Element;
export declare function StateChange({ entry, warn, }: {
    entry: FiberStateChange;
    warn: boolean;
}): React.JSX.Element;
export declare function ContextChange({ fiberId, entry, }: {
    fiberId: number;
    entry: FiberContextChange;
}): React.JSX.Element;
