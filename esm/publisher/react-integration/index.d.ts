import { ReactInternals, ReactIntegrationApi, RecordEventHandler, RemoteCommandsApi } from "../types";
export declare function attach(renderer: ReactInternals, recordEvent: RecordEventHandler, removeCommands: (api: RemoteCommandsApi) => void): ReactIntegrationApi;
