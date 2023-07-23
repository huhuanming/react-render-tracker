import * as React from "react";
export function DiffSimple({ values }) {
    return (React.createElement("span", null,
        React.createElement("code", { className: "diff-value removed" }, values.prev),
        "\u00A0\u2192\u00A0",
        React.createElement("code", { className: "diff-value" }, values.next)));
}
