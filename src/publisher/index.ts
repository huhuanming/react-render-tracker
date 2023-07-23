// import { getHost } from "rempl";
// import config from "./config";
import { installReactDevtoolsHook } from "./react-devtools-hook";
import {
  publishReactRenderer,
  publishReactUnsupportedRenderer,
  remoteCommands,
} from "./rempl-publisher";
import { attach } from "./react-integration";

export const hook = installReactDevtoolsHook(
  window,
  (id, renderer) =>
    attach(renderer, publishReactRenderer(id, renderer), remoteCommands),
  publishReactUnsupportedRenderer
);

if ((globalThis as any)["__REACT_DEVTOOLS_GLOBAL_INTERNALS__"]) {
  hook.inject(
    (globalThis as any)["__REACT_DEVTOOLS_GLOBAL_INTERNALS__"],
    (globalThis as any)["__REACT_DEVTOOLS_GLOBAL_INTERNALS_RENDERER_ID__"]
  );
}
delete (globalThis as any)["__REACT_DEVTOOLS_GLOBAL_INTERNALS__"];
delete (globalThis as any)["__REACT_DEVTOOLS_GLOBAL_INTERNALS_RENDERER_ID__"];
// if (config.inpage) {
//   getHost().activate();
// }
