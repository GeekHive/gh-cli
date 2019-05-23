"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Create a new lint rule */
function createLintRule(options) {
    return {
        type: 'lint',
        name: options.name,
        description: options.description,
        packageChanges: options.packageChanges,
        mainScript: options.mainScript,
        templates: options.templates
    };
}
exports.createLintRule = createLintRule;
/** Create a new format rule */
function createFormatRule(options) {
    return {
        type: 'format',
        name: options.name,
        description: options.description,
        packageChanges: options.packageChanges,
        mainScript: options.mainScript,
        templates: options.templates
    };
}
exports.createFormatRule = createFormatRule;
/** Create a new prettier rule */
function createPrettierRule(options) {
    return createFormatRule({
        name: "Prettier rule for " + options.name,
        description: "Prettier formatting for " + options.name + ".",
        packageChanges: options.packageChanges,
        mainScript: options.mainScript,
        templates: ['../templates/format/']
    });
}
exports.createPrettierRule = createPrettierRule;
/** Create a new accessibility rule */
function createAccessibilityRule(options) {
    return {
        type: 'a11y',
        name: options.name,
        description: options.description,
        packageChanges: options.packageChanges,
        mainScript: options.mainScript
    };
}
exports.createAccessibilityRule = createAccessibilityRule;
