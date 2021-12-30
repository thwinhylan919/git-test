(async () => {
  const promisify = require("util").promisify,
    writeFile = promisify(require("fs").writeFile),
    glob = promisify(require("multi-glob").glob),
    widgetJSON = {
      components: []
    },
    isDevMode = (process.argv[2] === "--dev" || process.argv[2] === "-D");
  const files = await glob(["../components/widgets/**/manifest.json", "../extensions/components/widgets/**/manifest.json"]);
  files.forEach(fileName => {
    try {
      widgetJSON.components.push(require(fileName));
    } catch (error) {
      throw new Error(`FATAL: Manifest missing for ${fileName}.`);
    }
  });
  await writeFile((!isDevMode ? "../dist/" : "../") + "framework/json/moduleComponents.json", JSON.stringify(widgetJSON));
  console.log("Widgets List JSON generated");
})();