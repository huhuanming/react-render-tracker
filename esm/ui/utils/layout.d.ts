export declare function getOffsetParent(node: HTMLElement): HTMLElement;
export declare function getOverflowParent(node: HTMLElement): HTMLElement;
export declare function getPageOffset(element?: HTMLElement | null): {
    left: number;
    top: number;
};
export declare function getBoundingRect(element: HTMLElement | Window, relElement?: HTMLElement | null): {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
};
export declare function getViewportRect(element: HTMLElement | Window, relElement?: HTMLElement | null): {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
};
