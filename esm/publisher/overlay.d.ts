interface Rect {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}
declare type Box = {
    top: number;
    left: number;
    width: number;
    height: number;
};
declare type BoxType = "margin" | "padding" | "border";
declare type BoxSide = "top" | "right" | "bottom" | "left";
declare type BoxProperty = `${BoxType}${Capitalize<BoxSide>}`;
declare type Dimensions = {
    [key in BoxProperty]: number;
};
export declare class OverlayRect {
    node: HTMLElement;
    border: HTMLElement;
    padding: HTMLElement;
    content: HTMLElement;
    constructor(doc: Document, container: HTMLElement);
    remove(): void;
    update(box: Rect, dims: Dimensions): void;
}
declare class OverlayTip {
    el: HTMLElement;
    nameEl: HTMLElement;
    dimEl: HTMLElement;
    constructor(doc: Document, container: HTMLElement);
    remove(): void;
    updateText(name: string, width: number, height: number): void;
    updatePosition(dims: Box, bounds: Box): void;
}
declare global {
    var __REACT_DEVTOOLS_TARGET_WINDOW__: (Window & typeof globalThis) | undefined;
}
export default class Overlay {
    window: Window & typeof globalThis;
    tipBoundsWindow: Window & typeof globalThis;
    container: HTMLElement;
    tip: OverlayTip;
    rects: Array<OverlayRect>;
    constructor();
    remove(): void;
    inspect(nodes: Array<HTMLElement>, name?: string, ownerName?: string): void;
}
export declare function getOwnerWindow(node: Element): (Window & typeof globalThis) | null;
export declare function getOwnerIframe(node: Element): Element | null;
export declare function getBoundingClientRectWithBorderOffset(node: Element): Rect;
export declare function mergeRectOffsets(rects: Array<Rect>): Rect;
export {};
