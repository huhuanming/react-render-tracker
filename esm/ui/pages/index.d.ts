/// <reference types="react" />
export declare const enum AppPage {
    ComponentTree = "component-tree",
    Commits = "commits",
    MaybeLeaks = "maybe-leaks"
}
export declare type AppPageConfig = {
    id: AppPage;
    title: string;
    disabled?: boolean;
    content: React.FunctionComponent;
    badge?: React.FunctionComponent;
};
export declare const pages: Record<AppPage, AppPageConfig>;
