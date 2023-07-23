import * as React from "react";
import { useSelectedId } from "../utils/selection";
import { useCommits } from "../utils/fiber-maps";
function CommitsPageBadge() {
    const commits = useCommits();
    return React.createElement("span", null, commits.length);
}
function CommitsPage() {
    const { selectedId } = useSelectedId();
    const commits = useCommits().slice(-20).reverse();
    return (React.createElement("div", { className: "app-page app-page-commits", "data-has-selected": selectedId !== null || undefined },
        React.createElement("table", null,
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("td", null, "#"),
                    React.createElement("td", null, "Mounts"),
                    React.createElement("td", null, "Updates"),
                    React.createElement("td", null, "Unmounts"))),
            React.createElement("tbody", null, commits.map(commit => {
                const stat = commit.events.reduce((stat, event) => {
                    stat[event.op] = (stat[event.op] || 0) + 1;
                    return stat;
                }, Object.create(null));
                console.log(commit);
                return (React.createElement("tr", { key: commit.commitId },
                    React.createElement("td", null, commit.commitId),
                    React.createElement("td", null, stat.mount || ""),
                    React.createElement("td", null, stat.update || ""),
                    React.createElement("td", null, stat.unmount || "")));
            })))));
}
const CommitsPageBadgeMemo = React.memo(CommitsPageBadge);
CommitsPageBadgeMemo.displayName = "CommitsPageBadge";
const CommitsPageMemo = React.memo(CommitsPage);
CommitsPageMemo.displayName = "CommitsPage";
export { CommitsPageMemo as CommitsPage, CommitsPageBadgeMemo as CommitsPageBadge, };
