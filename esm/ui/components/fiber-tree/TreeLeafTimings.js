import React from "react";
import { formatDuration } from "../../utils/duration";
const TreeLeafTimings = ({ fiber }) => {
    const { events, selfTime, totalTime } = fiber;
    return (React.createElement("div", { className: "tree-leaf-timings" },
        React.createElement("span", { className: "tree-leaf-timings__time", title: "Self time" }, events.length > 0 ? formatDuration(selfTime) : "\xA0"),
        React.createElement("span", { className: "tree-leaf-timings__time", title: "Total time" }, events.length > 0 ? formatDuration(totalTime) : "\xA0")));
};
const TreeLeafTimingsMemo = React.memo(TreeLeafTimings);
TreeLeafTimingsMemo.displayName = "TreeLeafTimings";
export default TreeLeafTimingsMemo;
