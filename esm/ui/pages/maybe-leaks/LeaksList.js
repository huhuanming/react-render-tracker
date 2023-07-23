import * as React from "react";
import { useFiberMaps, useLeakedFibers } from "../../utils/fiber-maps";
import { FiberGroup } from "./FiberGroup";
function LeaksList() {
    const leakedFibers = useLeakedFibers();
    const { fiberById } = useFiberMaps();
    if (!leakedFibers.length) {
        return (React.createElement("div", { className: "no-leaks" }, "No potential leaked components detected"));
    }
    const types = new Map();
    const typeNames = new Set();
    for (const fiberId of leakedFibers) {
        const fiber = fiberById.get(fiberId);
        if (!fiber) {
            continue;
        }
        const fibers = types.get(fiber.typeId);
        if (!fibers) {
            types.set(fiber.typeId, [fiber]);
            typeNames.add(fiber.displayName);
        }
        else {
            fibers.push(fiber);
        }
    }
    return (React.createElement(React.Fragment, null, [...types.values()]
        .sort((a, b) => (a[0].displayName < b[0].displayName ? -1 : 1))
        .map(fibers => (React.createElement(FiberGroup, { key: fibers[0].typeId, typeId: fibers[0].typeId, fibers: fibers, initExpanded: false })))));
}
const LeaksListMemo = React.memo(LeaksList);
LeaksListMemo.displayName = "LeaksList";
export { LeaksListMemo as LeaksList };
