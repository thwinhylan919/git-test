console.time("Total Time");
const promisify = require("util").promisify,
    readFile = promisify(require("fs").readFile),
    writeFile = promisify(require("fs").writeFile),
    mkdir = promisify(require("fs").mkdir),
    glob = promisify(require("multi-glob").glob),
    requirejs = require("requirejs"),
    path = require("path"),
    outBasePath = "../dist/resources/nls/fr/";

requirejs.config({
    paths: {
        "resources": "../resources",
        "ojL10n": "./tmp/ojL10n"
    },
    nodeRequire: require
});

(async() => {
    
    try {
        await mkdir(outBasePath);
    } catch (error) {
        console.log(`Couldn't create the directory ${outBasePath}`);
        process.exit(1);
    }
    const files = await glob(["../resources/**/*.js"]);
    await batchTransform(files);
    console.log("\u2713 Resource bundles generated successfully");
    console.timeEnd("Total Time");
})();


function transformSingleFile(fileName, outFile) {
    return readFile(fileName, "utf-8")
        .then(data => data.replace(/\s*?\w+\s*\:\s*[A-z\.]+,?[^']\n/g, ""))
        .then(transformedData => writeFile(outFile, transformedData, "utf8"))
        .then(() => requirejs(outFile))
        .then(resource => JSON.stringify(resource.root))
        .then(result => `define(${result});`)
        .then(transformedResult => writeFile(outFile, transformedResult, "utf8"))
        .catch(err => {
            console.error(err);
            process.exit(1);
        })
}

function batchTransform(files) {
    var promises = [];
    files.forEach(file => {
        promises.push(transformSingleFile(file, path.join(outBasePath, path.parse(file).base)));
    });
    return Promise.all(promises);
}