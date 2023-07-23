const RRT_SOURCE = __RRT_SOURCE__;
const DATA_CLIENT_SOURCE = __DATA_CLIENT_SOURCE__;
function readScriptWithExports(scriptSource) {
    const exportSymbols = [];
    const source = scriptSource.replace(/export\s*(\{(.|\s)+?\})/, (_, e) => "const api=" +
        e.replace(/([a-z]+) as ([a-z]+)/gi, (_, localName, exportName) => {
            exportSymbols.push(exportName);
            return `${exportName}:${localName}`;
        }) +
        ";return api.isReady().then(()=>api)");
    return {
        source,
        exportSymbols,
    };
}
async function initDataClient(page, module) {
    const dataClient = Object.create(null);
    const dataClientHandle = await page.evaluateHandle(new Function(module.source));
    for (const name of module.exportSymbols) {
        dataClient[name] = (...args) => dataClientHandle.evaluate((client, { name, args }) => client[name](...args), // TODO: get rid of "as any"
        { name, args });
    }
    return dataClient;
}
module.exports = async function newPageDataClient(page) {
    let pageSessionDataClient;
    const dataClientModule = readScriptWithExports(DATA_CLIENT_SOURCE);
    const addInitScript = "addInitScript" in page ? page.addInitScript : page.evaluateOnNewDocument;
    addInitScript.call(page, RRT_SOURCE);
    page.on("framenavigated", () => {
        pageSessionDataClient = initDataClient(page, dataClientModule);
    });
    const client = Object.create(null);
    for (const method of dataClientModule.exportSymbols) {
        client[method] = async (...args) => (await pageSessionDataClient)[method](...args);
    }
    return client;
};
export {};
