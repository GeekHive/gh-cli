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
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var install_packages_1 = __importDefault(require("install-packages"));
var path_1 = __importDefault(require("path"));
var standards_1 = require("./standards");
var utility_1 = require("./utility");
var command = 'npm';
function start() {
    commander_1.default.parse(process.argv);
    if (!commander_1.default.args.length) {
        // Add all accessibility tools if list of arguments is omitted
        var pkgJsonPath = path_1.default.join(process.cwd(), 'package.json');
        var pkg = JSON.parse(fs_extra_1.default.readFileSync(pkgJsonPath).toString());
        var allAccessibilities = ['axe', 'pa11y', 'lighthouse'];
        var currentScripts_1 = utility_1.checkConcurrentScript(pkg, 'a11y', standards_1.accessibilities);
        var allTypes = allAccessibilities.filter(function (type) { return currentScripts_1.indexOf("a11y:" + type) === -1; });
        processTypes(allTypes);
    }
    else {
        processTypes(commander_1.default.args);
    }
}
function processTypes(types) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, install_packages_1.default.determinePackageManager(process.cwd())];
                case 1:
                    command = _a.sent();
                    return [4 /*yield*/, utility_1.processStandards(utility_1.getSelectedStandards(standards_1.accessibilities, types), writeScripts)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function writeScripts(selectedStandards) {
    return __awaiter(this, void 0, void 0, function () {
        var pkgJsonPath, pkg, currentScripts, allMainScripts, scripts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pkgJsonPath = path_1.default.join(process.cwd(), 'package.json');
                    pkg = JSON.parse(fs_extra_1.default.readFileSync(pkgJsonPath).toString());
                    currentScripts = utility_1.checkConcurrentScript(pkg, 'a11y', standards_1.accessibilities);
                    allMainScripts = utility_1.getMainScripts('a11y', selectedStandards).concat(currentScripts);
                    scripts = __assign({}, utility_1.mergePackageDictionary(selectedStandards, 'scripts'), { a11y: utility_1.createConcurrentScript(command, allMainScripts) });
                    console.log('> Writing scripts to package.json:', Object.keys(scripts).join(', '));
                    pkg.scripts = __assign({}, (pkg.scripts || {}), scripts);
                    return [4 /*yield*/, fs_extra_1.default.writeFile(pkgJsonPath, JSON.stringify(pkg, undefined, 2))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
start();