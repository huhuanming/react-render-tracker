import * as React from "react";
import { useFiberMaps } from "../../utils/fiber-maps";
import { useFindMatchContext } from "../../utils/find-match";
import { useSelectedId } from "../../utils/selection";
import { Cancel as CancelIcon, Search as SearchIcon } from "../common/icons";
import SearchMatchesNav from "./SearchMatchesNav";
const SearchInput = React.forwardRef(({ value, setValue, groupByParent, showUnmounted }, inputRef) => {
    const { selectedId, select } = useSelectedId();
    const { match } = useFindMatchContext();
    const { selectTree } = useFiberMaps();
    const tree = selectTree(groupByParent, showUnmounted);
    const handleInput = (event) => {
        setValue(event.target.value, true);
    };
    const handleKeyDown = (event) => {
        switch (event.code) {
            case "Enter":
                let node = null;
                if (event.shiftKey) {
                    node = tree.findBack(node => node.id !== selectedId &&
                        match(node.fiber?.displayName || null) !== null, selectedId);
                }
                else {
                    node = tree.find(node => node.id !== selectedId &&
                        match(node.fiber?.displayName || null) !== null, selectedId);
                }
                if (node) {
                    select(node.id, false);
                }
                break;
            case "Escape":
                setValue("");
                break;
        }
    };
    return (React.createElement("input", { ref: inputRef, placeholder: "Find by display name", onInput: handleInput, onKeyDown: handleKeyDown, value: value }));
});
SearchInput.displayName = "SearchInput";
const ComponentSearch = ({ groupByParent, showUnmounted, }) => {
    const autoselectRef = React.useRef(false);
    const inputRef = React.useRef(null);
    const { setPattern: setContextPattern } = useFindMatchContext();
    const [pattern, setPattern] = React.useState("");
    const setValue = React.useCallback((pattern, autoselect = false) => {
        if (autoselect) {
            autoselectRef.current = true;
        }
        setContextPattern(pattern);
        setPattern(pattern);
    }, [setContextPattern, setPattern]);
    return (React.createElement("div", { className: "component-search" },
        SearchIcon,
        React.createElement(SearchInput, { ref: inputRef, value: pattern, setValue: setValue, groupByParent: groupByParent, showUnmounted: showUnmounted }),
        pattern && (React.createElement(React.Fragment, null,
            React.createElement(SearchMatchesNav, { groupByParent: groupByParent, showUnmounted: showUnmounted, autoselect: autoselectRef, pattern: pattern }),
            React.createElement("span", { className: "component-search__buttons" },
                React.createElement("button", { className: "component-search__button", onClick: () => {
                        setValue("");
                        inputRef.current?.focus();
                    } }, CancelIcon))))));
};
export default ComponentSearch;
