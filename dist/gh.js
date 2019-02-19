#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
commander_1.default
    .version('1.0.0')
    .command('standards [types]', 'add standards for js, ts, and/or scss.')
    .parse(process.argv);
