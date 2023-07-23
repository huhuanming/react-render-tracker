import * as React from "react";
import FiberInfo from "./info/FiberInfo";
import { FiberInfoHeader } from "./FiberHeader";
import { useFiber } from "../../utils/fiber-maps";
const Details = ({ rootId, groupByParent = false, showUnmounted = true, showTimings = false, }) => {
    const [scrolled, setScrolled] = React.useState(false);
    const fiber = useFiber(rootId);
    if (fiber === undefined) {
        return (React.createElement("div", { className: "details" },
            React.createElement("div", { className: "fiber-info" },
                "Fiber with #",
                rootId,
                " is not found"),
            ";"));
    }
    return (React.createElement("div", { className: "details" },
        React.createElement("div", { className: "details__header" +
                (scrolled ? " details__header_content-scrolled" : "") },
            React.createElement(FiberInfoHeader, { fiber: fiber, groupByParent: groupByParent, showUnmounted: showUnmounted })),
        React.createElement("div", { className: "details__content", onScroll: e => setScrolled(e.target.scrollTop > 0) },
            React.createElement(FiberInfo, { fiber: fiber, groupByParent: groupByParent, showUnmounted: showUnmounted, showTimings: showTimings }))));
};
const DetailsMemo = React.memo(Details);
DetailsMemo.displayName = "Details";
export default DetailsMemo;
