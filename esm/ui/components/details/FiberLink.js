import * as React from "react";
import { useSelectionState } from "../../utils/selection";
import FiberId from "../common/FiberId";
export function FiberLink({ id, name }) {
    const { selected, select } = useSelectionState(id);
    return (React.createElement("span", { className: "details-fiber-link" },
        React.createElement("span", { className: "details-fiber-link__name", onClick: !selected ? () => select(id) : undefined }, name || "Unknown"),
        React.createElement(FiberId, { id: id })));
}
