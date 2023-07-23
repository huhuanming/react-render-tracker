import * as React from "react";
import { useSelectionHistoryState } from "../../utils/selection";
import { Back, Forward } from "../common/icons";
const SelectionHistoryNavigation = () => {
    const { hasPrev, hasNext, prev, next } = useSelectionHistoryState();
    return (React.createElement("div", { className: "selection-history-navigation" },
        React.createElement("button", { className: "selection-history-navigation__button selection-history-navigation__button_prev", disabled: !hasPrev, onClick: hasPrev ? prev : undefined }, Back),
        React.createElement("button", { className: "selection-history-navigation__button selection-history-navigation__button_next", disabled: !hasNext, onClick: hasNext ? next : undefined }, Forward)));
};
export default SelectionHistoryNavigation;
