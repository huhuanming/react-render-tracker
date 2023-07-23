import * as React from "react";
import { useFiberMaps, useProviderConsumers } from "../../../utils/fiber-maps";
import { FiberLink } from "../FiberLink";
import { FiberInfoSection } from "./FiberInfoSection";
function byDisplayName(a, b) {
    const { displayName: displayNameA } = a[1];
    const { displayName: displayNameB } = b[1];
    return displayNameA > displayNameB ? 1 : -1;
}
function FiberByTypeList({ displayName, fibers, }) {
    const [expanded, setExpanded] = React.useState(false);
    return (React.createElement("div", { className: "fiber-info-section-consumers-type-group" },
        React.createElement("div", { className: "fiber-info-section-consumers-type-group__header" +
                (expanded
                    ? " fiber-info-section-consumers-type-group__header_expanded"
                    : ""), onClick: () => setExpanded(!expanded) },
            displayName,
            " (",
            fibers.length,
            ")"),
        expanded && (React.createElement("div", { className: "fiber-info-section-consumers-type-group__content" }, fibers.map((fiber, index) => (React.createElement("div", { key: index },
            React.createElement(FiberLink, { id: fiber.id, name: fiber.displayName }))))))));
}
export function FiberInfoSectionConsumers({ fiber, showUnmounted, }) {
    const fiberIds = useProviderConsumers(fiber.id);
    const { fiberById } = useFiberMaps();
    const fiberByType = new Map();
    let fiberCount = 0;
    for (const fiberId of fiberIds) {
        const fiber = fiberById.get(fiberId);
        const { typeId, displayName, mounted } = fiber;
        if (!showUnmounted && !mounted) {
            continue;
        }
        if (!fiberByType.has(typeId)) {
            fiberByType.set(typeId, {
                displayName,
                fibers: [],
            });
        }
        fiberByType.get(typeId)?.fibers.push(fiber);
        fiberCount++;
    }
    const consumers = [...fiberByType.entries()]
        .sort(byDisplayName)
        .map(([typeId, { displayName, fibers }]) => fibers.length === 1 ? (React.createElement("div", { key: fibers[0].typeId, className: "fiber-info-section-consumers-single-instance" +
            (!fibers[0].mounted
                ? " fiber-info-section-consumers-single-instance_unmounted"
                : "") },
        React.createElement(FiberLink, { id: fibers[0].id, name: fibers[0].displayName }))) : (React.createElement(FiberByTypeList, { key: typeId, displayName: displayName, fibers: fibers })));
    return (React.createElement(FiberInfoSection, { id: "consumers", header: fiberCount ? `Consumers (${fiberCount})` : "Consumers", emptyText: "No consumers" }, fiberCount ? consumers : null));
}
