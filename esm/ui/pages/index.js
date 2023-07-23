import { CommitsPage, CommitsPageBadge } from "./Commits";
import { FeatureCommits, FeatureMemLeaks } from "../../common/constants";
import { ComponentsTreePage } from "./ComponentsTree";
import { MaybeLeaksPage, MaybeLeaksPageBadge } from "./MaybeLeaks";
export const pages = {
    ["component-tree" /* AppPage.ComponentTree */]: {
        id: "component-tree" /* AppPage.ComponentTree */,
        title: "Component tree",
        content: ComponentsTreePage,
    },
    ["commits" /* AppPage.Commits */]: {
        id: "commits" /* AppPage.Commits */,
        title: "Commits",
        disabled: !FeatureCommits,
        content: CommitsPage,
        badge: CommitsPageBadge,
    },
    ["maybe-leaks" /* AppPage.MaybeLeaks */]: {
        id: "maybe-leaks" /* AppPage.MaybeLeaks */,
        title: "Memory leaks",
        disabled: !FeatureMemLeaks,
        content: MaybeLeaksPage,
        badge: MaybeLeaksPageBadge,
    },
};
