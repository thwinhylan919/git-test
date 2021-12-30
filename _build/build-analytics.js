const promisify = require("util").promisify;
const fs = require("fs");
const path = require("path");
const writeFile = promisify(fs.writeFile);
const execSync = require("child_process").execSync;
const get = require("http").get;

function getCurrentBuildAuthors() {
    return new Promise(resolve => {
        get(`${process.env.BUILD_URL}api/xml?wrapper=changes&xpath=//changeSet//item//author//fullName|//changeSet//affectedPath`, res => {
            let rawData = "";
            res.setEncoding("utf8");
            res.on("data", chunk => (rawData += chunk));
            res.on("end", () => parseAuthors(rawData, resolve));
        });
    });
}

function parseAuthors(xmlString, resolve) {
    const authors = {};
    xmlString.match(/<affectedPath>.*?<\/fullName>/g)
        .forEach(element => {
            if (!authors[element.match(/<fullName>(.*)<\/fullName>/)[1]]) authors[element.match(/<fullName>(.*)<\/fullName>/)[1]] = element.match(/<affectedPath>/g).length;
            else authors[element.match(/<fullName>(.*)<\/fullName>/)[1]] += element.match(/<affectedPath>/g).length;
        });
    resolve(Object.entries(authors).map(element => {
        return {
            author: element[0],
            files: element[1]
        }
    }));
}

function getAuthorWeightedAverage(author, instance) {
    const authorErrorWeight = (instance.commitData[author] && instance.commitData[author].errorWeight) || 0;
    const totalErrorWeight = Object.values(instance.commitData).reduce((totalWeight, instance) => totalWeight += instance.errorWeight, 0);
    return authorErrorWeight / totalErrorWeight;
}

function analytics(params) {
    params = params || {};
    params.analyticsFile = params.analyticsFile || "./.obdx_buildAnalytics.json";
    params.rawAnalyticsParser = params.rawAnalyticsParser || performAnalytics;

    let rawInstance;
    try {
        rawInstance = require(params.analyticsFile);
    } catch (error) {
        rawInstance = {
            commitData: {},
            metadata: {
                refactorCommits: []
            }
        };
    }

    function isRefactorCommit(blameData) {
        if (!["rkumars", "rssodhi"].includes(blameData.author)) return false;
        if (rawInstance.metadata.refactorCommits.includes(blameData.revision)) return true;
        const stdout = execSync(`svn log -c ${blameData.revision}`, {
            cwd: path.join(__dirname, "../")
        });
        const revisionIsRefactorCommit = stdout && !!stdout.toString().match(/refactor/ig);
        if (revisionIsRefactorCommit) rawInstance.metadata.refactorCommits.push(blameData.revision);
        return revisionIsRefactorCommit;
    }

    function push(blameData) {
        if (blameData && blameData.author && blameData.revision) {
            if (rawInstance.commitData[blameData.author]) {
                if (!rawInstance.commitData[blameData.author].errorRevisions.includes(blameData.revision)) {
                    if (!isRefactorCommit(blameData)) {
                        rawInstance.commitData[blameData.author].errorRevisions.push(blameData.revision);
                        rawInstance.commitData[blameData.author].errorWeight += 1;
                    }
                } else {
                    rawInstance.commitData[blameData.author].errorWeight += 1;
                }
            } else {
                rawInstance.commitData[blameData.author] = {};
                rawInstance.commitData[blameData.author].errorRevisions = [];
                rawInstance.commitData[blameData.author].errorWeight = 0;
                push(blameData);
            }
        }
    }

    function performAnalytics(instance) {
        return Promise.resolve(instance);
    }

    function lock() {
        return params.rawAnalyticsParser(rawInstance)
            .then(data => writeFile(params.analyticsFile, JSON.stringify(data)))
            .then(() => console.log(`Analytics file successfully generated`));
    }

    function extract(key) {
        switch (key) {
            case "authorWithMostErrors":
                const highestErrorCount = Math.max(...Object.values(rawInstance.commitData).map(element => element.errorWeight), 0);
                return Promise.resolve(`Authors with most errors: ${Object.keys(rawInstance.commitData).filter(author => (rawInstance.commitData[author].errorWeight === highestErrorCount)).toString()} (errorWeight: ${highestErrorCount})`);
            case "authorWithLeastErrors":
                const lowestErrorCount = Math.min(...Object.values(rawInstance.commitData).map(element => element.errorWeight), 0);
                return Promise.resolve(`Authors with least errors: ${Object.keys(rawInstance.commitData).filter(author => (rawInstance.commitData[author].errorWeight === lowestErrorCount)).toString()} (errorWeight: ${lowestErrorCount})`);
            case "buildSuccessProbability":
                return getCurrentBuildAuthors().then(authors => {
                    const errorProbability = authors
                        .map(author => ((author.fileAvg = (author.files / authors.reduce((result, instance) => (result += instance.files), 0))),
                            (author.errorAvg = getAuthorWeightedAverage(author, rawInstance)),
                            author))
                        .reduce((result, instance) => result += instance.fileAvg * instance.errorAvg, 0);
                    return `Build will succeed with probability ${((1 - errorProbability)*100).toFixed(2)}%`;
                });
            default:
                return new Error(`Specify atleast one option. As of now, you can pass: "authorWithMostErrors", "authorWithLeastErrors", "buildSuccessProbability"`);
        }
    }

    return {
        push: push,
        lock: lock,
        extract: extract
    };
}

if (require.main === module) {
    const Analytics = new analytics();
    const args = Array.from(process.argv).filter(arg => arg.match("--")).map(arg => arg.replace("--", ""));
    args.forEach(arg => Analytics.extract(arg).then(console.log));
} else {
    module.exports = analytics;
}