const {
    join
} = require("path");
const minimatch = require("minimatch");
const disableRegex = /^eslint-disable(-next-line|-line)?($|(\s+(@[\w-]+\/(?:[\w-]+\/)?)?[\w-]+)?)/;

const ignoredFilesList = require(join(__dirname, "../", ".eslintrc.json")).overrides.find(override => override.rules["obdx-disallow-eslint-disable"] === 0).files;

const isIgnoredFile = file => ignoredFilesList.some(ignoreFileGlob => minimatch(file, ignoreFileGlob));

module.exports = {
    meta: {
        docs: {
            description: "OBDX specific eslint validation errors.",
            category: "Error"
        }
    },
    create: context => ({
        Program: node => {
            for (const comment of node.comments) {
                const value = comment.value.trim();
                const res = disableRegex.exec(value);
                if (res && !isIgnoredFile(context.getFilename())) {
                    context.report({
                        loc: {
                            line: 0,
                            column: 0
                        },
                        message: `Disabling ESLint rule "${res[2].trim()}" forbidden at line {{line}}:{{column}}`,
                        data: comment.loc.start
                    });
                }
            }
        }
    })
};