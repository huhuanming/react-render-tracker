import * as React from "react";
import { FiberMapsContextProvider } from "./utils/fiber-maps";
import { EventsContextProvider } from "./utils/events";
import { SourceLocationsContextProvider } from "./utils/source-locations";
import { OpenFileContextProvider } from "./utils/open-file";
import { SelectionContextProvider } from "./utils/selection";
import { HighlightingContextProvider } from "./utils/highlighting";
import { PinnedContextProvider } from "./utils/pinned";
import { ReactRenderersContextProvider, useReactRenderers, } from "./utils/react-renderers";
import WaitingForReady from "./components/misc/WaitingForReady";
import WaitingForRenderer from "./components/misc/WaitingForRenderer";
import AppBar from "./components/appbar/AppBar";
import StateBar from "./components/statebar/StateBar";
import StatusBar from "./components/statusbar/StatusBar";
import { pages } from "./pages";
import { MemoryLeaksContextProvider } from "./utils/memory-leaks";
function App() {
    return (React.createElement(SourceLocationsContextProvider, null,
        React.createElement(OpenFileContextProvider, null,
            React.createElement(MemoryLeaksContextProvider, null,
                React.createElement(ReactRenderersContextProvider, null,
                    React.createElement(WaitingForRenderer, null,
                        React.createElement(ReactRendererUI, null)))))));
}
function ReactRendererUI() {
    const { selected: renderer } = useReactRenderers();
    const reactRendererUI = React.useMemo(() => renderer && (React.createElement(FiberMapsContextProvider, { key: renderer.id },
        React.createElement(EventsContextProvider, { channelId: renderer.channelId },
            React.createElement(SelectionContextProvider, null,
                React.createElement(HighlightingContextProvider, null,
                    React.createElement(PinnedContextProvider, null,
                        React.createElement(Layout, null))))))), [renderer]);
    if (reactRendererUI) {
        return reactRendererUI;
    }
    return null;
}
function Layout() {
    const [page, setPage] = React.useState("component-tree" /* AppPage.ComponentTree */);
    const PageContent = pages[page].content;
    return (React.createElement("div", { className: "app" },
        React.createElement(AppBar, { pages: pages, page: page, setPage: setPage }),
        React.createElement(WaitingForReady, null,
            React.createElement(PageContent, null)),
        React.createElement(StateBar, null),
        React.createElement(StatusBar, null)));
}
export default App;
