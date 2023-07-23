import { installReactDevtoolsHook } from "./react-devtools-hook";
import { publishReactRenderer, publishReactUnsupportedRenderer, remoteCommands, } from "./rempl-publisher";
import { attach } from "./react-integration";
export const hook = installReactDevtoolsHook(window, (id, renderer) => attach(renderer, publishReactRenderer(id, renderer), remoteCommands), publishReactUnsupportedRenderer);
if (globalThis["__REACT_DEVTOOLS_GLOBAL_INTERNALS__"]) {
    hook.inject(globalThis["__REACT_DEVTOOLS_GLOBAL_INTERNALS__"], globalThis["__REACT_DEVTOOLS_GLOBAL_INTERNALS_RENDERER_ID__"]);
}
delete globalThis["__REACT_DEVTOOLS_GLOBAL_INTERNALS__"];
delete globalThis["__REACT_DEVTOOLS_GLOBAL_INTERNALS_RENDERER_ID__"];
