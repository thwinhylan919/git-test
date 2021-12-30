console.time("Total time");

const fs = require("fs");
const chalk = require("chalk");

if (!fs.existsSync("./tmp/knockout-min.js")) {
    console.error(chalk.yellow("Library knockout not found!"));
    console.error(`${chalk.yellow("Did you forget to run the download libraries task? If so, run now")} > ${chalk.green("node download-lib.js")}`);
    process.exit(1);
}

const Regex = require("./regex-list"),
    ko = require("./tmp/knockout-min.js");
const exclusionArray = require("./preBuildChecksProps").fileNameExclusionArray;
const cheerio = require("cheerio");
const requirejs = require("requirejs");
const parse = require("path").parse;
const readFile = require("fs").readFile,
    writeFile = require("fs").writeFile,
    glob = require("multi-glob").glob,
    tokenize = require("esprima").tokenize;
const Typo = require("typo-js");
const dictionary = new Typo("en_US", null, null, {
        dictionaryPath: "dictionaries"
    }),
    cacheFileName = "./.obdx_preBuildCache",
    workbenchGeneratedFilesLocal = "../uiworkbench.files",
    svnInfo = require("./svn-info");
const crypto = require("crypto");
const Ajv = require("ajv");
const widgetManifestValidator = (new Ajv()).compile(require("./widget-manifest-schema.json"));

let fileCache = {};

try {
    fileCache = JSON.parse(fs.readFileSync(cacheFileName, "utf8"));
} catch (error) {
    if (error.code !== "ENOENT") {
        throw error;
    }
}

let workbenchGeneratedFiles = [];

try {
    workbenchGeneratedFiles = JSON.parse(fs.readFileSync(workbenchGeneratedFilesLocal, "utf8"));
} catch (error) {
    if (error.code !== "ENOENT") {
        console.log(error.code);
        //throw error;
    }
}

function consoleTime(label, trigger) {
    if (isVerbose) {
        console[trigger](label);
    }
}

function computeHash(fileContent) {
    return crypto.createHash(digest).update(fileContent, "utf8").digest("base64");
}

