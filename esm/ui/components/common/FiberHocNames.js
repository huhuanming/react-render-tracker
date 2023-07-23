import * as React from "react";
export default function FiberHocNames({ names }) {
    if (!names || !names.length) {
        return null;
    }
    return (React.createElement("span", { className: "fiber-hoc-names" }, names.map(name => (React.createElement("span", { key: name, className: "fiber-hoc-name", title: "High Order Component (HOC)" }, name)))));
}
