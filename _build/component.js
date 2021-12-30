const promisify = require("util").promisify,
  readFile = promisify(require("fs").readFile),
  writeFile = promisify(require("fs").writeFile),
  glob = promisify(require("multi-glob").glob),
  rimraf = promisify(require("rimraf")),
  path = require("path"),
  template = `
  
  define("__comp_path__", function(require){
    return require("__comp_path__/loader");
  });`

function attachTemplate(fileName, fileContent) {
  return (fileContent + template.replace(/__comp_path__/g, fileName.match(/((components|flows|framework|lzn|extensions).*)/)[1]
    .split("/").slice(0, -1).join("/")));
}

function write(fileName, fileContents) {
  return writeFile(path.join(fileName.split("/").slice(0, -2).join("/"), `${fileName.split("/").splice(-2, 1)}.js`), fileContents);
}

function transformSingleFile(fileName) {
  return readFile(fileName, "utf8")
    .then(fileContents => attachTemplate(fileName, fileContents))
    .then(transformedContents => write(fileName, transformedContents));
}

function batchTransform(files) {
  const promises = [];
  files.forEach(file => promises.push(transformSingleFile(file)));
  return Promise.all(promises);
}

function deleteFolders(folders) {
  const promiseList = [];
  folders.forEach(element => promiseList.push(rimraf(element, {})));
  return Promise.all(promiseList);
}

(async () => {
  console.time("Component generation completed in");
  const files = await glob([
    '../dist/components/**/*/loader.js',
    '../dist/flows/**/*/loader.js',
    '../dist/framework/elements/**/*/loader.js',
    '../dist/extensions/**/*/loader.js',
    '../dist/lzn/**/*/loader.js'
  ]);
  await batchTransform(files);
  await deleteFolders([
    "../dist/components/!(widgets)/*/",
    "../dist/components/widgets/*/*/",
    "../dist/framework/elements/*/*/",
    "../dist/flows/*/*/",
    "../dist/extensions/components/!(widgets)/*/",
    "../dist/extensions/components/widgets/*/*/",
    "../dist/lzn/*/components/!(widgets)/*/",
    "../dist/lzn/*/components/widgets/*/*/",
  ]);
  console.timeEnd("Component generation completed in");
})();