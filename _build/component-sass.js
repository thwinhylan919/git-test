/* eslint-env node */
/* eslint-disable no-console */

"use strict";

console.time("Time taken");

const promisify = require("util").promisify,
    sassRender = promisify(require("node-sass").render),
    fs = require("fs"),
    writeFile = promisify(fs.writeFile),
    readFile = promisify(fs.readFile),
    glob = promisify(require("multi-glob").glob),
    path = require("path"),
    crypto = require("crypto"),
    isDevMode = !process.env.OBDX_IS_GRUNT;

let cacheHit = 0,
    cacheMiss = 0,
    fileCache = {}, buildProps;

const compilationTarget = [
    "../components/**/*.scss",
    "../framework/elements/**/*.scss",
    "../extensions/components/**/*.scss",
    "../lzn/**/*.scss",
    "../flows/**/*.scss"
];

if (isDevMode) {
    try {
        fileCache = JSON.parse(fs.readFileSync("./.sassCache", "utf8"));
    } catch (error) {
        if (error.code !== "ENOENT") { throw error; }
    }
}

function computeHash(fileContent) {
    return crypto.createHash("md5").update(fileContent, "utf8").digest("base64");
}

function shouldCompileSass(fileName, fileContent) {
    if (!fileCache[fileName]) {
        fileCache[fileName] = computeHash(fileContent);
    } else if (fileCache[fileName] === computeHash(fileContent)) {
        cacheHit++;

        return false;
    }

    fileCache[fileName] = computeHash(fileContent);
    cacheMiss++;

    return true;
}

function compileSass(inputFile, contents, outputFile) {
    return sassRender({
        file: inputFile,
        data: `@import "utils";$image-base-path:'${buildProps.image_resource_path}'; \n.${path.parse(outputFile).name}-container{${contents}}`,
        outputStyle: "compressed",
        includePaths: ["../framework/sass/"],
        sourceMapEmbed: isDevMode
    }).catch(err => {
        console.error(`${err.formatted} while compiling ${outputFile}`);
        process.exit(1);
    });
}

function taskDispatcher(inputFile, outputFile, grunt) {
    if (isDevMode) {
        return readFile(inputFile, "utf8").then(contents => {
            if (shouldCompileSass(inputFile, contents)) {
                return compileSass(inputFile, contents, outputFile).then(result => writeFile(outputFile, result.css, "utf8"));
            }

            return Promise.resolve();
        });
    }

    const contents = grunt.file.read(inputFile);

    return compileSass(inputFile, contents, outputFile).then(result => {
        grunt.file.write(outputFile, result.css, {
            encoding: "utf8"
        });

        grunt.verbose.writeln(`File ${outputFile} written.`);
    }).catch(error => {
        grunt.log.writeln(error);
    });

}

function collateInputOutput(files, grunt) {
    const promises = [];

    files.forEach(file => {
        if (!isDevMode) {
            promises.push(taskDispatcher(file, file.replace(/^\.\.\//, "../destInt/").replace(/\.scss$/, ".css"), grunt));
        } else {
            promises.push(taskDispatcher(file, file.replace(/\.scss$/, ".css"), grunt));
        }
    });

    return Promise.all(promises);
}

if (isDevMode) {
    buildProps = require(`./${process.argv[2] || "properties"}.json`);
    console.log("Component CSS compilation started");

    glob(compilationTarget).then(collateInputOutput).then(() => {
        fs.writeFileSync("./.sassCache", JSON.stringify(fileCache), "utf8");
        console.log(`Cache efficiency: ${((cacheHit/(cacheHit + cacheMiss))*100).toFixed(2)}% (${cacheHit}/${cacheHit + cacheMiss})`);
        console.timeEnd("Time taken");
    }).catch((error) => {
        console.error(error);
    });
}

module.exports = function(grunt, filePath) {
    buildProps = require(`./${filePath || "properties"}.json`);

    grunt.registerTask("compileSCSS", "Component CSS", function() {
        const done = this.async();

        glob(compilationTarget).then(files => {
            return collateInputOutput(files, grunt);
        }).then(() => {
            grunt.log.writeln("Task completed");
            done();
        }).catch((error) => {
            console.error(error);
        });
    });

    grunt.task.run("compileSCSS");
};