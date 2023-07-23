import * as React from "react";
import { useFiberAncestors } from "../../../utils/fiber-maps";
import { FiberInfoSection } from "./FiberInfoSection";
import { Fiber } from "../Fiber";
import { useEventLog } from "../../../utils/events";
export function FiberInfoSectionAncestors({ fiber }) {
    const ancestors = useFiberAncestors(fiber.id, true);
    const events = useEventLog(fiber.id, true, true, false);
    const markers = {};
    for (const linkedEvent of events) {
        switch (linkedEvent.event.op) {
            case "mount": {
                markers.mount = new Map();
                let cursor = linkedEvent.trigger;
                while (cursor) {
                    markers.mount.set(cursor.targetId, cursor.event.op === "update" ? "update-trigger" : cursor.event.op);
                    cursor = cursor.trigger;
                }
                break;
            }
            case "update": {
                if (!markers.update) {
                    markers.update = new Map();
                }
                let cursor = linkedEvent.trigger;
                while (cursor) {
                    markers.update.set(cursor.targetId, cursor.event.op + "-trigger");
                    cursor = cursor.trigger;
                }
                const fiberEvent = linkedEvent;
                if (fiberEvent.changes?.context) {
                    for (const ctx of fiberEvent.changes?.context) {
                        if (ctx.context?.providerId) {
                            markers.update.set(ctx.context?.providerId, "update-trigger");
                        }
                    }
                }
                break;
            }
            case "unmount": {
                markers.unmount = new Map();
                let cursor = linkedEvent.trigger;
                while (cursor) {
                    markers.unmount.set(cursor.targetId, cursor.event.op === "update" ? "update-trigger" : cursor.event.op);
                    cursor = cursor.trigger;
                }
                break;
            }
        }
    }
    return (React.createElement(FiberInfoSection, { id: "ancestors", header: `Ancestors ${ancestors.length > 0 ? `(${ancestors.length})` : ""}`, emptyText: "No ancestors" }, ancestors.length === 0 ? null : (React.createElement("div", { className: "fiber-info-section-ancestors" },
        ancestors.map(ancestor => (React.createElement("div", { key: ancestor.id, className: "fiber-ancestor" },
            markers.mount && (React.createElement("span", { key: "mount-dot", className: "dot " + (markers.mount.get(ancestor.id) || "skip") })),
            markers.update && (React.createElement("span", { key: "update-dot", className: "dot " + (markers.update.get(ancestor.id) || "skip") })),
            markers.unmount && (React.createElement("span", { key: "unmount-dot", className: "dot " + (markers.unmount.get(ancestor.id) || "skip") })),
            React.createElement("span", { key: "content", className: "fiber-ancestor__content" },
                ancestor.fiber?.leaked ? (React.createElement("span", { className: "fiber-ancestor__maybe-leak", title: `Maybe memory leak` }, "MML")) : null,
                ancestor.id === fiber.ownerId ? (React.createElement("span", { className: "fiber-ancestor__owner", title: "A component which creates selected component on its render" }, "owner")) : null,
                React.createElement(Fiber, { fiberId: ancestor.id, unmounted: !ancestor.fiber?.mounted }))))),
        React.createElement("div", { key: "self", className: "fiber-ancestor fiber-ancestor__self" },
            markers.mount && React.createElement("span", { className: "dot mount" }),
            markers.update && React.createElement("span", { className: "dot update" }),
            markers.unmount && React.createElement("span", { className: "dot unmount" }),
            React.createElement("span", { className: "fiber-ancestor__content" },
                fiber.leaked ? (React.createElement("span", { className: "fiber-ancestor__maybe-leak", title: `Maybe memory leak` }, "MML")) : null,
                React.createElement(Fiber, { fiberId: fiber.id, unmounted: !fiber.mounted })))))));
}
