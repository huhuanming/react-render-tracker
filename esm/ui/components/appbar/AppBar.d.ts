import * as React from "react";
import { AppPage, AppPageConfig } from "../../pages";
declare const AppbarMemo: React.MemoExoticComponent<({ pages, page, setPage, }: {
    pages: Record<AppPage, AppPageConfig>;
    page: AppPage;
    setPage: (page: AppPage) => void;
}) => React.JSX.Element>;
export default AppbarMemo;
