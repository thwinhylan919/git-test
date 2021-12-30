const {
    isStringLiteral
} = require("./utils");

module.exports = {
    meta: {
        docs: {
            description: "OBDX specific string validation errors.",
            category: "Error"
        },
        messages: {
            emptyStrings: "Don't use empty strings",
            startWithSpace: "Don't start strings with spaces",
            endWithSpace: "Don't end strings with spaces"
        }
    },
    create: function (context) {
        return {
            Literal(node) {
                if (isStringLiteral(node)) {
                    if (node.value.match(/^[ \t]+$/)) {
                        context.report({
                            node,
                            messageId: "emptyStrings"
                        });
                    }
                    if (node.value.match(/[^\s]+[ \t]+$/)) {
                        context.report({
                            node,
                            messageId: "endWithSpace"
                        });
                    }
                    if (node.value.match(/^[ \t]+[^\s]+/)) {
                        context.report({
                            node,
                            messageId: "startWithSpace"
                        });
                    }
                }
            }
        };
    }
};