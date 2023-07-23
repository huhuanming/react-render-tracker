var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _TreeNode_parent, _TreeNode_children;
import debounce from "lodash.debounce";
import { awaitNotify, notify, stopAwatingNotify, subscribe, } from "./subscription";
export function getSubtreeIds(id, childrenMap) {
    const subtree = new Set([id]);
    for (const id of subtree) {
        const children = childrenMap.get(id) || [];
        for (const childId of children) {
            subtree.add(childId);
        }
    }
    return subtree;
}
export function subscribeSubtree(id, tree, fn) {
    const subscriptions = new Map();
    const pendingAdded = new Set();
    const pendingRemoved = new Set();
    const notifyChanges = debounce(() => {
        if (pendingAdded.size === 0 && pendingRemoved.size === 0) {
            return;
        }
        const added = [...pendingAdded];
        const removed = [...pendingRemoved];
        pendingAdded.clear();
        pendingRemoved.clear();
        fn(added, removed);
    }, 1, { maxWait: 1 });
    const remove = (id) => {
        if (!subscriptions.has(id)) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { prev, unsubscribe } = subscriptions.get(id);
        subscriptions.delete(id);
        unsubscribe();
        for (const id of prev) {
            remove(id);
        }
        pendingRemoved.add(id);
        pendingAdded.delete(id);
        notifyChanges();
    };
    const add = (id) => {
        if (subscriptions.has(id)) {
            return;
        }
        const descriptor = {
            prev: new Set(tree.getOrCreate(id).children),
            unsubscribe: tree.subscribeById(id, (node) => {
                const nextSet = new Set(node.children);
                for (const id of nextSet) {
                    if (!descriptor.prev.has(id)) {
                        add(id);
                    }
                }
                for (const id of descriptor.prev) {
                    if (!nextSet.has(id)) {
                        remove(id);
                    }
                }
                descriptor.prev = nextSet;
            }),
        };
        subscriptions.set(id, descriptor);
        for (const childId of descriptor.prev) {
            add(childId);
        }
        pendingAdded.add(id);
        pendingRemoved.delete(id);
        notifyChanges();
    };
    add(id);
    notifyChanges();
    notifyChanges.flush();
    return () => {
        for (const [id] of subscriptions) {
            remove(id);
        }
        notifyChanges.flush();
        notifyChanges.cancel();
    };
}
export function findDelta(prev, next) {
    const added = [];
    const removed = [];
    for (const id of next) {
        if (!prev.has(id)) {
            added.push(id);
        }
    }
    for (const id of prev) {
        if (!next.has(id)) {
            removed.push(id);
        }
    }
}
export class Tree {
    constructor() {
        this.root = new TreeNode(0);
        this.nodes = new Map([[0, this.root]]);
        this.subscriptions = new Set();
    }
    get first() {
        return this.root;
    }
    get last() {
        return this.root.last;
    }
    getOrCreate(id) {
        let node = this.nodes.get(id);
        if (node === undefined) {
            this.nodes.set(id, (node = new TreeNode(id)));
            awaitNotify(this);
        }
        return node;
    }
    has(id) {
        return this.nodes.has(id);
    }
    get(id) {
        return this.nodes.get(id);
    }
    add(id, parentId) {
        const node = this.getOrCreate(id);
        const parent = this.getOrCreate(parentId);
        if (node !== parent) {
            node.parent = parent;
            awaitNotify(parent);
        }
        return this;
    }
    setFiber(id, fiber) {
        const node = this.nodes.get(id);
        if (node !== undefined && node.fiber !== fiber) {
            node.fiber = fiber;
            awaitNotify(this);
        }
    }
    delete(id) {
        const node = this.nodes.get(id);
        if (node === undefined) {
            return;
        }
        for (const descendant of node.descendants()) {
            this.nodes.delete(descendant.id);
            stopAwatingNotify(descendant);
            descendant.reset(true);
        }
        node.next = node.nextSkipDescendant;
        if (node.next !== null) {
            node.next.prev = node;
        }
        if (node.parent) {
            awaitNotify(node.parent);
        }
        if (id !== 0) {
            this.nodes.delete(id);
            awaitNotify(this);
            stopAwatingNotify(node);
        }
        node.reset();
    }
    subscribe(fn) {
        return subscribe(this.subscriptions, fn);
    }
    notify() {
        notify(this.subscriptions);
    }
    subscribeById(id, fn) {
        const node = this.getOrCreate(id);
        return node.subscribe(fn);
    }
    walk(fn, start = null, end = null) {
        return this.root.walk(fn, start !== null ? this.nodes.get(start) : null, end !== null ? this.nodes.get(end) : null);
    }
    walkBack(fn, start = null, end = null) {
        return this.root.walkBack(fn, start !== null ? this.nodes.get(start) : null, end !== null ? this.nodes.get(end) : null);
    }
    find(accept, start = null, roundtrip) {
        return this.root.find(accept, start !== null ? this.nodes.get(start) : null, roundtrip);
    }
    findBack(accept, start = null, roundtrip) {
        return this.root.findBack(accept, start !== null ? this.nodes.get(start) : null, roundtrip);
    }
}
export class TreeNode {
    constructor(id) {
        this.fiber = null;
        _TreeNode_parent.set(this, null);
        _TreeNode_children.set(this, null);
        this.firstChild = null;
        this.lastChild = null;
        this.prevSibling = null;
        this.nextSibling = null;
        this.prev = null;
        this.next = null;
        this.subscriptions = new Set();
        this.id = id;
    }
    subscribe(fn) {
        return subscribe(this.subscriptions, fn);
    }
    notify() {
        notify(this.subscriptions, this);
    }
    get parent() {
        return __classPrivateFieldGet(this, _TreeNode_parent, "f");
    }
    set parent(newParent) {
        if (__classPrivateFieldGet(this, _TreeNode_parent, "f") === newParent) {
            return;
        }
        if (__classPrivateFieldGet(this, _TreeNode_parent, "f") !== null) {
            const oldParent = __classPrivateFieldGet(this, _TreeNode_parent, "f");
            const nextSkipDescendant = this.nextSkipDescendant;
            if (oldParent.firstChild === this) {
                oldParent.firstChild = this.nextSibling;
            }
            if (oldParent.lastChild === this) {
                oldParent.lastChild = this.prevSibling;
            }
            if (this.prevSibling !== null) {
                this.prevSibling.nextSibling = this.nextSibling;
            }
            if (this.nextSibling !== null) {
                this.nextSibling.prevSibling = this.prevSibling;
            }
            if (this.prev !== null) {
                this.prev.next = nextSkipDescendant;
            }
            if (nextSkipDescendant !== null) {
                nextSkipDescendant.prev = this.prev;
            }
            __classPrivateFieldSet(oldParent, _TreeNode_children, null, "f");
        }
        if (newParent !== null) {
            const lastChild = newParent.lastChild;
            const prevNext = newParent.last || newParent;
            this.prevSibling = newParent.lastChild;
            newParent.lastChild = this;
            if (lastChild !== null) {
                lastChild.nextSibling = this;
            }
            else {
                newParent.firstChild = this;
            }
            if (prevNext.next !== null) {
                prevNext.next.prev = this;
            }
            this.next = prevNext.next;
            prevNext.next = this;
            this.prev = prevNext;
            __classPrivateFieldSet(newParent, _TreeNode_children, null, "f");
        }
        __classPrivateFieldSet(this, _TreeNode_parent, newParent, "f");
    }
    get last() {
        let cursor = this;
        while (cursor.lastChild !== null) {
            cursor = cursor.lastChild;
        }
        return cursor !== this ? cursor : null;
    }
    get nextSkipDescendant() {
        let cursor = this;
        while (cursor !== null) {
            if (cursor.nextSibling !== null) {
                return cursor.nextSibling;
            }
            cursor = cursor.parent;
        }
        return null;
    }
    walk(fn, start = null, end = null) {
        let cursor = start || this;
        end = end || this.last || this;
        if (cursor !== this && fn(this) === true) {
            return this;
        }
        while (cursor !== null) {
            if (fn(cursor) === true) {
                return cursor;
            }
            if (cursor === end) {
                break;
            }
            cursor = cursor.next;
        }
        return null;
    }
    walkBack(fn, start = null, end = null) {
        let cursor = start || this.last || this;
        end = end || this;
        while (cursor !== null) {
            if (fn(cursor) === true) {
                return cursor;
            }
            if (cursor === end) {
                break;
            }
            cursor = cursor.prev;
        }
        if (cursor !== this && fn(this) === true) {
            return this;
        }
        return null;
    }
    find(accept, start = null, roundtrip = true) {
        if (start !== null && roundtrip) {
            return this.walk(accept, start) || this.walk(accept, null, start);
        }
        return this.walk(accept);
    }
    findBack(accept, start = null, roundtrip = true) {
        if (start !== null && roundtrip) {
            return this.walkBack(accept, start) || this.walkBack(accept, null, start);
        }
        return this.walkBack(accept);
    }
    ancestors() {
        const ancestors = [];
        let cursor = this.parent;
        while (cursor !== null && cursor.fiber !== null) {
            ancestors.unshift(cursor);
            cursor = __classPrivateFieldGet(cursor, _TreeNode_parent, "f");
        }
        return ancestors;
    }
    descendants() {
        const subtree = [];
        this.walk(node => {
            if (node !== this) {
                subtree.push(node);
            }
        });
        return subtree;
    }
    contains(node) {
        return this.find(cursor => cursor === node);
    }
    get children() {
        if (__classPrivateFieldGet(this, _TreeNode_children, "f") !== null) {
            return __classPrivateFieldGet(this, _TreeNode_children, "f");
        }
        let cursor = this.firstChild;
        __classPrivateFieldSet(this, _TreeNode_children, [], "f");
        while (cursor !== null) {
            __classPrivateFieldGet(this, _TreeNode_children, "f").push(cursor.id);
            cursor = cursor.nextSibling;
        }
        return __classPrivateFieldGet(this, _TreeNode_children, "f");
    }
    reset(hard = false) {
        if (hard) {
            __classPrivateFieldSet(this, _TreeNode_parent, null, "f");
        }
        else {
            this.parent = null;
        }
        __classPrivateFieldSet(this, _TreeNode_children, null, "f");
        this.firstChild = null;
        this.lastChild = null;
        this.prevSibling = null;
        this.nextSibling = null;
        this.prev = null;
        this.next = null;
    }
}
_TreeNode_parent = new WeakMap(), _TreeNode_children = new WeakMap();
