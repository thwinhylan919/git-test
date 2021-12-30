const promisify = require("util").promisify;
const fs = require("fs");
const path = require("path");
const exec = promisify(require("child_process").exec);
const execSync = require("child_process").execSync;
const parseString = require("xml2js").parseString;
const write = promisify(fs.writeFile);
const read = promisify(fs.readFile);
const stat = promisify(fs.stat);

const HEAD = process.env.SVN_REVISION_1 || +currentRevision().toString().trim(),
    cacheDirectory = "./.obdx_formatterCache",
    blameMemoryCache = new Map();

// Create cache directory if it doesn't exist.
if (!fs.existsSync(cacheDirectory)) {
    console.log(`Creating the SVN Blame cache directory; HEAD is at ${HEAD}`);
    fs.mkdirSync(cacheDirectory);
} else {
    console.log(`Found SVN Blame cache directory; HEAD is at ${HEAD}`);
}

function createUpdateCache(fileName, lineNumber, fileContents) {
    let revisions = {},
        parsedFileName = parseFileName(fileName);
    if (fileContents) {
        if (fileContents.currentRevision === HEAD) {
            return parseBlameResponse(fileContents, lineNumber);
        } else {
            revisions.start = fileContents.currentRevision;
        }
    }
    return blame(fileName, revisions)
        .then(xml => xml2js(xml))
        .then(js => merge(parsedFileName, js))
        .then(js => writeFile(parsedFileName, js))
        .then(blameJSON => parseBlameResponse(blameJSON, lineNumber));
}

function merge(fileName, newerVersion) {
    let previousVersion = blameMemoryCache.get(fileName);
    if (previousVersion) {
        newerVersion.blame.target[0].entry.forEach(function (entry) {
            if (!entry.commit) {
                entry.commit = previousVersion.blame.target[0].entry.filter(function (previousEntry) {
                    return previousEntry.$["line-number"] === entry.$["line-number"];
                })[0].commit;
            }
        });
    }
    newerVersion.currentRevision = HEAD;
    return newerVersion;
}

function parseBlameResponse(blameJSON, lineNumber) {
    try {
        const entry = blameJSON.blame.target[0].entry[lineNumber - 1].commit[0];
        return {
            author: entry.author[0],
            revision: entry.$.revision
        };
    } catch (err) {
        return {
            author: "N/A",
            revision: "N/A"
        };
    }
}

function readFile(fileName) {
    if (blameMemoryCache.has(fileName)) {
        return blameMemoryCache.get(fileName);
    }
    return read(fileName, "utf8")
        .then(contentString => JSON.parse(contentString))
        .then(fileContents => {
            blameMemoryCache.set(fileName, fileContents);
            return fileContents;
        });
}

function writeFile(fileName, fileContents) {
    blameMemoryCache.set(fileName, fileContents);
    return write(fileName, JSON.stringify(fileContents)).then(() => fileContents);
}

// Performs the blame function by calling the SVN command.
function blame(fileName, revisions) {
    if (!revisions) revisions = {};
    revisions.start = revisions.start || 1;
    revisions.end = revisions.end || HEAD;
    return exec(
        `svn blame --xml ${fileName} --revision ${revisions.start}:${revisions.end}`, {
            maxBuffer: 20000 * 1024
        }).then(response => {
        if (response.stderr) console.error(stderr);
        return response.stdout;
    });
}

function currentRevision() {
    return execSync(`svn info --show-item last-changed-revision`);
}

// Returns a file name for the cache file.
function parseFileName(fileName) {
    return path.join(cacheDirectory, `.${path.parse(fileName).dir.split(/[\\\/]/).slice(-3).join("_")}_${path.basename(fileName)}_blame.json`);
}

// Converts the XML to JS object, resolves with the JS object.
function xml2js(xml) {
    return new Promise(function (resolve, reject) {
        parseString(xml, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports = function (fileName, lineNumber) {
    let parsedName = parseFileName(fileName);
    lineNumber = lineNumber || 1;
    return new Promise(function (resolve) {
        stat(parsedName).then(() => readFile(parsedName))
            .then(fileContents => createUpdateCache(fileName, lineNumber, fileContents))
            .then(resolve)
            .catch(() => {
                createUpdateCache(fileName, lineNumber)
                    .then(resolve)
                    .catch(err => {
                        resolve("N/A");
                        console.error(`Cannot commit cache for ${fileName} : `, err);
                    });
            })
    });
}