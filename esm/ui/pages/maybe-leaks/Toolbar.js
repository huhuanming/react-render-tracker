import * as React from "react";
import ButtonToggle from "../../components/common/ButtonToggle";
import { useEventsContext } from "../../utils/events";
import { ToggleGrouping, ToggleUnmounted, ClearEventLog, ToggleTimings, Pause, Play, BreakRefs, ExposeToGlobal, } from "../../components/common/icons";
import { FeatureMemLeaks } from "../../../common/constants";
import { useMemoryLeaks } from "../../utils/memory-leaks";
import { useFiberMaps } from "../../utils/fiber-maps";
const Toolbar = ({ onGroupingChange, groupByParent, onShowUnmounted, showUnmounted, onShowTimings, showTimings, }) => {
    const { leakedFibers } = useFiberMaps();
    const { clearAllEvents, paused, setPaused } = useEventsContext();
    const { breakLeakedObjectRefs, exposeLeakedObjectsToGlobal } = useMemoryLeaks();
    return (React.createElement("div", { className: "toolbar" },
        React.createElement("div", { style: { flex: 1 } }),
        React.createElement("div", { className: "toolbar__buttons" },
            React.createElement("span", { className: "toolbar__buttons-splitter" }),
            React.createElement(ButtonToggle, { icon: ToggleGrouping, isActive: groupByParent, onChange: onGroupingChange, tooltip: groupByParent
                    ? "Switch to owner-ownee relationship view in component's tree"
                    : "Switch to parent-child relationship view in component's tree" }),
            React.createElement(ButtonToggle, { icon: ToggleUnmounted, isActive: showUnmounted, onChange: onShowUnmounted, tooltip: showUnmounted
                    ? "Hide unmounted components"
                    : "Show unmounted components" }),
            React.createElement(ButtonToggle, { icon: ToggleTimings, isActive: showTimings, onChange: onShowTimings, tooltip: showTimings ? "Hide timings" : "Show timings" }),
            FeatureMemLeaks && (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "toolbar__buttons-splitter" }),
                React.createElement(ButtonToggle, { icon: BreakRefs, onChange: breakLeakedObjectRefs, tooltip: "Break leaked React objects references\n\nWARNING: This action interferes with how React works, which can lead to behavior that is not possible naturally. Such interference can break the functionality of React. However, this technique allows you to localize the source of the memory leak and greatly simplify the investigation of root causes. Use with caution and for debugging purposes only." }),
                React.createElement(ButtonToggle, { icon: ExposeToGlobal, onChange: () => exposeLeakedObjectsToGlobal([...leakedFibers]), tooltip: "Store potential leaked objects as global variable.\n\nThis allows to investigate retainers in a heap snapshot." }))),
            React.createElement("span", { className: "toolbar__buttons-splitter" }),
            React.createElement(ButtonToggle, { icon: ClearEventLog, onChange: clearAllEvents, tooltip: "Clear event log" }),
            React.createElement(ButtonToggle, { icon: !paused ? Play : Pause, isActive: !paused, onChange: () => setPaused(!paused), tooltip: paused ? "Resume event loading" : "Pause event loading" }))));
};
const ToolbarMemo = React.memo(Toolbar);
ToolbarMemo.displayName = "Toolbar";
export default ToolbarMemo;
