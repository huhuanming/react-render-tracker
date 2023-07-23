import * as React from "react";
import { useFiberMaps } from "../../utils/fiber-maps";
import { useSelectedId } from "../../utils/selection";
const FiberTreeKeyboardNav = React.memo(function ({ groupByParent, showUnmounted, }) {
    const { selectedId, select } = useSelectedId();
    const { selectTree } = useFiberMaps();
    const tree = selectTree(groupByParent, showUnmounted);
    const handleKeyDown = React.useCallback((event) => {
        let id;
        switch (event.code) {
            case "ArrowUp": {
                id = (tree.get(selectedId)?.prev || tree.root.lastChild)
                    ?.fiber?.id;
                break;
            }
            case "ArrowDown": {
                id = (tree.get(selectedId)?.next || tree.root.firstChild)
                    ?.fiber?.id;
                break;
            }
            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (typeof id === "number") {
            select(id);
        }
    }, [tree, selectedId, select]);
    React.useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
    return null;
});
FiberTreeKeyboardNav.displayName = "FiberTreeKeyboardNav";
export default FiberTreeKeyboardNav;
