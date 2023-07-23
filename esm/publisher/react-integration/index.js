import { createIntegrationCore } from "./core";
import { createReactDevtoolsHookHandlers } from "./devtools-hook-handlers";
import { createReactInteractionApi } from "./interaction-api";
import { createDispatcherTrap } from "./dispatcher-trap";
export function attach(renderer, recordEvent, removeCommands) {
    const integrationCore = createIntegrationCore(renderer, recordEvent);
    const dispatcherApi = createDispatcherTrap(renderer, integrationCore);
    const interactionApi = createReactInteractionApi(integrationCore);
    // const highlightApi = createHighlightApi(interactionApi);
    removeCommands({
        highlightApi: (() => undefined),
        ...integrationCore.memoryLeaksApi,
    });
    return {
        ...createReactDevtoolsHookHandlers(integrationCore, dispatcherApi, recordEvent),
        ...interactionApi,
        ...integrationCore.memoryLeaksApi,
    };
}
