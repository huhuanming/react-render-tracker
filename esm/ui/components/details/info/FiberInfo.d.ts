import * as React from "react";
import { MessageFiber } from "../../../types";
interface IFiberInfo {
    fiber: MessageFiber;
    groupByParent: boolean;
    showUnmounted: boolean;
    showTimings: boolean;
}
interface SectionStateContext {
    toggle(name: string): void;
    get(name: string): boolean;
}
declare const SectionStateContext: React.Context<SectionStateContext>;
export declare const useSectionStateContext: () => SectionStateContext;
declare const FiberInfoMemo: React.MemoExoticComponent<({ fiber, groupByParent, showUnmounted, showTimings, }: IFiberInfo) => React.JSX.Element>;
export default FiberInfoMemo;
