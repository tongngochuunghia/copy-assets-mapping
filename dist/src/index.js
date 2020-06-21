"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var package_json_1 = require("../package.json");
var __DEV__ = false;
var isNullOrEmpty = function (value) {
    return value === undefined || value === null || value === "";
};
var getConfig = function () {
    var params = {};
    var args = process.argv;
    if (__DEV__) {
        console.log("#getConfig", args);
    }
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var param = args_1[_i];
        var split = param.split(/=/g);
        params[split[0]] = (split.length > 1) ? split[1] : "";
    }
    if (isNullOrEmpty(params.mappingPath)) {
        params.mappingPath = "./mapping.json";
    }
    if (__DEV__) {
        console.log("#getConfig: params=", params);
    }
    return params;
};
var copyPluginItem = function (from, to) {
    try {
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(to));
        var fromPath = fs_extra_1.default.existsSync(from) ? from : from.replace("node_modules/", "../");
        if (fs_extra_1.default.statSync(from).isDirectory()) {
            fs_extra_1.default.copySync(fromPath, to);
            console.log("  - [Folder] " + chalk_1.default.gray(from) + " " + chalk_1.default.green("successfully") + " copied to " + chalk_1.default.gray(to) + ".");
        }
        else {
            fs_extra_1.default.copyFileSync(fromPath, to);
            console.log("  - [File]   " + chalk_1.default.gray(from) + " " + chalk_1.default.green("successfully") + " copied to " + chalk_1.default.gray(to) + ".");
        }
    }
    catch (error) {
        console.log("  >>> Copy " + chalk_1.default.gray(from) + " " + chalk_1.default.red("failed") + ". " + error);
    }
};
exports.default = (function () {
    console.log(chalk_1.default.yellow(package_json_1.name + " (Version " + package_json_1.version + " - " + package_json_1.author + ")"));
    var config = getConfig();
    try {
        var absolutePath = path_1.default.resolve(config.mappingPath);
        if (fs_extra_1.default.existsSync(absolutePath)) {
            var fileData = fs_extra_1.default.readFileSync(absolutePath, { encoding: "utf8" });
            var mappingArray = JSON.parse(fileData);
            (mappingArray || []).forEach(function (_a) {
                var from = _a.from, to = _a.to;
                copyPluginItem(from, to);
            });
        }
        else {
            console.log("  - " + chalk_1.default.yellow("File or folder") + " " + chalk_1.default.green("absolutePath") + " " + chalk_1.default.yellow("not found."));
        }
        console.log(chalk_1.default.green("Completed."));
    }
    catch (error) {
        console.log(chalk_1.default.red("Copying error:"));
        console.error(error);
    }
})();
