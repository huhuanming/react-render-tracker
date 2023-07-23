import * as React from "react";
import FiberId from "../common/FiberId";
import FiberKey from "../common/FiberKey";
import { useFiber } from "../../utils/fiber-maps";
import { useSelectionState } from "../../utils/selection";
import { isHostType } from "../../utils/fiber";
export const Fiber = ({ fiberId, unmounted = false, }) => {
    const fiber = useFiber(fiberId);
    const { selected, select } = useSelectionState(fiberId);
    if (!fiber) {
        return null;
    }
    return (React.createElement("span", { className: "details-fiber" },
        React.createElement("span", { className: "details-fiber__name" +
                (isHostType(fiber.type) ? " details-fiber__name_host-type" : "") +
                (unmounted ? " details-fiber__name_unmounted" : "") +
                (selected
                    ? " details-fiber__name_selected"
                    : " details-fiber__name_link"), onClick: !selected ? () => select(fiberId) : undefined }, fiber.displayName),
        React.createElement(FiberId, { id: fiber.id }),
        fiber.key !== null && React.createElement(FiberKey, { fiber: fiber })));
};
