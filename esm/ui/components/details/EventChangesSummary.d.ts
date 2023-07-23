import * as React from "react";
import { FiberChanges } from "../../types";
export declare function EventChangesSummary({ changes, expanded, toggleExpanded, }: {
    changes: FiberChanges | null;
    expanded?: boolean;
    toggleExpanded?: () => void;
}): React.JSX.Element | null;
