'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createPrettierRule =
  exports.createFormatRule =
  exports.createLintRule =
    void 0;
/** Create a new lint rule */
function createLintRule(options) {
  return __assign(__assign({}, options), { type: 'lint' });
}
exports.createLintRule = createLintRule;
/** Create a new format rule */
function createFormatRule(options) {
  return __assign(__assign({}, options), { type: 'format' });
}
exports.createFormatRule = createFormatRule;
/** Create a new prettier rule */
function createPrettierRule(options) {
  return createFormatRule({
    name: 'Prettier rule for '.concat(options.name),
    description: 'Prettier formatting for '.concat(options.name, '.'),
    packageChanges: options.packageChanges,
    mainScript: options.mainScript,
    templates: ['../templates/format/'],
  });
}
exports.createPrettierRule = createPrettierRule;
