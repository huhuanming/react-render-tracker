import { MessageFiber } from "../common/consumer-types";
import { Subscriptions } from "./subscription";
export declare function getSubtreeIds(id: number, childrenMap: Map<number, number[]>): Set<number>;
export declare function subscribeSubtree(id: number, tree: Tree, fn: (added: number[], removed: number[]) => void): () => void;
export declare function findDelta(prev: Set<number>, next: Set<number>): void;
export declare class Tree {
    root: TreeNode;
    nodes: Map<number, TreeNode>;
    subscriptions: Subscriptions<() => void>;
    get first(): TreeNode;
    get last(): TreeNode | null;
    getOrCreate(id: number): TreeNode;
    has(id: number): boolean;
    get(id: number): TreeNode | undefined;
    add(id: number, parentId: number): this;
    setFiber(id: number, fiber: MessageFiber): void;
    delete(id: number): void;
    subscribe(fn: () => void): () => void;
    notify(): void;
    subscribeById(id: number, fn: TreeNodeSubscription): () => void;
    walk(fn: (node: TreeNode) => boolean | void, start?: number | null, end?: number | null): TreeNode | null;
    walkBack(fn: (node: TreeNode) => boolean | void, start?: number | null, end?: number | null): TreeNode | null;
    find(accept: (node: TreeNode) => boolean, start?: number | null, roundtrip?: boolean): TreeNode | null;
    findBack(accept: (node: TreeNode) => boolean, start?: number | null, roundtrip?: boolean): TreeNode | null;
}
declare type TreeNodeSubscription = (node: TreeNode) => void;
export declare class TreeNode {
    #private;
    id: number;
    fiber: MessageFiber | null;
    firstChild: TreeNode | null;
    lastChild: TreeNode | null;
    prevSibling: TreeNode | null;
    nextSibling: TreeNode | null;
    prev: TreeNode | null;
    next: TreeNode | null;
    subscriptions: Subscriptions<TreeNodeSubscription>;
    constructor(id: number);
    subscribe(fn: TreeNodeSubscription): () => void;
    notify(): void;
    get parent(): TreeNode | null;
    set parent(newParent: TreeNode | null);
    get last(): TreeNode | null;
    get nextSkipDescendant(): TreeNode | null;
    walk(fn: (node: TreeNode) => boolean | void, start?: TreeNode | null, end?: TreeNode | null): TreeNode | null;
    walkBack(fn: (node: TreeNode) => boolean | void, start?: TreeNode | null, end?: TreeNode | null): TreeNode | null;
    find(accept: (node: TreeNode) => boolean, start?: TreeNode | null, roundtrip?: boolean): TreeNode | null;
    findBack(accept: (node: TreeNode) => boolean, start?: TreeNode | null, roundtrip?: boolean): TreeNode | null;
    ancestors(): TreeNode[];
    descendants(): TreeNode[];
    contains(node: TreeNode): TreeNode | null;
    get children(): number[];
    reset(hard?: boolean): void;
}
export {};
