import Overlay from "../overlay";
export function createHighlightApi({ getFiberIdForNative, findNativeNodesForFiberId, getDisplayNameForFiberId, }) {
    const overlay = new Overlay();
    let subscriptions = [];
    let isInspectEnabled = false;
    let hoveredFiberId = null;
    function subscribe(fn) {
        let handler = { fn };
        subscriptions.push(handler);
        return function () {
            subscriptions = subscriptions.filter(elem => elem.fn !== fn);
            handler = null;
        };
    }
    function notify() {
        for (const { fn } of subscriptions) {
            fn({
                inspecting: isInspectEnabled,
                hoveredFiberId,
            });
        }
    }
    function onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        stopInspect();
        selectFiberForNode(event.target, true);
        notify();
    }
    function onMouseEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function onPointerDown(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function onPointerOver(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.target) {
            const node = event.target;
            const fiberId = getFiberIdForNative(node, true);
            const ownerName = fiberId
                ? getDisplayNameForFiberId(fiberId) || undefined
                : undefined;
            overlay.inspect([node], undefined, ownerName);
            selectFiberForNode(node);
        }
    }
    function onPointerUp(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function selectFiberForNode(node, selected = false) {
        const fiberId = getFiberIdForNative(node, true);
        if (fiberId !== hoveredFiberId) {
            hoveredFiberId = fiberId;
            if (selected) {
                stopInspect();
            }
            else {
                notify();
            }
        }
    }
    function startHighlight(fiberId) {
        let nodes = findNativeNodesForFiberId(fiberId);
        if (!nodes || !nodes.length) {
            return;
        }
        nodes = nodes.filter(node => node.nodeType === 1);
        if (nodes.length) {
            overlay.inspect(nodes, getDisplayNameForFiberId(fiberId) || "Unknown");
        }
        else {
            overlay.remove();
        }
    }
    function stopHighlight() {
        overlay.remove();
    }
    function startInspect() {
        if (isInspectEnabled) {
            return;
        }
        window.addEventListener("click", onClick, true);
        window.addEventListener("mousedown", onMouseEvent, true);
        window.addEventListener("mouseover", onMouseEvent, true);
        window.addEventListener("mouseup", onMouseEvent, true);
        window.addEventListener("pointerdown", onPointerDown, true);
        window.addEventListener("pointerover", onPointerOver, true);
        window.addEventListener("pointerup", onPointerUp, true);
        isInspectEnabled = true;
        hoveredFiberId = null;
        notify();
    }
    function stopInspect() {
        window.removeEventListener("click", onClick, true);
        window.removeEventListener("mousedown", onMouseEvent, true);
        window.removeEventListener("mouseover", onMouseEvent, true);
        window.removeEventListener("mouseup", onMouseEvent, true);
        window.removeEventListener("pointerdown", onPointerDown, true);
        window.removeEventListener("pointerover", onPointerOver, true);
        window.removeEventListener("pointerup", onPointerUp, true);
        overlay.remove();
        isInspectEnabled = false;
        notify();
    }
    return {
        subscribe,
        startHighlight,
        stopHighlight,
        startInspect,
        stopInspect,
    };
}
