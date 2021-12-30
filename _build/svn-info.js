/* eslint-env node */

const promisify = require("util").promisify,
    exec = promisify(require("child_process").exec);

const info = async fileName => {
    let exists = false;
    try {
        await exec(`svn info ${fileName}`, {
            cwd: "../"
        });
        exists = true;
    } catch (e) {
        exists = false;
    } finally {
        return { fileName, exists };
    }
}

module.exports = (files) => {
    const promises = [];
    files.forEach(fileName => promises.push(info(fileName)));
    return Promise.all(promises);
};