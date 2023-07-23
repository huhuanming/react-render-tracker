import * as React from "react";
import { ElementTypeProvider, FeatureMemLeaks, } from "../../../../common/constants";
import { FiberInfoSection } from "./FiberInfoSection";
import { FiberInfoSectionContexts } from "./FiberInfoSectionContexts";
import { FiberInfoSectionConsumers } from "./FiberInfoSectionConsumers";
import { FiberInfoSectionMemoHooks } from "./FiberInfoSectionMemoHooks";
import { FiberInfoSectionProps } from "./FiberInfoSectionProps";
import { FiberInfoSectionEvents } from "./FiberInfoSectionEvents";
import { FiberInfoSectionAncestors } from "./FiberInfoSectionAncestors";
import { FiberInfoSectionLeakedHooks } from "./FiberInfoSectionLeakedHooks";
const SectionStateContext = React.createContext({});
export const useSectionStateContext = () => React.useContext(SectionStateContext);
const FiberInfo = ({ fiber, groupByParent, showUnmounted, showTimings, }) => {
    const [sectionStates, setSectionStates] = React.useState({ events: true });
    const sectionStatesContextValue = React.useMemo(() => {
        return {
            get(name) {
                return sectionStates[name] || false;
            },
            toggle(name) {
                setSectionStates({ ...sectionStates, [name]: !sectionStates[name] });
            },
        };
    }, [sectionStates]);
    return (React.createElement("div", { className: "fiber-info" },
        React.createElement(SectionStateContext.Provider, { value: sectionStatesContextValue },
            React.createElement(FiberInfoSectionAncestors, { fiber: fiber }),
            React.createElement(FiberInfoSectionProps, { fiber: fiber }),
            false && (React.createElement(FiberInfoSection, { id: "timings", header: "Timing" })),
            fiber.typeDef.contexts && React.createElement(FiberInfoSectionContexts, { fiber: fiber }),
            fiber.type === ElementTypeProvider && (React.createElement(FiberInfoSectionConsumers, { fiber: fiber, showUnmounted: showUnmounted })),
            React.createElement(FiberInfoSectionMemoHooks, { fiber: fiber }),
            FeatureMemLeaks && React.createElement(FiberInfoSectionLeakedHooks, { fiber: fiber }),
            React.createElement(FiberInfoSectionEvents, { fiber: fiber, groupByParent: groupByParent, showUnmounted: showUnmounted, showTimings: showTimings }))));
};
const FiberInfoMemo = React.memo(FiberInfo);
FiberInfoMemo.displayName = "FiberInfo";
export default FiberInfoMemo;
