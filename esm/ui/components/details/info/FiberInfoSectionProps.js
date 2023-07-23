import * as React from "react";
import { ElementTypeMemo } from "../../../../common/constants";
import { useFiber } from "../../../utils/fiber-maps";
import { ChangesMatrix } from "./ChangesMatrix";
import { FiberInfoSection } from "./FiberInfoSection";
export function FiberInfoSectionProps({ fiber }) {
    const { events = [] } = useFiber(fiber.id) || {};
    const fiberProps = new Map();
    const targetEvents = [];
    const rows = [];
    for (const fiberEvent of events) {
        const { event, changes } = fiberEvent;
        switch (event.op) {
            case "mount":
                for (const name of event.props) {
                    if (!fiberProps.has(name)) {
                        fiberProps.set(name, fiberProps.size);
                    }
                }
                break;
            case "update":
                if (changes?.props) {
                    targetEvents.push(fiberEvent);
                    for (const { name } of changes?.props) {
                        if (!fiberProps.has(name)) {
                            fiberProps.set(name, fiberProps.size);
                        }
                    }
                }
                break;
            case "update-bailout-memo":
                targetEvents.push(fiberEvent);
                break;
            case "update-bailout-scu":
                if (changes?.props) {
                    targetEvents.push(fiberEvent);
                }
                break;
        }
    }
    if (fiberProps.size > 0) {
        for (const { event, changes } of targetEvents) {
            let values = null;
            if (changes?.props) {
                values = Array.from({ length: fiberProps.size }, () => null);
                for (const change of changes?.props) {
                    values[fiberProps.get(change.name)] = change;
                }
            }
            rows.push({
                num: rows.length,
                main: event.op === "update" ? (React.createElement("span", { className: "props-update-reaction_update" }, "Update")) : event.op === "update-bailout-memo" ? (React.createElement("span", { className: "props-update-reaction_bailout" }, "React.memo() bailout")) : (React.createElement("span", { className: "props-update-reaction_bailout" }, "SCU bailout")),
                values,
            });
        }
    }
    return (React.createElement(FiberInfoSection, { id: "props", header: `${fiber.type === ElementTypeMemo
            ? "Props updates & memo"
            : "Props updates"} ${rows.length > 0 ? `(${rows.length})` : ""}`, emptyText: fiberProps.size === 0 ? "No props" : "No new props since mount" }, rows.length === 0 ? null : (React.createElement(ChangesMatrix, { key: fiber.id, mainHeader: "Reaction", headers: [...fiberProps.keys()], data: rows }))));
}
