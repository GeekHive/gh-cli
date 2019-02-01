#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var install_packages_1 = __importDefault(require("install-packages"));
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var R = __importStar(require("ramda"));
var standards_1 = require("./standards");
var ERROR_NO_TYPES = 'At least one valid type is required.';
// const ERROR_INVALID_TYPE = (type: string) => `Type ${type} is not supported.`;
function start() {
    commander_1.default.parse(process.argv);
    if (!commander_1.default.args.length) {
        console.error(ERROR_NO_TYPES);
        process.exit(1);
    }
    processTypes(commander_1.default.args);
}
function processTypes(types) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, processStandards(getSelectedStandards(types))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getSelectedStandards(types) {
    return standards_1.standards.filter(function (standard) {
        return types
            // string[] -> boolean[] - whether any keyword of this standard matched the current type
            .map(function (type) { return standard.keywords.reduce(function (p, c) { return p || c === type; }, false); })
            // boolean[] -> boolean - whether this standard matched any type
            .reduce(function (p, c) { return p || c; }, false);
    });
}
function processStandards(standards) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, installDependencies(standards)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, installDevDependencies(standards)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, copyTemplates(standards)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, writeScripts(standards)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function installDependencies(standards) {
    return __awaiter(this, void 0, void 0, function () {
        var dependencies, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dependencies = mergePackageList(standards, 'dependencies');
                    if (!dependencies.length) return [3 /*break*/, 5];
                    console.log('> Installing dependencies:', dependencies.join(', '));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, install_packages_1.default({ packages: dependencies })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.warn('> No dependencies provided');
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function installDevDependencies(standards) {
    return __awaiter(this, void 0, void 0, function () {
        var devDependencies, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    devDependencies = mergePackageList(standards, 'devDependencies');
                    devDependencies.push('concurrently');
                    devDependencies.push('husky');
                    if (!devDependencies.length) return [3 /*break*/, 5];
                    console.log('> Installing devDependencies:', devDependencies.join(', '));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, install_packages_1.default({ packages: devDependencies, saveDev: true })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    console.error(e_2);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.warn('> No devDependencies provided');
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function copyTemplates(standards) {
    return __awaiter(this, void 0, void 0, function () {
        var templates;
        var _this = this;
        return __generator(this, function (_a) {
            templates = mergeTemplates(standards);
            if (templates.length) {
                console.log('> Installing templates: ', templates.join(', '));
                templates.forEach(function (template) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fs_extra_1.default.copy(path_1.default.join(path_1.default.dirname(require.resolve('./gh')), template), process.cwd(), { overwrite: true })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); });
            }
            else {
                console.warn('> No templates provided');
            }
            return [2 /*return*/];
        });
    });
}
function getMainScripts(type, standards) {
    return R.uniq(R.flatten(standards.map(function (s) { return R.flatten(s.rules.map(function (r) { return r.type === type && r.mainScript ? r.mainScript : ''; }).filter(Boolean)); })));
}
var colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];
function createConcurrentScript(scripts, killOthersOnFail) {
    var k = killOthersOnFail ? ' --kill-others-on-fail' : '';
    var n = scripts.join(',');
    var c = colors.slice(0, scripts.length).join(',');
    var s = scripts.map(function (s) { return "\"yarn run " + s + "\""; }).join(' ');
    return "concurrently" + k + " -n \"" + n + "\" -c \"" + c + "\" " + s;
}
function writeScripts(standards) {
    return __awaiter(this, void 0, void 0, function () {
        var scripts, precommitScripts, pkgJsonPath, pkg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    scripts = __assign({}, mergePackageDictionary(standards, 'scripts'), { lint: createConcurrentScript(getMainScripts('lint', standards)), format: createConcurrentScript(getMainScripts('format', standards)) });
                    precommitScripts = {
                        hooks: {
                            'pre-commit': 'yarn run format && yarn run lint'
                        }
                    };
                    if (!(scripts && precommitScripts)) return [3 /*break*/, 2];
                    console.log('> Writing scripts to package.json:', Object.keys(scripts).join(', '));
                    pkgJsonPath = path_1.default.join(process.cwd(), 'package.json');
                    pkg = JSON.parse(fs_extra_1.default.readFileSync(pkgJsonPath).toString());
                    pkg.scripts = __assign({}, (pkg.scripts || {}), scripts);
                    pkg.husky = __assign({}, (pkg.husky || {}), precommitScripts);
                    return [4 /*yield*/, fs_extra_1.default.writeFile(pkgJsonPath, JSON.stringify(pkg, undefined, 2))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    console.warn('No scripts provided.');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function mergePackageDictionary(standards, field) {
    return standards
        .map(function (s) { return s.rules.map(function (r) { return r.packageChanges ? r.packageChanges[field] : []; }).reduce(function (p, c) { return R.merge(p, c); }); })
        .reduce(function (p, c) { return R.merge(p, c); });
}
function mergePackageList(standards, field) {
    return R.uniq(standards.map(function (s) {
        return s.rules
            .map(function (r) { return r.packageChanges && r.packageChanges[field] ? r.packageChanges[field] : []; })
            .reduce(function (p, c) {
            if (p === void 0) { p = []; }
            if (c === void 0) { c = []; }
            return p.concat(c);
        });
    }).reduce(function (p, c) {
        if (p === void 0) { p = []; }
        if (c === void 0) { c = []; }
        return p.concat(c);
    }) || []);
}
function mergeTemplates(standards) {
    return R.uniq(R.flatten(standards.map(function (s) { return R.flatten(s.rules.map(function (r) { return r.templates || []; })); })));
}
start();
