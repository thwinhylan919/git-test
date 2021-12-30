const chalk = require("chalk"),
    stripAnsi = require("strip-ansi"),
    table = require("text-table"),
    { promisify } = require("util"),
    glob = promisify(require("multi-glob").glob),
    stdout = process.stdout;

let jsdocFiles = require("./eslint-jsdoc.json").jsdoc,
    svnBlame, analytics;

const disableESLint = (process.env.OBDX_REPOSITORY === "git");

const devMode = (process.argv[2] === "--development" || process.argv[2] === "-D"),
    disableBlame = devMode || process.env.OBDX_LINTER_BLAME === "disable",
    ignoreLinterErrors = (process.env.OBDX_IGNORE_LINTER_ERRORS !== "false");


let exitCode = 0;

const CLIEngine = require("eslint").CLIEngine;

if (!disableESLint) {
    if (!disableBlame) {
        const Analytics = require("./build-analytics");
        analytics = new Analytics();
        svnBlame = require("./svn-blame");
    }

    if (!jsdocFiles.length && devMode) console.warn(chalk.yellow("Did you forget to run the JSDoc task? If so, run now > node eslint-jsdoc.js"));

    console.warn(chalk.green(`Using ESLint version: ${CLIEngine.version}`));

    const eslint = new CLIEngine({
            configFile: "./.eslintrc.json",
            cache: true,
            fix: devMode,
            rulePaths: ["./obdx-eslint-custom-rules"],
            cacheLocation: ".obdx_defaulteslintcache"
        }),
        jsdoc = new CLIEngine({
            useEslintrc: false,
            parserOptions: {
                ecmaVersion: 6
            },
            rules: {
                "require-jsdoc": 2,
                "valid-jsdoc": 2
            },
            cache: true,
            fix: devMode,
            cacheLocation: ".obdx_jsdoceslintcache"
        });

    Promise.all([
            executeESLint(eslint, [
                "../components/", "../flows", "../framework/elements", "../framework/js/view-model",
                "../framework/js/base-models", "../framework/js/constants", "../framework/js/configurations",
                "../framework/js/plugins", "../resources", "../lzn/", "../extensions"
            ]),
            executeESLint(jsdoc, [])
        ])
        .then(checkRunStatus)
        .then(blameFiles)
        .then(formatResults)
        .then(logger);
}

function checkRunStatus(results) {
    if (results[0].errorCount || results[1].errorCount) {
        exitCode = 1;
    }
    return [
        results[0].results,
        results[1].results
    ];
}

function blameFiles(results) {
    const fileSet = new Set(),
        fileBlamePromises = [];
    results = results.map(result => {
        return result.reduce((finalResult, resultInstance) => {
            if (resultInstance.messages.length) {
                for (let j = 0; j < resultInstance.messages.length; j++) {
                    fileSet.add(resultInstance.filePath);
                }
                finalResult.push(resultInstance);
            }
            return finalResult;
        }, []);
    });
    fileSet.forEach(file => fileBlamePromises.push(!disableBlame ? svnBlame(file) : Promise.resolve("")));
    return Promise.all(fileBlamePromises).then(() => results);
}

function formatResults(eslintResults) {
    const blamePromises = [];
    eslintResults.forEach(result => {
        for (let i = 0; i < result.length; i++) {
            if (result[i].messages.length) {
                for (let j = 0; j < result[i].messages.length; j++) {
                    blamePromises.push(!disableBlame ? svnBlame(result[i].filePath, result[i].messages[j].line).then(blameAnnotation => {
                        analytics.push(blameAnnotation);
                        result[i].messages[j].authorName = `Author: ${blameAnnotation.author}@${blameAnnotation.revision}`;
                    }) : Promise.resolve("").then(() => {
                        result[i].messages[j].authorName = "";
                    }));
                }
            }
        }
    });
    return Promise.all(blamePromises).then(() => {
        return {
            eslint: eslintFormatter(eslintResults[0]),
            jsdoc: eslintFormatter(eslintResults[1])
        };
    });
}

async function logger(results) {
    if (analytics) {
        await analytics.lock();
    }
    console.log(`ESLint finished in ${devMode ? 'development' : 'production'} mode`);
    stdout.write(results.eslint);
    stdout.write(results.jsdoc);
    process.exit(ignoreLinterErrors ? 0 : exitCode);
}

async function executeESLint(cliEngine, sourceArray) {
    const files = await glob(cliEngine.resolveFileGlobPatterns(sourceArray));
    debugger;
    const report = cliEngine.executeOnFiles(files);
    if (devMode) {
        CLIEngine.outputFixes(report);
    }
    return report;
}

function eslintFormatter(results) {
    let output = "\n",
        errorCount = 0,
        warningCount = 0,
        fixableErrorCount = 0,
        fixableWarningCount = 0,
        summaryColor = "yellow";

    results.forEach(result => {
        const messages = result.messages;
        if (messages.length === 0) {
            return;
        }
        errorCount += result.errorCount;
        warningCount += result.warningCount;
        fixableErrorCount += result.fixableErrorCount;
        fixableWarningCount += result.fixableWarningCount;
        output += `${chalk.underline(result.filePath)}\n`;
        output += `${table(
            messages.map(message => {
                let messageType;
                if (message.fatal || message.severity === 2) {
                    messageType = chalk.red("error");
                    summaryColor = "red";
                } else {
                    messageType = chalk.yellow("warning");
                }
                return [
                    "",
                    message.line || 0,
                    message.column || 0,
                    messageType,
                    message.authorName,
                    message.message.replace(/([^ ])\.$/, "$1"),
                    chalk.dim(message.ruleId || "")
                ];
            }),
            {
                align: ["", "r", "l"],
                stringLength(str) {
                    return stripAnsi(str).length;
                }
            }
        ).split("\n").map(el => el.replace(/(\d+)\s+(\d+)/, (m, p1, p2) => chalk.dim(p1 + ":" + p2))).join("\n")}\n\n`;
    });
    const total = errorCount + warningCount;
    if (total > 0) {
        output += chalk[summaryColor].bold([
            "\u2716 ", total, pluralize(" problem", total),
            " (", errorCount, pluralize(" error", errorCount), ", ",
            warningCount, pluralize(" warning", warningCount), ")\n"
        ].join(""));
        if (fixableErrorCount > 0 || fixableWarningCount > 0) {
            output += chalk[summaryColor].bold([
                "  ", fixableErrorCount, pluralize(" error", fixableErrorCount), " and ",
                fixableWarningCount, pluralize(" warning", fixableWarningCount),
                " potentially fixable with the `--fix` option.\n"
            ].join(""));
        }
    }
    return total > 0 ? output : "";
}

function pluralize(word, count) {
    return (count === 1 ? word : `${word}s`);
}