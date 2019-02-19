#!/usr/bin/env node
"use strict";
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
var install_packages_1 = __importDefault(require("install-packages"));
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var ERROR_INVALID_TYPE = 'A valid type is required.';
function start() {
    commander_1.default.parse(process.argv);
    var types = commander_1.default.args;
    if (!types.length) {
        console.error(ERROR_INVALID_TYPE);
        process.exit(1);
    }
    types.forEach(processType);
}
function processType(type) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, templates;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = type;
                    switch (_a) {
                        case 'js': return [3 /*break*/, 1];
                        case 'ts': return [3 /*break*/, 3];
                        case 'scss': return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, install_packages_1.default({
                        packages: ['eslint', '@geekhive/eslint-config-standard'],
                        saveDev: true
                    })];
                case 2:
                    _b.sent();
                    templates = path_1.default.join(path_1.default.dirname(require.resolve('.')), '../templates/lint/js');
                    fs_extra_1.default.copy(templates, process.cwd());
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, install_packages_1.default({
                        packages: ['tslint', '@geekhive/tslint-config-standard'],
                        saveDev: true
                    })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, install_packages_1.default({
                        packages: ['stylelint', '@geekhive/stylelint-config-standard'],
                        saveDev: true
                    })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    console.error(ERROR_INVALID_TYPE);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
start();
