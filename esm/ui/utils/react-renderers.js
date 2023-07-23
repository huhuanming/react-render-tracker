import * as React from "react";
import { remoteSubscriber } from "../rempl-subscriber";
const ReactRenderersContext = React.createContext({
    renderers: [],
    unsupportedRenderers: [],
    selected: null,
});
export const useReactRenderers = () => React.useContext(ReactRenderersContext);
export function ReactRenderersContextProvider({ children, }) {
    const [{ renderers, unsupportedRenderers }, setRenderers] = React.useState({ renderers: [], unsupportedRenderers: [] });
    const value = React.useMemo(() => ({
        renderers,
        unsupportedRenderers,
        selected: renderers[0] || null,
    }), [renderers, unsupportedRenderers]);
    React.useEffect(() => remoteSubscriber
        .ns("react-renderers")
        .subscribe(({ renderers, unsupportedRenderers }) => {
        if (renderers.length || unsupportedRenderers.length) {
            setRenderers({ renderers, unsupportedRenderers });
        }
    }), []);
    return (React.createElement(ReactRenderersContext.Provider, { value: value }, children));
}
