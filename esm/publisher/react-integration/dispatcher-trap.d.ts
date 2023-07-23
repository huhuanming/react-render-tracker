import { ReactDispatcherTrapApi, ReactInternals } from "../types";
import { CoreApi } from "./core";
export declare function createDispatcherTrap(renderer: ReactInternals, { getFiberTypeId, isFiberRoot }: CoreApi): ReactDispatcherTrapApi;
