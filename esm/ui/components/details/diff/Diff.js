import * as React from "react";
import { DiffArray } from "./DiffArray";
import { DiffObject } from "./DiffObject";
import { DiffSimple } from "./DiffSimple";
import { ShallowEqual } from "./ShallowEqual";
export function Diff({ diff, values, }) {
    return (React.createElement(React.Fragment, null,
        typeof diff === "object" ? ("keys" in diff ? (React.createElement(DiffObject, { diff: diff })) : (React.createElement(DiffArray, { diff: diff, values: values }))) : ("prev" in values && React.createElement(DiffSimple, { values: values })),
        diff === false && React.createElement(ShallowEqual, null)));
}
