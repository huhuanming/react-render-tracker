import * as React from "react";
import { FiberTypeName } from "../../../common/constants";
import { useFiberMaps } from "../../utils/fiber-maps";
import FiberId from "../common/FiberId";
import { ChevronUp, ChevronDown, Pin } from "../common/icons";
import { useSelectedId } from "../../utils/selection";
import { useTreeUpdateSubscription } from "../../utils/tree";
import { usePinnedId } from "../../utils/pinned";
import { FiberLink } from "./FiberLink";
import { SourceLoc } from "../common/SourceLoc";
import FiberMaybeLeak from "../common/FiberMaybeLeak";
const FiberInfoHeaderPrelude = ({ fiber, groupByParent, showUnmounted, }) => {
    const { pinnedId, pin } = usePinnedId();
    const pinned = fiber.id === pinnedId;
    return (React.createElement("div", { className: "fiber-info-header-prelude" },
        React.createElement("div", { className: "fiber-info-header-prelude__content" },
            React.createElement("span", { className: "fiber-info-header-type-badge", "data-type": "type" }, FiberTypeName[fiber.type]),
            !fiber.mounted && (React.createElement("span", { className: "fiber-info-header-type-badge" }, "Unmounted")),
            fiber.leaked ? React.createElement(FiberMaybeLeak, { leaked: fiber.leaked }) : null),
        React.createElement("span", { className: "fiber-info-header-prelude__buttons" },
            React.createElement(InstanceSwitcher, { fiberId: fiber.id, typeId: fiber.typeId, groupByParent: groupByParent, showUnmounted: showUnmounted }),
            React.createElement("button", { className: "fiber-info-header-prelude__button" + (pinned ? " selected" : ""), onClick: () => {
                    pin(!pinned ? fiber.id : 0);
                }, title: pinned ? "Unpin" : "Pin" }, Pin))));
};
function InstanceSwitcher({ fiberId, typeId, groupByParent, showUnmounted, }) {
    const { selectedId, select } = useSelectedId();
    const { pinnedId } = usePinnedId();
    const { selectTree } = useFiberMaps();
    const tree = selectTree(groupByParent, showUnmounted);
    const treeRoot = tree.getOrCreate(pinnedId);
    const selectedNode = selectedId !== null ? tree.get(selectedId) || null : null;
    const treeUpdate = useTreeUpdateSubscription(tree);
    const { index, total } = React.useMemo(() => {
        let index = 0;
        let total = 0;
        treeRoot.walk(node => {
            if (node.fiber?.typeId === typeId) {
                total++;
                if (fiberId === node.id) {
                    index = total;
                }
            }
        });
        return { index, total };
    }, [tree, treeUpdate, treeRoot, fiberId]);
    const disableButtons = total === 0 || (total === 1 && index === 1);
    return (React.createElement("div", { className: "fiber-info-instance-iterator" },
        React.createElement("span", { className: "fiber-info-instance-iterator__label" },
            index || "–",
            " / ",
            total),
        React.createElement("span", { className: "fiber-info-header-prelude__buttons" },
            React.createElement("button", { className: "fiber-info-header-prelude__button", disabled: disableButtons, onClick: () => {
                    const startNode = treeRoot === tree.root
                        ? selectedNode
                        : selectedNode !== null && treeRoot.contains(selectedNode)
                            ? selectedNode
                            : null;
                    const node = treeRoot.findBack(node => node.id !== fiberId && node.fiber?.typeId === typeId, startNode);
                    if (node !== null) {
                        select(node.id);
                    }
                } }, ChevronUp),
            React.createElement("button", { className: "fiber-info-header-prelude__button", disabled: disableButtons, onClick: () => {
                    const startNode = treeRoot === tree.root
                        ? selectedNode
                        : selectedNode !== null && treeRoot.contains(selectedNode)
                            ? selectedNode
                            : null;
                    const node = treeRoot.find(node => node.id !== fiberId && node.fiber?.typeId === typeId, startNode);
                    if (node !== null) {
                        select(node.id);
                    }
                } }, ChevronDown))));
}
function FiberInfoHeaderNotes({ fiber }) {
    const { fiberById } = useFiberMaps();
    const owner = fiberById.get(fiber?.ownerId);
    const parent = fiberById.get(fiber?.parentId);
    if (!fiber || !parent) {
        return null;
    }
    return (React.createElement("div", { className: "fiber-info-header-notes" }, parent === owner ? (React.createElement(React.Fragment, null,
        "Child of & created by",
        " ",
        React.createElement(FiberLink, { key: parent.id, id: parent.id, name: parent.displayName }))) : (React.createElement(React.Fragment, null,
        "Child of ",
        React.createElement(FiberLink, { key: parent.id, id: parent.id, name: parent.displayName }),
        ", ",
        owner ? (React.createElement(React.Fragment, null,
            "created by ",
            React.createElement(FiberLink, { key: owner.id, id: owner.id, name: owner.displayName }))) : ("no owner (created outside of render)")))));
}
export const FiberInfoHeader = ({ fiber, groupByParent, showUnmounted, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(FiberInfoHeaderPrelude, { fiber: fiber, groupByParent: groupByParent, showUnmounted: showUnmounted }),
        React.createElement("div", { className: "fiber-info-header-content" },
            fiber.displayName,
            React.createElement(FiberId, { id: fiber.id }),
            fiber.loc && (React.createElement(SourceLoc, { type: "jsx", loc: fiber.loc }, "<jsx>"))),
        React.createElement(FiberInfoHeaderNotes, { fiber: fiber })));
};
