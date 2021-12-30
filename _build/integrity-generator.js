/* eslint-disable no-console */
/* eslint-env node */

"use strict";

const promisify = require("util").promisify,
    requirejs = require("requirejs"),
    readFile = promisify(require("fs").readFile),
    writeFile = promisify(require("fs").writeFile),
    renameFile = promisify(require("fs").rename),
    glob = promisify(require("multi-glob").glob),
    crypto = require("crypto"),
    algorithm = "sha512",
    minify = require("terser").minify;

const cordovaScriptProperties = [];

function getBuildFingerPrint() {
    return new Promise(resolve => requirejs(["../dist/build.fingerprint"], resolve));
}

function computeHash(fileContent, digest) {
    return crypto.createHash(algorithm).update(fileContent, "utf8").digest(digest || "base64");
}

function readSingleFile(fileName) {
    return readFile(fileName, "utf-8").then(fileData => `"${fileName.match(/((lzn|components|framework|extensions).*?)\.js/)[1]}":"${algorithm}-${computeHash(fileData)}"`);
}

function batchRead(array) {
    const promises = [];

    array.forEach(function(item) {
        promises.push(readSingleFile(item));
    });

    return Promise.all(promises);
}

function hashForFile(fileName, digest) {
    return readFile(fileName, "utf-8").then(fileData => computeHash(fileData, digest)).then(hash => (digest === "hex" && hash.substring(0, 20)) || hash);
}

function replaceHashes(fileContents, hashes) {
    cordovaScriptProperties.push({
        src: `framework/js/configurations/security.${hashes[3]}.js`,
        integrity: `sha512-${hashes[0]}`
    });

    cordovaScriptProperties.push({
        src: `framework/js/configurations/require-config.${hashes[4]}.js`,
        integrity: `sha512-${hashes[1]}`
    });

    return fileContents.replace(/src=['"](framework\/js\/configurations\/security)\.js['"]/, `integrity="sha512-${hashes[0]}" src="$1.${hashes[3]}.js"`)
        .replace(/src=['"](framework\/js\/configurations\/require-config)\.js['"]/, `integrity="sha512-${hashes[1]}" src="$1.${hashes[4]}.js"`)
        .replace(/data-service-worker=['"](\/sw.js)['"]/, `integrity="sha512-${hashes[2]}" data-service-worker="/sw.${hashes[5]}.js"`);
}

Promise.all([
        glob([
            "../dist/components/**/*.js",
            "../dist/lzn/*/components/**/*.js",
            "../dist/extensions/**/*.js",
            "../dist/framework/elements/**/*.js",
            "../dist/framework/js/base-models/platform/*.js",
            "../dist/framework/js/base-models/ko/formatters.js"
        ]).then(batchRead).then(hashes => hashes.join()),
        readFile("../dist/framework/js/configurations/security.js", "utf8")
    ])
    .then(values => values[1].replace(/\/\/__replace_location__/, values[0]))
    .then(result => minify(result).code)
    .then(result => writeFile("../dist/framework/js/configurations/security.js", result, "utf8"))
    .then(() => console.log("\u2713 Security file generated successfully"))
    .then(() => Promise.all([
        hashForFile("../dist/framework/js/configurations/security.js"),
        hashForFile("../dist/framework/js/configurations/require-config.js"),
        hashForFile("../dist/framework/js/workers/service-worker.js"),
        hashForFile("../dist/framework/js/configurations/security.js", "hex"),
        hashForFile("../dist/framework/js/configurations/require-config.js", "hex"),
        hashForFile("../dist/sw.js", "hex")
    ]))
    .then(hashes => {
        return readFile("../dist/index.html", "utf8")
            .then(result => replaceHashes(result, hashes))
            .then(result => writeFile("../dist/index.html", result))
            .then(() => console.log("\u2713 Integrity computed for scripts in /index.html"));
    })
    .then(() => Promise.all([
        hashForFile("../dist/framework/js/configurations/security.js", "hex").then(hash => renameFile("../dist/framework/js/configurations/security.js", `../dist/framework/js/configurations/security.${hash}.js`)),
        hashForFile("../dist/framework/js/configurations/require-config.js", "hex").then(hash => renameFile("../dist/framework/js/configurations/require-config.js", `../dist/framework/js/configurations/require-config.${hash}.js`)),
        hashForFile("../dist/sw.js", "hex").then(hash => renameFile("../dist/sw.js", `../dist/sw.${hash}.js`))
    ]))
    .then(() => getBuildFingerPrint())
    .then(buildFingerPrint => renameFile("../dist/framework/css/main.css", `../dist/framework/css/main.${buildFingerPrint.timeStamp}.css`))
    .then(() => writeFile("../dist/cordovaScriptProperties.json", JSON.stringify(cordovaScriptProperties), "utf8"))
    .then(() => console.log("\u2713 Integrity generator completed successfully"));