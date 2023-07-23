import * as React from "react";
import { useReactRenderers } from "../../utils/react-renderers";
const fullyFunctional = "Fully functional";
const partiallyFunctional = "Partially functional due to lack of some internals in this type of React bundle which are necessary for the full capturing of data";
const bundleTypeInfo = {
    development: { abbr: "dev", description: fullyFunctional },
    production: {
        abbr: "prod",
        description: partiallyFunctional,
    },
    profiling: { abbr: "prof", description: partiallyFunctional },
    unknown: { abbr: "unknown", description: "" },
};
export function Renderer() {
    const { selected: currentRenderer } = useReactRenderers();
    if (!currentRenderer) {
        return null;
    }
    return (React.createElement("div", { className: "renderer-info", title: `${currentRenderer.name} v${currentRenderer.version}` },
        React.createElement("span", { className: "renderer-info__type", "data-type": currentRenderer.bundleType, title: `${currentRenderer.bundleType.replace(/^./, m => m.toLocaleUpperCase())} React bundle\n\n${bundleTypeInfo[currentRenderer.bundleType].description}` }, bundleTypeInfo[currentRenderer.bundleType].abbr),
        React.createElement("span", { className: "renderer-info__name" }, currentRenderer.name),
        React.createElement("span", { className: "renderer-info__version" },
            React.createElement("span", null, currentRenderer.version))));
}
