var _a;
import { FeatureMemLeaks, TrackingObjectAlternate, TrackingObjectStateNode, TrackingObjectTypeName, } from "../../common/constants";
import { TrackingObjectFiber } from "../../common/constants";
const DEBUG_OUTPUT = true;
const fiberProps = [
    "alternate",
    "child",
    "sibling",
    "return",
    "current",
    "dependencies",
    "stateNode",
    "_debugOwner",
    "firstEffect",
    "lastEffect",
    "nextEffect",
    "updateQueue",
    "memoizedState",
    "memoizedProps",
    "pendingProps",
];
const stateNodeProps = ["_reactInternals", "_reactInternalInstance"];
class FakeWeakRef {
    constructor() {
        this[_a] = "WeakRef";
    }
    deref() {
        return undefined;
    }
}
_a = Symbol.toStringTag;
const WeakRefBase = typeof WeakRef === "undefined" ? FakeWeakRef : WeakRef;
export class TrackingObjectWeakRef extends WeakRefBase {
    constructor(target, fiberId, type, displayName, hookIdx = null) {
        super(target);
        this.fiberId = fiberId;
        this.type = type;
        this.displayName = displayName;
        this.hookIdx = hookIdx;
    }
    get tag() {
        return `${this.displayName || "unknown"} #${this.fiberId} (${TrackingObjectTypeName[this.type]}${this.hookIdx !== null ? " " + this.hookIdx : ""})`;
    }
    get descriptor() {
        return {
            fiberId: this.fiberId,
            type: this.type,
            hookIdx: this.hookIdx,
        };
    }
    get alive() {
        return this.deref() !== undefined;
    }
}
// the class is used for TypeScript only
class LeakedObjectsRRTMarkerTS {
    constructor(objects) {
        this.objects = objects;
    }
}
// a hack with object to keep class name the same even when code is minified
const LeakedObjectsRRTMarker = {
    LeakedObjectsRRTMarker: class {
        constructor(objects) {
            this.objects = objects;
        }
    },
}[String("LeakedObjectsRRTMarker")];
export function createUnmountedFiberLeakDetectionApi(recordEvent, roots, fiberToId) {
    const knownObjects = new WeakSet();
    const candidatesByCanary = new Set();
    const leakedObjects = new Set();
    const leaksAdded = new Set();
    const leaksRemoved = new Set();
    const lastStat = { candidates: 0, leaks: 0 };
    let newCandidates = new Set();
    let updateTimer = null;
    let debugOutputTimer = null;
    let trackingNewCandidatesTimer = null;
    const canariesRegistry = new FinalizationRegistry(candidates => {
        candidatesByCanary.delete(candidates);
        for (const candidate of candidates) {
            const target = candidate.deref();
            if (target !== undefined) {
                leaksRegistry.register(target, candidate);
                leakedObjects.add(candidate);
                leaksAdded.add(candidate);
            }
        }
        scheduleUpdate();
    });
    const leaksRegistry = new FinalizationRegistry(leak => {
        leakedObjects.delete(leak);
        if (leaksAdded.has(leak)) {
            leaksAdded.delete(leak); // added leak is not recorded yet, just remove it
        }
        else {
            leaksRemoved.add(leak);
        }
        scheduleUpdate();
    });
    function getLeakedObjectsProbe(fibersIds) {
        const fiberFilter = Array.isArray(fibersIds) ? new Set(fibersIds) : false;
        let markedLeakedObjects = new LeakedObjectsRRTMarker(Object.create(null));
        for (const weakRef of [...leakedObjects].sort((a, b) => a.tag < b.tag ? -1 : 1)) {
            const object = weakRef.deref();
            if (object !== undefined &&
                (!fiberFilter || fiberFilter.has(weakRef.fiberId))) {
                markedLeakedObjects.objects[weakRef.tag] = weakRef;
            }
        }
        return {
            get objects() {
                return markedLeakedObjects?.objects || null;
            },
            get markedObjects() {
                return markedLeakedObjects;
            },
            release() {
                markedLeakedObjects = null;
            },
        };
    }
    function debugOutput() {
        const candidates = [];
        const leaks = [...leakedObjects].map(ref => ref.tag);
        if (debugOutputTimer !== null) {
            clearTimeout(debugOutputTimer);
            debugOutputTimer = null;
        }
        for (const canaryCandidates of candidatesByCanary) {
            for (const candidate of canaryCandidates) {
                if (candidate.alive) {
                    candidates.push(candidate.tag);
                }
            }
        }
        console.log(`[React Render Tracker] Track React objects for memory leaks (candidates: ${lastStat.candidates !== candidates.length
            ? `${lastStat.candidates} → ${candidates.length}`
            : candidates.length}, leaks: ${lastStat.leaks !== leakedObjects.size
            ? `${lastStat.leaks} → ${leakedObjects.size}`
            : leakedObjects.size}):`, { candidates, leaks });
        lastStat.candidates = candidates.length;
        lastStat.leaks = leakedObjects.size;
    }
    function scheduleDebugOutput() {
        if (DEBUG_OUTPUT && debugOutputTimer === null) {
            debugOutputTimer = setTimeout(debugOutput, 10);
        }
    }
    function recordUpdate() {
        if (updateTimer !== null) {
            clearTimeout(updateTimer);
            updateTimer = null;
        }
        if (leaksAdded.size || leaksRemoved.size) {
            recordEvent({
                op: "maybe-leaks",
                commitId: -1,
                added: [...leaksAdded].map(leak => leak.descriptor),
                removed: [...leaksRemoved].map(leak => leak.descriptor),
            });
            leaksAdded.clear();
            leaksRemoved.clear();
        }
        scheduleDebugOutput();
    }
    function scheduleUpdate() {
        if (updateTimer === null) {
            updateTimer = setTimeout(recordUpdate, 100);
        }
    }
    function startTrackingNewCandidates() {
        const canary = {};
        canariesRegistry.register(canary, newCandidates);
        candidatesByCanary.add(newCandidates);
        newCandidates = new Set();
        trackingNewCandidatesTimer = null;
        scheduleDebugOutput();
    }
    function trackObjectForLeaking(target, fiberId, type, displayName = null, hookIdx = null) {
        if (!FeatureMemLeaks) {
            return;
        }
        if (knownObjects.has(target)) {
            console.warn("[React Render Tracker] An object is already tracking", {
                fiberId,
                type,
                displayName,
            });
            return;
        }
        newCandidates.add(new TrackingObjectWeakRef(target, fiberId, type, displayName, hookIdx));
        if (trackingNewCandidatesTimer === null) {
            trackingNewCandidatesTimer = setTimeout(startTrackingNewCandidates, 1000);
        }
    }
    function breakObjectRefs(object, props) {
        for (const prop of props) {
            if (object[prop]) {
                object[prop] = null;
            }
        }
    }
    function breakLeakedObjectRefsInternal(trackingTrackingWeakRefs) {
        for (const trackingObjectWeakRef of trackingTrackingWeakRefs) {
            const object = trackingObjectWeakRef.deref();
            if (object !== undefined) {
                switch (trackingObjectWeakRef.type) {
                    case TrackingObjectFiber:
                    case TrackingObjectAlternate: {
                        breakObjectRefs(object, fiberProps);
                        break;
                    }
                    case TrackingObjectStateNode: {
                        if (object instanceof HTMLElement) {
                            for (const prop of Object.getOwnPropertyNames(object)) {
                                const value = object[prop];
                                if (value !== null && typeof value === "object") {
                                    object[prop] = null;
                                }
                            }
                            object.remove();
                        }
                        breakObjectRefs(object, stateNodeProps);
                        break;
                    }
                }
            }
        }
    }
    function cleanupAliveTreeFiber(fiber) {
        if (fiber.firstEffect && !fiberToId.has(fiber.firstEffect)) {
            fiber.firstEffect = null;
        }
        if (fiber.lastEffect && !fiberToId.has(fiber.lastEffect)) {
            fiber.lastEffect = null;
        }
        if (fiber.child && !fiberToId.has(fiber.child)) {
            fiber.child = null;
        }
        if (fiber.sibling && !fiberToId.has(fiber.sibling)) {
            fiber.sibling = null;
        }
    }
    function cleanupAliveTree(root) {
        cleanupAliveTreeFiber(root);
        if (root.alternate) {
            cleanupAliveTreeFiber(root.alternate);
        }
        if (root.child) {
            cleanupAliveTree(root.child);
        }
        if (root.sibling) {
            cleanupAliveTree(root.sibling);
        }
    }
    function breakLeakedObjectRefs() {
        breakLeakedObjectRefsInternal(leakedObjects);
        for (const candidates of candidatesByCanary) {
            breakLeakedObjectRefsInternal(candidates);
        }
        for (const root of roots.values()) {
            cleanupAliveTree(root);
        }
    }
    // expose to global
    const exportToGlobalName = "LeakedObjectsRRTMarker";
    let exposedLeaksStateSubscriptions = [];
    let exposedToGlobalLeaksState = null;
    let exposedToGlobalProbe = null;
    function subscribeToExposedToGlobalLeaksState(fn) {
        const subscription = { fn };
        exposedLeaksStateSubscriptions.push(subscription);
        return () => {
            exposedLeaksStateSubscriptions = exposedLeaksStateSubscriptions.filter(item => item !== subscription);
        };
    }
    function notifyExposedToGlobalLeaksStateChange() {
        for (const { fn } of exposedLeaksStateSubscriptions) {
            fn(exposedToGlobalLeaksState);
        }
    }
    function cancelExposingLeakedObjectsToGlobalInternal() {
        const global = window;
        if (exposedToGlobalProbe !== null) {
            exposedToGlobalProbe.release();
            exposedToGlobalProbe = null;
        }
        if (exposedToGlobalLeaksState !== null) {
            delete global[exposedToGlobalLeaksState.globalName];
            exposedToGlobalLeaksState = null;
        }
    }
    function cancelExposingLeakedObjectsToGlobal() {
        if (exposedToGlobalLeaksState === null) {
            return;
        }
        cancelExposingLeakedObjectsToGlobalInternal();
        notifyExposedToGlobalLeaksStateChange();
    }
    function exposeLeakedObjectsToGlobal(fibersIds) {
        const global = window;
        const prevExposedToGlobalLeaksState = exposedToGlobalLeaksState;
        cancelExposingLeakedObjectsToGlobalInternal();
        // generate a name
        let nameIdx = 0;
        let name = exportToGlobalName;
        while (name in global) {
            nameIdx++;
            name = exportToGlobalName + nameIdx;
        }
        // generate probe
        const probe = getLeakedObjectsProbe(fibersIds);
        const objectRefsCount = Object.keys(probe.objects || {}).length;
        const fiberIds = [
            ...new Set(Object.values(probe.objects || {}).map(ref => ref.fiberId)),
        ];
        // expose to global
        if (objectRefsCount > 0) {
            global[name] = probe.markedObjects;
            exposedToGlobalProbe = probe;
            exposedToGlobalLeaksState = {
                globalName: name,
                objectRefsCount,
                fiberIds,
            };
        }
        if (exposedToGlobalLeaksState !== prevExposedToGlobalLeaksState) {
            notifyExposedToGlobalLeaksStateChange();
        }
        return exposedToGlobalLeaksState;
    }
    return {
        trackObjectForLeaking,
        getLeakedObjectsProbe,
        breakLeakedObjectRefs,
        getExposedToGlobalLeaksState: () => exposedToGlobalLeaksState,
        subscribeToExposedToGlobalLeaksState,
        exposeLeakedObjectsToGlobal,
        cancelExposingLeakedObjectsToGlobal,
    };
}
