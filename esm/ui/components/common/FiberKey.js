import * as React from "react";
const MAX_TEXT = 12;
const FiberKey = ({ fiber: { displayName, key } }) => {
    const value = String(key);
    return (React.createElement("span", { className: "fiber-key", title: `<${displayName} key="${value}">` }, value.length > MAX_TEXT ? value.substr(0, MAX_TEXT) + "…" : value));
};
export default FiberKey;
