import React from "react";
import { useSubscription } from "./subscription";
export function useTreeUpdateSubscription(tree) {
    const [state, setState] = React.useState(0);
    useSubscription(() => tree.subscribe(() => setState(state => state + 1)), [tree]);
    return state;
}
