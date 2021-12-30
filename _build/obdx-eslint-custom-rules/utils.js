"use strict";

const isArray = Array.isArray;

function isObject(value) {
    const type = typeof value;
    return type === "object" || type === "function";
}

function isIdentifier(node) {
    return isObject(node) && node.type === "Identifier";
}

function isLiteral(node) {
    return isObject(node) && node.type === "Literal";
}

function isStringLiteral(node) {
    return isLiteral(node) && typeof node.value === "string";
}

function isArrayExpr(node) {
    return isObject(node) && node.type === "ArrayExpression";
}

function isObjectExpr(node) {
    return isObject(node) && node.type === "ObjectExpression";
}

function isFunctionExpr(node) {
    return isObject(node) &&
           (node.type === "FunctionExpression" ||
            node.type === "ArrowFunctionExpression");
}

function isMemberExpr(node) {
    return isObject(node) && node.type === "MemberExpression";
}

function isExprStatement(node) {
    return isObject(node) && node.type === "ExpressionStatement";
}

function isStringLiteralArray(node) {
    return isArrayExpr(node) &&
           isArray(node.elements) &&
           node.elements.every(isStringLiteral);
}

function hasParams(node) {
    return isObject(node) &&
           isArray(node.params) &&
           node.params.length > 0;
}

function hasCallback(node) {
    return isObject(node) &&
           isArray(node.arguments) &&
           node.arguments.some(isFunctionExpr);
}

function ancestor(predicate, node) {
    while ((node = node.parent)) {
        if (predicate(node)) return true;
    }

    return false;
}

function nearest(predicate, node) {
    while ((node = node.parent)) {
        if (predicate(node)) return node;
    }

    return undefined;
}

module.exports = {
    isIdentifier,
    isLiteral,
    isStringLiteral,
    isArrayExpr,
    isObjectExpr,
    isMemberExpr,
    isFunctionExpr,
    isExprStatement,
    isStringLiteralArray,
    hasParams,
    hasCallback,
    ancestor,
    nearest
};