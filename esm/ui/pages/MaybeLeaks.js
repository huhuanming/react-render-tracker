import * as React from "react";
import { useSelectedId } from "../utils/selection";
import { useFiber, useFiberMaps, useLeakedFibers, useTypeIdFibers, } from "../utils/fiber-maps";
import Toolbar from "./maybe-leaks/Toolbar";
import { LeaksList } from "./maybe-leaks/LeaksList";
import FiberDetails from "../components/details/Details";
function MaybeLeaksPageBadge() {
    const leakedFibers = useLeakedFibers();
    return React.createElement(React.Fragment, null, leakedFibers.length || "");
}
function MaybeLeaksPage() {
    const [groupByParent, setGroupByParent] = React.useState(false);
    const [showUnmounted, setShowUnmounted] = React.useState(true);
    const [showTimings, setShowTimings] = React.useState(false);
    const { fiberById } = useFiberMaps();
    const { selectedId } = useSelectedId();
    const selectedFiber = useFiber(selectedId || -1);
    const typeFiberIds = useTypeIdFibers(selectedFiber?.typeId || -1);
    const unmountedSelectedFiber = selectedFiber &&
        !selectedFiber.mounted &&
        typeFiberIds.some(fiberId => fiberById.get(fiberId)?.leaked)
        ? selectedFiber
        : null;
    return (React.createElement("div", { className: "app-page app-page-maybe-leaks", "data-has-selected": unmountedSelectedFiber !== null || undefined },
        React.createElement(Toolbar, { onGroupingChange: setGroupByParent, groupByParent: groupByParent, onShowUnmounted: setShowUnmounted, showUnmounted: showUnmounted, onShowTimings: setShowTimings, showTimings: showTimings }),
        React.createElement("div", { className: "app-page-content-wrapper" },
            React.createElement("div", { className: "app-page-content" },
                React.createElement(LeaksList, null))),
        unmountedSelectedFiber && (React.createElement(FiberDetails, { rootId: unmountedSelectedFiber.id, groupByParent: groupByParent, showUnmounted: showUnmounted, showTimings: showTimings }))));
}
const MaybeLeaksPageBadgeMemo = React.memo(MaybeLeaksPageBadge);
MaybeLeaksPageBadgeMemo.displayName = "MaybeLeaksPageBadge";
const MaybeLeaksPageMemo = React.memo(MaybeLeaksPage);
MaybeLeaksPageMemo.displayName = "MaybeLeaksPage";
export { MaybeLeaksPageMemo as MaybeLeaksPage, MaybeLeaksPageBadgeMemo as MaybeLeaksPageBadge, };
