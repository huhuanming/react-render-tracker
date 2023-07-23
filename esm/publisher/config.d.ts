declare type OpenSourceSettings = {
    pattern: string;
    projectRoot: string;
    basedir: string;
    basedirJsx: string;
};
declare let config: {
    inpage?: boolean;
    openSourceLoc?: OpenSourceSettings;
};
export default config;
