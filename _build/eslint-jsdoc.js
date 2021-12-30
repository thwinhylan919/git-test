(async function () {
  console.time('ESLint JSDoc completed. Time taken');
  const util = require("util"),
    glob = util.promisify(require("multi-glob").glob),
    DOMParser = require('xmldom').DOMParser,
    writeFile = util.promisify(require("fs").writeFile),
    exec = util.promisify(require('child_process').exec),
    eslintJSON = require("./eslint-jsdoc.json");

  let addedComponents = new Set();

  const result = await Promise.all([
    exec("svn info -r HEAD"),
    exec(`cd ../ && svn log --xml -r ${eslintJSON.currentRevNum}:HEAD --verbose`, {
      maxBuffer: 20000 * 1024
    })
  ]);

  const xmlDoc = new DOMParser().parseFromString(result[1].stdout);

  Array.from(xmlDoc.documentElement.getElementsByTagName("path"))
    .filter(element =>
      (element.getAttribute("action") === "A" || element.getAttribute("action") === "D") &&
      element.getAttribute("kind") === "file" &&
      element.childNodes[0].data.match(/\.js$/) &&
      element.childNodes[0].data.match(/\/components\//)
    ).forEach(element => {
      const component = `../${element.childNodes[0].data.match(/components\/.*/)}`;
      if (addedComponents.has(component)) {
        addedComponents.delete(component);
      } else {
        addedComponents.add(component);
      }
    });

  addedComponents = Array.from(addedComponents);

  addedComponents = await glob(addedComponents);

  eslintJSON.jsdoc = eslintJSON.jsdoc
    .concat(Array.from(addedComponents));

  eslintJSON.currentRevNum = +(result[0].stdout.match(/Revision:\s(.*)/)[1]);
  await writeFile("eslint-jsdoc.json", JSON.stringify(eslintJSON));
  console.timeEnd('ESLint JSDoc completed. Time taken');
})();