import * as React from "react";
interface DetailsProps {
    rootId: number;
    groupByParent: boolean;
    showUnmounted: boolean;
    showTimings: boolean;
}
declare const DetailsMemo: React.MemoExoticComponent<({ rootId, groupByParent, showUnmounted, showTimings, }: DetailsProps) => React.JSX.Element>;
export default DetailsMemo;