function escapeRegExp(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

let defaultFileObj = {
        resourceBundles: [
            "../resources/**/*.js",
            "../extensions/resources/**/*.js",
            "../lzn/*/resources/**/*.js"
        ],
        bindings: [
            "../framework/elements/**/*.js",
            "../components/**/*.js",
            "../flows/**/*.js",
            "../extensions/**/*.js",
            "../lzn/*/components/**/*.js"
        ],
        html: [
            "../framework/elements/**/*.html",
            "../components/**/*.html",
            "../flows/**/*.html",
            "../extensions/**/*.html",
            "../partials/**/*.html",
            "../lzn/*/components/**/*.html",
            "../lzn/*/partials/**/*.html"
        ],
        css: [
            "../components/**/*.css",
            "../flows/**/*.css",
            "../lzn/**/*.css",
            "../extensions/**/*.css"
        ],
        scss: [
            "../components/**/*.scss",
            "../flows/**/*.scss",
            "../lzn/**/*.scss",
            "../extensions/**/*.scss",
            "../framework/sass/**/*.scss"
        ]
    },
    errorEncountered = false,
    errors = {},
    ignoredErrors = new Set(),
    isVerbose = false,
    isPrecommitHook = false,
    isDevMode = !process.env.OBDX_IS_GRUNT,
    incrementalRunFileListLoc = null,
    ignoreCache = false,
    cacheHit = 0,
    cacheMiss = 0,
    digest = "md5",
    peekIgnoredMessagesCount = 3,
    currentRegexListHash = computeHash(fs.readFileSync("./regex-list.js", "utf8")),
    currentPreBuildChecksFileHash = computeHash(fs.readFileSync("./preBuildChecks.js", "utf8")),
    ignoreLinterErrors = !!(process.env.OBDX_IGNORE_LINTER_ERRORS === "true"),
    ignoreLinterBlame = !!(process.env.OBDX_LINTER_BLAME === "disable");

process.argv.forEach(val => {
    if (val === "--verbose" || val === "-v") {
        isVerbose = true;
    }

    if (val === "--precommit") {
        isPrecommitHook = true;
        incrementalRunFileListLoc = process.argv[2];
    }

    if (val === "--ignoreCache") {
        ignoreCache = true;
    }

    if (val.match(/--digest=([^\s]*)/)) {
        digest = val.match(/--digest=([^\s]*)/)[1].trim();
    }
});

if (isPrecommitHook) {
    readFile(incrementalRunFileListLoc, "utf8", function(err, data) {
        if (err) {
            throw err;
        }

        fileDispatcher(data.trim().split("\n"));
    });
} else {
    runChecks(defaultFileObj);
}

function fileDispatcher(files) {
    const fileObj = {
        resourceBundles: [],
        bindingsHTML: [],
        scss: []
    };

    files.forEach(function(fileName) {
        if (fileName.match("/resources/")) {
            fileObj.resourceBundles.push(fileName);
        }

        if (
            fileName.match("/framework/elements/") ||
            fileName.match("/components/") ||
            fileName.match("/partials/") ||
            fileName.match("/extensions/")) {
            fileObj.bindingsHTML.push(fileName);
        }

        if (fileName.match(".scss")) {
            fileObj.scss.push(fileName);
        }
    });

    runChecks(fileObj);
}

function shouldCheckFile(fileName, fileContent) {
    if (fileCache.regexListHash === currentRegexListHash && fileCache.preBuildFileHash === currentPreBuildChecksFileHash) {
        if (!ignoreCache) {
            if (!fileCache[fileName]) {
                fileCache[fileName] = {
                    hasErrors: true,
                    hash: computeHash(fileContent)
                };
            }

            if (fileCache[fileName].hash === computeHash(fileContent) && fileCache[fileName].hasErrors === false) {
                cacheHit++;

                return false;
            }

            fileCache[fileName].hash = computeHash(fileContent);
            fileCache[fileName].hasErrors = false;
        } else {
            fileCache = {};
        }
    }

    cacheMiss++;

    return true;
}

function commitCache(cb) {
    fileCache.regexListHash = computeHash(fs.readFileSync("./regex-list.js", "utf8"));
    fileCache.preBuildFileHash = computeHash(fs.readFileSync("./preBuildChecks.js", "utf8"));
    writeFile(cacheFileName, JSON.stringify(fileCache), "utf8", cb);
}


const duplicates = array => {
    const dict = array.reduce((a, b) => ({
        ...a,
        [b]: (a[b] || 0) + 1
    }), {});
    return Object.keys(dict).filter(a => dict[a] > 1)
}

const pluralize = (count, string, separator) => (string.split(separator || "/")[Math.ceil((count - 1) / count)]) || "";

function genericChecks(fileObj) {
    consoleTime("genericChecks", "time");
    const promises = [];
    if (!ignoreLinterBlame) {
        promises.push(
            new Promise(resolve => {
                svnInfo(workbenchGeneratedFiles)
                    .then(filesInfo => filesInfo.filter(fileInfo => fileInfo.exists))
                    .then(files => files.forEach(fileInfo => reporter("", fileInfo.fileName, null, "UI Workbench generated files found in SVN version history. %s deleted:\n", [])))
                    .then(resolve);
            })
        );
    }
    promises.push(
        new Promise((resolve, reject) => {
            glob(fileObj.resourceBundles.concat(fileObj.bindings).concat(fileObj.html), function(err, fileNames) {
                if (err) reject(err);
                fileNames
                    .map(fileName => fileName.replace(/^\.\.\//, ""))
                    .filter(fileName => !workbenchGeneratedFiles.includes(fileName))
                    .forEach(fileName => {
                        if (parse(fileName).name.match(Regex.INVALID_FILE_NAME_PATTERN)) {
                            reporter(fileName, fileName, null,
                                "Invalid characters found in file name. %s deleted:\n", [Regex.INVALID_FILE_NAME_PATTERN]);
                        }

                        if (parse(fileName).name.split("-").length) {
                            parse(fileName).name.split("-").forEach(element => {
                                if (!dictionary.check(element)) {
                                    if (exclusionArray.indexOf(element) === -1) {
                                        reporter(fileName, fileName, null,
                                            "Name of the file contains non dictionary words. %s deleted:\n", element);
                                    }
                                }
                            });
                        }
                    });
                resolve();
            });
        })
    );
    promises.push(
        new Promise((resolve, reject) => {
            glob(["../components/**/loader.js"], function(err, componentNames) {
                if (err) reject(err);
                componentNames = componentNames.map(fileName => parse(fileName).dir.split("/").pop());
                const nameConflictComponents = duplicates(componentNames);
                nameConflictComponents.forEach(componentName => reporter("", componentName, null,
                    "More than one component with same name found. Consider refactoring the component name. %s deleted:\n", [], "warn"));
                resolve();
            });
        })
    );
    promises.push(
        new Promise((resolve, reject) => {
            glob(["../components/**/hooks.js"], function(err, hookFiles) {
                if (err) reject(err);
                hookFiles.forEach(file => reporter("", file, null,
                    "Toolkit generated component found. %s deleted:\n", [], "warn"));
                resolve();
            });
        })
    );
    promises.push(
        new Promise((resolve, reject) => {
            glob(["../components/widgets/**/manifest.json"], function(err, widgetManifests) {
                if (err) reject(err);
                const designDashboardComponentNames = requirejs("../resources/nls/design-dashboard-component-name.js")
                widgetManifests.forEach(widgetManifest => {
                    const [, , , widgetModule, widgetName] = parse(widgetManifest).dir.split("/");
                    const widgetString = designDashboardComponentNames.root.names[widgetModule] && designDashboardComponentNames.root.names[widgetModule][widgetName];
                    if (!widgetString) reporter("", parse(widgetManifest).dir, null, "Widget name not specified in 'design-dashboard-component-name.js'. %s deleted:\n", []);
                });
                const existingWidgetNames = widgetManifests.map(manifest => {
                    return {
                        name: parse(manifest).dir.split("/").pop(),
                        fullPath: parse(manifest).dir
                    }
                });
                const widgetUIAuthJSON = require("../components/widgets/META-INF/UIAuthorization.json");
                let authWidgetNames = [];
                widgetUIAuthJSON.subCategories.forEach(category => category.entitlements.forEach(entitlement => authWidgetNames.push(entitlement.widget)));
                existingWidgetNames.forEach(existingWidget => {
                    if (!authWidgetNames.includes(existingWidget.name)) reporter("", existingWidget.fullPath, null, "Widget name not specified in 'META-INF/UIAuthorization.json'. %s deleted:\n", []);
                });
                resolve();
            });
        })
    );
    promises.push(
        new Promise((resolve, reject) => {
            glob(["../components/widgets/**/manifest.json"], function(err, widgetManifests) {
                if (err) reject(err);

                batchRead(widgetManifests, function(err, fileName, data) {
                    if (err) reject(err);
                    const valid = widgetManifestValidator(JSON.parse(data));
                    if (!valid) {
                        reporter("", fileName, null, "Widget JSON not according to manifest declared at '_build/widget-manifest-schema.json'. %s deleted:\n", widgetManifestValidator.errors.reduce((acc, current) => acc += `${current.message}\t`, ""));
                    }
                }).then(function() {
                    resolve();
                }).catch(function(err) {
                    throw (err);
                });
            });
        })
    );
    return Promise.all(promises);
}

function checkResourceBundles(files) {
    consoleTime("checkResourceBundles", "time");

    return new Promise(function(resolve, reject) {
        glob(files, function(err, files) {
            if (err) {
                throw err;
            }

            batchRead(files, function(err, fileName, data) {
                if (shouldCheckFile(fileName, data)) {
                    let array;

                    try {
                        array = tokenize(data);
                    } catch (err) {
                        console.log(err.description + "\tat:" + err.lineNumber);
                        console.log("Incorrect file:", fileName);
                        process.exit(1);
                    }

                    if (fileName !== "../resources/nls/data-types.js" && fileName !== "../resources/nls/obdx-locale.js" && fileName !== "../resources/nls/world-countries.js") {
                        const stringValues = array.filter(function(object, index) {
                                return object.type === "String" && array[index - 1].type === "Punctuator" && array[index - 1].value === ":";
                            }),
                            count = stringValues.length;

                        stringValues.forEach(function(element) {
                            const value = element.value.substr(1, element.value.length - 2);

                            if (value.indexOf("<span") === -1 && value.indexOf("<div") === -1 && value.indexOf("<a ") === -1 && value.indexOf("<br") === -1 && value.indexOf("<ul") === -1 && value.indexOf("<li") === -1 && value.indexOf("<ol") === -1) {
                                const words = value.replace(/\\n/g, " ").split(/[\s\,\.\!\&\"\-\<\>\\\?\(\)\:\/\%\=\@\©\|\[\]\*\$\+\~\#\;\_]/);

                                words.forEach(function(word) {
                                    if ((word.indexOf("{") === 0)) {
                                        return;
                                    }

                                    if ((word.indexOf("'") === 0)) {
                                        word = word.substr(1);
                                    }

                                    if ((word.indexOf("'") === word.length - 1)) {
                                        word = word.substr(0, word.length - 1);
                                    }

                                    if (!isNaN(parseFloat(word))) {

                                    } else if (!dictionary.check(word)) {
                                        reporter(word, fileName, null, "Resource bundle values have incorrect spellings. %s will be deleted:\n", word);
                                    }
                                });
                            } else {
                                //Markup found. Have to check is it required?
                            }
                        });

                        if (count > 150) {
                            if (!fileName.match(/(menu)|(theme-labels)|(transactions)|(latest-pending-approvals)|(design-dashboard-component-name)/)) {
                                reporter(data, "Count:\t" + count + "\t\t" + fileName, null, "More than 100 keys found for resource bundles. %s will be deleted:\n", []);
                            }
                        }
                    }

                    if (data && data.match(Regex.STRING_ONLY_SPACES)) {
                        reporter(data, fileName, "STRING_ONLY_SPACES",
                            "String contains only spaces. %s deleted:\n", [Regex.STRING_ONLY_SPACES]);
                    }

                    if (data && data.match(Regex.RB_INVALID_VALUE)) {
                        reporter(data, fileName, "RB_INVALID_VALUE",
                            "Wrong key values are used in resource bundle. %s deleted:\n", [Regex.RB_INVALID_VALUE]);
                    }

                    if (data && data.match(Regex.RB_END_WITH_SPACE)) {
                        reporter(data, fileName, "RB_END_WITH_SPACE",
                            "Resource bundle key found with trailing space. %s deleted:\n", [Regex.RB_END_WITH_SPACE]);
                    }

                    if (data && data.match(Regex.RB_START_WITH_SPACE)) {
                        reporter(data, fileName, "RB_START_WITH_SPACE",
                            "Resource bundle key found with starting space. %s deleted:\n", [Regex.RB_START_WITH_SPACE]);
                    }

                    if (data && data.match(Regex.RB_INVALID_DATA_BIND)) {
                        reporter(data, fileName, "RB_INVALID_DATA_BIND",
                            "data-bind used in resource bundle. %s deleted:\n", [Regex.RB_INVALID_DATA_BIND]);
                    }

                    if (data && data.match(Regex.RB_INVALID_IMPORT)) {
                        reporter(data, fileName, "RB_INVALID_IMPORT",
                            "Always import resource bundle by ojL10N. %s deleted:\n", [Regex.RB_INVALID_IMPORT]);
                    }
                }
            }).then(function() {
                resolve("Done");
                consoleTime("checkResourceBundles", "timeEnd");
            }).catch(function(err) {
                throw (err);
            });
        });
    });
}

function checkBindings(files) {
    consoleTime("checkBindings", "time");

    return new Promise(function(resolve, reject) {
        glob(files, function(err, files) {
            if (err) {
                throw err;
            }

            batchRead(files, function(err, fileName, data) {
                if (shouldCheckFile(fileName, data)) {
                    if (data) {
                        if (fileName.match(/model\.js$/)) {
                            let dependencies;

                            try {
                                dependencies = data.match(/[^\]]*/gi)[0].split("[")[1].replace(/(\r\n|\n|\r)/gm, "").split(",");
                            } catch (error) {
                                reporter(data, fileName, null,
                                    "Model violation encountered. %s deleted:\n", [], "warn");

                                return;
                            }

                            for (let length = dependencies.length, i = length; i--;) {
                                if (dependencies[i].match(/jquery/) || dependencies[i].match(/baseService/)) {
                                    continue;
                                } else {
                                    reporter(data, fileName, null,
                                        "Model violation encountered. %s deleted:\n", [], "warn");
                                }
                            }

                            if (data.match(Regex.MODEL_URL_SINGLE_STRING)) {
                                reporter(data, fileName, "MODEL_URL_SINGLE_STRING",
                                    "URL parameter should be a single string without concatenation. %s deleted:\n", [Regex.MODEL_URL_SINGLE_STRING], "warn");
                            }

                            if (data.match(Regex.MODEL_URL_NO_STRING)) {
                                reporter(data, fileName, "MODEL_URL_NO_STRING",
                                    "URL parameter should be a string value. %s deleted:\n", [Regex.MODEL_URL_NO_STRING], "warn");
                            }
                        }

                        if (data.match(Regex.STRING_ONLY_SPACES)) {
                            reporter(data, fileName, "STRING_ONLY_SPACES",
                                "String contains only spaces. %s deleted:\n", [Regex.STRING_ONLY_SPACES]);
                        }

                        if (data.match(Regex.HASHCHANGE_BINDINGS)) {
                            reporter(data, fileName, "HASHCHANGE_BINDINGS",
                                "File contains hashchange event handler which is deprecated. %s deleted:\n", [Regex.HASHCHANGE_BINDINGS]);
                        }

                        if (fileName.includes("/widgets/") && data.match(Regex.WIDGET_HEADER_NAME)) {
                            reporter(data, fileName, "WIDGET_HEADER_NAME",
                                "headerName set in widget component. %s deleted:\n", [Regex.WIDGET_HEADER_NAME], "warn");
                        }

                        if (data.match(Regex.DEPRECATED_METHODS)) {
                            reporter(data, fileName, "DEPRECATED_METHODS",
                                "Deprecated Method used. %s deleted:\n", [Regex.DEPRECATED_METHODS]);
                        }

                        if (data.match(Regex.ILLEGAL_FORMATTER_USAGE_BINDINGS)) {
                            reporter(data, fileName, "ILLEGAL_FORMATTER_USAGE_BINDINGS",
                                "Formatting function used in bindings. %s deleted:\n", [Regex.ILLEGAL_FORMATTER_USAGE_BINDINGS]);
                        }

                        if (data.match(Regex.NEW_DATE)) {
                            reporter(data, fileName, "NEW_DATE",
                                "new Date Statement was found. File will be deleted:\n", [Regex.NEW_DATE]);
                        }

                        if (data.match(Regex.DIGX_IN_COMPONENT)) {
                            reporter(data, fileName, "DIGX_IN_COMPONENT",
                                "/digx found in component. %s deleted:\n", [Regex.DIGX_IN_COMPONENT]);
                        }

                        if (data.match(Regex.INVALID_CONSTANT_COMPARISON)) {
                            reporter(data, fileName, "INVALID_CONSTANT_COMPARISON",
                                "Illegal comparison done with resource bundle string. %s deleted:\n", [Regex.INVALID_CONSTANT_COMPARISON]);
                        }

                        if (data.match(Regex.KO_MAPPING)) {
                            reporter(data, fileName, "KO_MAPPING",
                                "__ko_mapping__ used. %s deleted:\n", [Regex.KO_MAPPING]);
                        }

                        if (data.match(Regex.LOCALE_STRING)) {
                            reporter(data, fileName, "LOCALE_STRING",
                                "Illegal usage of toLocaleDateString, toLocaleTimeString or toLocaleString. %s deleted:\n", [Regex.LOCALE_STRING]);
                        }

                        if (data.match(Regex.SPLIT_BY_T)) {
                            reporter(data, fileName, "SPLIT_BY_T",
                                "Illegal usage of split(\"T\") to manipulate time. %s deleted:\n", [Regex.SPLIT_BY_T]);
                        }

                        if (data.match(Regex.DELETE_ON_KEY)) {
                            reporter(data, fileName, "DELETE_ON_KEY",
                                "delete used on object key. %s deleted:\n", [Regex.DELETE_ON_KEY]);
                        }

                        if (data.match(Regex.HEADER_NAME) || data.match(Regex.HARDCODED_MESSAGES) || data.match(Regex.HARDCODED_HEADER_TEXT)) {
                            reporter(data, fileName,
                                "Hardcoded label found. %s deleted:\n", [Regex.HEADER_NAME, Regex.HARDCODED_MESSAGES, Regex.HARDCODED_HEADER_TEXT]);
                        }

                        if (data.match(Regex.SELF_PASSED_AS_PARAMS)) {
                            reporter(data, fileName, "SELF_PASSED_AS_PARAMS",
                                "Context is passed as params. %s deleted:\n", [Regex.SELF_PASSED_AS_PARAMS]);
                        }

                        if (data.match(Regex.SELF_PARAMS)) {
                            if (!fileName.match(/components\/approvals\/transaction\-detail\/transaction-detail\.js/)) {
                                reporter(data, fileName, "SELF_PARAMS",
                                    "params variable is modified. %s deleted:\n", [Regex.SELF_PARAMS]);
                            }
                        }

                        if (data.match(Regex.IS_STRING_REGEX)) {
                            const strings = data.match(Regex.IS_STRING_REGEX);

                            strings.forEach(function(value) {
                                const match = value.slice(1, -1).match(Regex.TITLE_CASE);

                                if (match) {
                                    reporter(data, fileName, null,
                                        "Potentially hardcoded string found. %s deleted:\n", match[0]);
                                }
                            });
                        }
                    }
                }
            }).then(function() {
                resolve("Done");
                consoleTime("checkBindings", "timeEnd");
            }).catch(function(err) {
                throw (err);
            });
        });
    });
}

function checkCSS(files) {
    consoleTime("checkCSS", "time");

    return new Promise(function(resolve, reject) {
        glob(files, function(err, files) {
            if (err) {
                throw err;
            }

            if (files.length) {
                files.forEach(file => {
                    reporter(file, file, null,
                        "CSS file checked in. %s deleted:\n", []);
                });
            }

            resolve("Done");
            consoleTime("checkCSS", "timeEnd");
        });
    });
}

function checkSCSS(files) {
    consoleTime("checkSCSS", "time");

    return new Promise(function(resolve, reject) {
        glob(files, function(err, files) {
            if (err) {
                throw err;
            }

            batchRead(files, function(err, fileName, data) {
                if (shouldCheckFile(fileName, data)) {
                    if (data) {
                        if (data.match(Regex.LEFT_RIGHT)) {
                            reporter(data, fileName, "LEFT_RIGHT",
                                "Left or right property qualifier found. %s deleted:\n", [Regex.LEFT_RIGHT]);
                        }

                        if (data.match(Regex.TEXT_ALIGN)) {
                            reporter(data, fileName, "TEXT_ALIGN",
                                "Text align left/right found. %s deleted:\n", [Regex.TEXT_ALIGN]);
                        }

                        if (data.match(Regex.PROP_LEFT_RIGHT) && !fileName.match(/sass\/_base\/_animations/)) {
                            reporter(data, fileName, "PROP_LEFT_RIGHT",
                                "Property left/right found. %s deleted:\n", [Regex.PROP_LEFT_RIGHT]);
                        }

                        if (data.match(Regex.HARD_CODED_COLORS)) {
                            reporter(data, fileName, "HARD_CODED_COLORS",
                                "Hardcoded colors are found. %s deleted:\n", [Regex.HARD_CODED_COLORS]);
                        }

                        if (data.match(Regex.HARD_CODED_COLOR_HEX) && !fileName.match(/(sass\/_base\/_animations)|(sass\/_base\/\_css-variables.scss)/)) {
                            reporter(data, fileName, "HARD_CODED_COLOR_HEX",
                                "Hardcoded color hex codes are found. %s deleted:\n", [Regex.HARD_CODED_COLOR_HEX]);
                        }

                        if (data.match(Regex.OJ_OVERRIDE_SCSS) && !fileName.match("/framework/sass/")) {
                            reporter(data, fileName, "OJ_OVERRIDE_SCSS",
                                "Illegal Oracle JET override found. %s deleted:\n", [Regex.OJ_OVERRIDE_SCSS]);
                        }
                    } else {
                        reporter(data, fileName, null,
                            "Empty file found. %s deleted:\n", []);
                    }
                }
            }).then(function() {
                resolve("Done");
                consoleTime("checkSCSS", "timeEnd");
            }).catch(function(err) {
                throw (err);
            });
        });
    });
}

function checkHTML(files) {
    consoleTime("checkHTML", "time");

    return new Promise(function(resolve, reject) {
        glob(files, function(err, files) {
            if (err) {
                throw err;
            }

            batchRead(files, function(err, fileName, data) {
                if (shouldCheckFile(fileName, data)) {
                    if (data) {
                        if (data.match(Regex.I_TAG)) {
                            reporter(data, fileName, null,
                                "<i> tag found for icons. Replace it by <span>. %s deleted:\n", [Regex.I_TAG]);
                        }

                        if (data.match(Regex.DEPRECATED_TAG_SUMMARY) || data.match(Regex.DEPRECATED_TAG_ALIGN)) {
                            reporter(data, fileName, null,
                                "Deprecated HTML5 attribute found. This file may contain \"summary\" or \"align\" attributes. %s deleted:\n", [Regex.DEPRECATED_TAG_SUMMARY,
                                    Regex.DEPRECATED_TAG_ALIGN
                                ]);
                        }

                        if (data.match(Regex.NEW_DATE)) {
                            reporter(data, fileName, null,
                                "new Date Statement was found. File will be deleted:\n", [Regex.NEW_DATE]);
                        }

                        if (data.match(Regex.DEPRECATED_METHODS)) {
                            reporter(data, fileName, null,
                                "Deprecated Method used. %s deleted:\n", [Regex.DEPRECATED_METHODS]);
                        }

                        if (data.match(Regex.ILLEGAL_HEADING)) {
                            reporter(data, fileName, null,
                                "<h5> or <h6> tag found. %s deleted:\n", [Regex.ILLEGAL_HEADING]);
                        }

                        if (data.match(Regex.ILLEGAL_FORMATTER_USAGE_HTML)) {
                            reporter(data, fileName, null,
                                "Illegal usage for formatting function. Use $formatter instead. %s deleted:\n", [Regex.ILLEGAL_FORMATTER_USAGE_HTML]);
                        }

                        if (data.match(Regex.INVALID_HTML_QUOTING)) {
                            reporter(data, fileName, null,
                                "Invalid HTML found. %s deleted:\n", [Regex.INVALID_HTML_QUOTING]);
                        }

                        if (data.match(Regex.INVALID_USE_OF_ACTION_HEADER)) {
                            reporter(data, fileName, null,
                                "Illegal usage of action header component. %s deleted:\n", [Regex.INVALID_USE_OF_ACTION_HEADER]);
                        }

                        if (data.match(Regex.DIGX_IN_COMPONENT)) {
                            reporter(data, fileName, null,
                                "/digx found in component. %s deleted:\n", [Regex.DIGX_IN_COMPONENT]);
                        }

                        if (data.match(Regex.SPLIT_BY_T)) {
                            reporter(data, fileName, null,
                                "Illegal usage of split(\"T\") to manipulate time. %s deleted:\n", [Regex.SPLIT_BY_T]);
                        }

                        if (data.match(Regex.OJ_OLD_SYNTAX_USED)) {
                            reporter(data, fileName, null,
                                "Oracle JET old syntax used. %s deleted:\n", [Regex.OJ_OLD_SYNTAX_USED]);
                        }

                        if (data.match(Regex.JQUERY_IN_HTML)) {
                            reporter(data, fileName, null,
                                "jQuery used in HTML. %s deleted:\n", [Regex.JQUERY_IN_HTML]);
                        }

                        if (data.match(Regex.FUNCTION_IN_HTML)) {
                            reporter(data, fileName, null,
                                "Inline function used in HTML. %s deleted:\n", [Regex.FUNCTION_IN_HTML]);
                        }

                        if (data.match(Regex.KEYWORD_JAVASCRIPT_USED)) {
                            reporter(data, fileName, null,
                                "Javascript keyword used for inline scripting. %s deleted:\n", [Regex.KEYWORD_JAVASCRIPT_USED]);
                        }

                        const $ = cheerio.load(data),
                            anchorDataBind = ko.expressionRewriting.parseObjectLiteral($("a").attr("data-bind")),
                            imageDataBind = ko.expressionRewriting.parseObjectLiteral($("img").attr("data-bind"));

                        if (anchorDataBind.length) {
                            anchorDataBind.forEach(function(element) {
                                if (element.key === "attr") {
                                    try {
                                        const attributeValue = ko.expressionRewriting.parseObjectLiteral(element.value);

                                        Object.keys(attributeValue).forEach(function(key) {
                                            if (attributeValue[key].value.match(/^['"][^'"]+?['"]$/) && (attributeValue[key].key === "aria-label" || attributeValue[key].key === "alt" || attributeValue[key].key === "title")) {
                                                reporter(data, fileName, null,
                                                    "Hardcoded string detected. %s deleted:\n", attributeValue[key].value);
                                            }
                                        });

                                        const alt = element.value.match(Regex.ALT_IN_DATABIND)[1],
                                            title = element.value.match(Regex.TITLE_IN_DATABIND)[1];

                                        if (alt.trim() === title.trim()) {
                                            reporter(data, fileName, null,
                                                "\"alt\" is same as \"title\" for anchor element. %s deleted:\n", []);
                                        }
                                    } catch (error) {}
                                }
                            });
                        }

                        if (imageDataBind) {
                            imageDataBind.forEach(function(element) {
                                if (element.key === "attr") {
                                    try {
                                        const attributeValue = ko.expressionRewriting.parseObjectLiteral(element.value);

                                        Object.keys(attributeValue).forEach(function(key) {
                                            if (attributeValue[key].value.match(/^['"][^'"]+?['"]$/) && (attributeValue[key].key === "aria-label" || attributeValue[key].key === "alt" || attributeValue[key].key === "title")) {
                                                reporter(data, fileName, null,
                                                    "Hardcoded string detected. %s deleted:\n", attributeValue[key].value);
                                            }
                                        });

                                        const alt = element.value.match(Regex.ALT_IN_DATABIND)[1],
                                            title = element.value.match(Regex.TITLE_IN_DATABIND)[1];

                                        if (alt.trim() === title.trim()) {
                                            reporter(data, fileName, null,
                                                "\"alt\" is same as \"title\" for image element. %s will be deleted:\n", []);
                                        }
                                    } catch (error) {}
                                }
                            });
                        }

                        const stack = [];

                        Array.prototype.map.call($("*").contents().filter(function() {
                            return this.nodeType === 8 && this.data.match(/\s\/?ko\s/)
                        }), node => node.data).forEach(koComment => {
                            if (koComment.startsWith(" ko")) {
                                stack.push(koComment);
                            }
                            if (koComment.startsWith(" /ko")) {
                                stack.pop();
                            }
                        });

                        if (stack.length > 0) {
                            reporter(data, fileName, null,
                                "Mismatched <ko> comment found. %s deleted:\n", stack.join());
                        }

                        if (data.match(Regex.ANCHOR_WITHOUT_HREF)) {
                            reporter(data, fileName, null,
                                "Anchor tag used without href. %s deleted:\n", [Regex.ANCHOR_WITHOUT_HREF]);
                        }

                        if (data.match(Regex.DIV_SPAN_CLICK)) {
                            reporter(data, fileName, null,
                                "Click found on <div> or <span>. %s deleted:\n", [Regex.DIV_SPAN_CLICK]);
                        }

                        if (data.match(Regex.MESSAGE_PLACEHOLDER_HARDCODED)) {
                            reporter(data, fileName, null,
                                "Hardcoded Message or Placeholder found. %s deleted:\n", [Regex.MESSAGE_PLACEHOLDER_HARDCODED]);
                        }

                        if (data.match(Regex.EMPTY_LABEL)) {
                            reporter(data, fileName, null,
                                "Empty label found. %s deleted:\n", [Regex.EMPTY_LABEL]);
                        }

                        if (data.match(Regex.TEXT_BINDING_HARDCODING)) {
                            reporter(data, fileName, null,
                                "Hardcoded text binding found. %s deleted:\n", [Regex.TEXT_BINDING_HARDCODING]);
                        }

                        if (data.match(Regex.INVALID_SUB_HEADING)) {
                            reporter(data, fileName, null,
                                "Hardcoded heading in page-section or action-header is found. %s deleted:\n", [Regex.INVALID_SUB_HEADING]);
                        }

                        if (data.match(Regex.HARDCODED_ROW_LABEL)) {
                            reporter(data, fileName, null,
                                "Hardcoded label in row component is found. %s deleted:\n", [Regex.HARDCODED_ROW_LABEL]);
                        }

                        if (data.match(Regex.INLINE_STYLING_TAG) || data.match(Regex.INLINE_STYLING_ROOTATTRIBUTES)) {
                            reporter(data, fileName, "Inline Style",
                                "Inline style tag found. %s will be deleted:\n", [Regex.INLINE_STYLING_TAG, Regex.INLINE_STYLING_ROOTATTRIBUTES]);
                        }

                        if (data.match(Regex.HARDCODED_LABEL) || data.match(Regex.HARDCODED_HEADER_TEXT)) {
                            reporter(data, fileName, null,
                                "Hardcoded Label found. %s will be deleted:\n", [Regex.HARDCODED_LABEL, Regex.HARDCODED_HEADER_TEXT]);
                        }

                        if (data.match(Regex.HARDCODED_TEXT) && !fileName.match("/partials/help")) {
                            reporter(data, fileName, null,
                                "Hardcoded Label found. %s will be deleted:\n", [Regex.HARDCODED_TEXT]);
                        }

                        if (data.match(Regex.ARIA_HARDCODED_LABEL)) {
                            reporter(data, fileName, null,
                                "Hardcoded aria Label found. %s will be deleted:\n", [Regex.ARIA_HARDCODED_LABEL]);
                        }

                        if (data.match(Regex.CONFIRM_SCREEN)) {
                            reporter(data, fileName, null,
                                "Calling of confirm-screen is not proper, call it by showDetails method. %s will be deleted:\n", [Regex.CONFIRM_SCREEN]);
                        }

                        if (data && data.match(Regex.RB_INVALID_VALUE)) {
                            reporter(data, fileName, null,
                                "Wrong key values are used in resource bundle. %s deleted:\n", [Regex.RB_INVALID_VALUE]);
                        }

                        if (data.match(Regex.RB_INVALID_IMPORT)) {
                            reporter(data, fileName, null,
                                "Always import resource bundle by ojL10N. %s deleted:\n", [Regex.RB_INVALID_IMPORT]);
                        }

                        if (fileName.match("partials/help/")) {
                            if (data.match(Regex.INVALID_HELP_PANEL_CLASS)) {
                                reporter(data, fileName, null,
                                    "Invalid class 'information-wrapper' and/or 'information-wrapper-image' found. Replace it by 'help-content' and 'help-item' instead. %s deleted:\n", [Regex.INVALID_HELP_PANEL_CLASS]);
                            }
                        }
                    }
                }
            }).then(function() {
                resolve("Done");
                consoleTime("checkHTML", "timeEnd");
            }).catch(function(err) {
                throw (err);
            });
        });
    });
}

function runChecks(fileObj) {
    Promise.all([
        genericChecks(fileObj),
        checkResourceBundles(fileObj.resourceBundles),
        checkBindings(fileObj.bindings),
        checkHTML(fileObj.html),
        checkSCSS(fileObj.scss),
        (Promise.resolve())
    ]).then(() => {
        logger(errors);

        commitCache(function(err) {
            if (err) {
                throw err;
            }

            console.log(`Cache efficiency: ${((cacheHit/(cacheHit + cacheMiss))*100).toFixed(2)}% (${cacheHit}/${cacheHit + cacheMiss})`);

            if (errorEncountered) {
                console.log("\u2717 Checks failed.");
                console.timeEnd("Total time");
                process.exit(1);
            } else {
                console.log("\u2713 All pre-build checks passed");

                if (!isVerbose) {
                    console.log("Run the script with --verbose or -v flag for detailed output");
                }

                console.timeEnd("Total time");
            }
        });
    });
}

function reporter(data, fileName, ruleName, errorMessage, patterns, warning, ignore) {
    warning = (warning === "warn");

    const symbol = warning ? "\n\u26A1 Warning: " : "\n\u2717 ";

    errorMessage = symbol + errorMessage;
    errors[errorMessage] = errors[errorMessage] || [];

    if (!ignoreLinterErrors && !warning) {
        errorEncountered = true;
    }

    if (fileCache[fileName]) {
        fileCache[fileName].hasErrors = true;
    }

    if (Array.isArray(patterns)) {
        for (const object of patterns) {
            if (data.match(object)) {
                fileName += `  at ${data.match(object)[0].trim()} ${computePosition(data, object)}, index: ${data.match(object).index}`;
            }
        }
    } else {
        fileName += ` at "${patterns}"`;
    }

    if ((ignore === "ignore") || (warning && errorEncountered)) {
        ignoredErrors.add(errorMessage);
    }

    errors[errorMessage].push(fileName);
}

function isError(data, match, ruleName) {
    if (!ruleName || (match && !data.match(new RegExp(`\/\/\\spreBuildChecks next-line-disable ${ruleName}[\\r\\n]+([^\\r\\n]+)${escapeRegExp(match[0])}`)))) {
        return true;
    }

    return false;
}

function logger(errors) {
    for (const errorInstance in errors) {
        if (errors.hasOwnProperty(errorInstance)) {
            console.log(errorInstance, `${errors[errorInstance].length} ${pluralize(errors[errorInstance].length, "file/files")}`);

            if (isVerbose) {
                if (!ignoredErrors.has(errorInstance)) {
                    for (let l = errors[errorInstance].length, i = l; i--;) {
                        console.log(errors[errorInstance][i]);
                    }

                    console.log("\u2504".repeat(50));
                } else {
                    for (let i = 0; i < peekIgnoredMessagesCount; i++) {
                        console.log(errors[errorInstance][i]);
                    }

                    console.log(`... and ${errors[errorInstance].length - peekIgnoredMessagesCount} more errors`);
                    console.log("\u2504".repeat(50));
                }
            }
        }
    }
}

function computePosition(data, match) {
    let lineNumber = 0,
        columnNumber = 0;

    data.split("\n").forEach(function(line, number) {
        if (match.exec(line)) {
            columnNumber = match.exec(line).index + 1;
            lineNumber += number + 1;
        }
    });

    return `line: ${lineNumber}, column: ${columnNumber}`;
}

function readSingleFile(fileName, callback) {
    return new Promise(function(resolve, reject) {
        readFile(fileName, "utf-8", function(err, fileData) {
            if (err) {
                reject(err);
                callback(err, fileName);
            }

            callback(void 0, fileName, fileData);
            resolve();
        });
    });
}

function batchRead(array, callback) {
    const promises = [];

    array.forEach(function(item) {
        promises.push(readSingleFile(item, callback));
    });

    return Promise.all(promises);
}