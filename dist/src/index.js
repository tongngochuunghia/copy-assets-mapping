"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var command_line_args_1 = __importDefault(require("command-line-args"));
var package_json_1 = require("../package.json");
var options;
var logger = {
    info: console.log,
    error: console.error,
    debug: function (message) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (options && options.debug) {
            var length_1 = params.length;
            switch (length_1) {
                case 0: return console.debug(message);
                case 1: return console.debug(message, params[0]);
                case 2: return console.debug(message, params[0], params[1]);
                case 3: return console.debug(message, params[0], params[1], params[2]);
                case 4: return console.debug(message, params[0], params[1], params[2], params[3]);
                case 5: return console.debug(message, params[0], params[1], params[2], params[3], params[4]);
                default: return console.debug(message, params.join(" "));
            }
        }
    }
};
var copyPluginItem = function (from, to) {
    try {
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(to));
        var fromPath = fs_extra_1.default.existsSync(from) ? from : from.replace("node_modules/", "../");
        var absoluteFromPath = path_1.default.resolve(fromPath);
        var absoluteToPath = path_1.default.resolve(to);
        logger.debug("%s - [debug]: Copying from %s to %s", new Date().toISOString(), chalk_1.default.gray(absoluteFromPath), chalk_1.default.gray(absoluteToPath));
        if (fs_extra_1.default.statSync(from).isDirectory()) {
            fs_extra_1.default.copySync(fromPath, to);
            logger.info("  - [Folder] " + chalk_1.default.gray(from) + " " + chalk_1.default.green("successfully") + " copied to " + chalk_1.default.gray(to));
        }
        else {
            fs_extra_1.default.copyFileSync(fromPath, to);
            logger.info("  - [File]   " + chalk_1.default.gray(from) + " " + chalk_1.default.green("successfully") + " copied to " + chalk_1.default.gray(to));
        }
    }
    catch (err) {
        logger.info("  >>> Copy " + chalk_1.default.gray(from) + " " + chalk_1.default.red("failed") + ". " + err);
    }
};
exports.default = (function () {
    logger.info(chalk_1.default.yellow(package_json_1.name + " (Version " + package_json_1.version + " - " + package_json_1.author + ")"));
    options = command_line_args_1.default([
        { name: "mapping", alias: "m", type: String, defaultValue: "./mapping.json" },
        { name: "debug", alias: "d", type: Boolean, defaultValue: false }
    ]);
    logger.debug("%s - [debug]: options=%s", new Date().toISOString(), JSON.stringify(options));
    try {
        var absolutePath = path_1.default.resolve(options.mapping);
        logger.debug("%s - [debug]: mappingPath=%s", new Date().toISOString(), absolutePath);
        if (fs_extra_1.default.existsSync(absolutePath)) {
            var mappingData = fs_extra_1.default.readFileSync(absolutePath, { encoding: "utf8" });
            logger.debug("%s - [debug]: rawData=%s", new Date().toISOString(), mappingData);
            var mappingArray = JSON.parse(mappingData);
            logger.debug("%s - [debug]: mappingData=%s", new Date().toISOString(), JSON.stringify(mappingArray));
            (mappingArray || []).forEach(function (_a) {
                var from = _a.from, to = _a.to;
                copyPluginItem(from, to);
            });
        }
        else {
            logger.info("  - " + chalk_1.default.yellow("File or folder") + " " + chalk_1.default.green("absolutePath") + " " + chalk_1.default.yellow("not found"));
        }
        logger.info(chalk_1.default.green("Completed."));
    }
    catch (err) {
        logger.error(chalk_1.default.red("Copying error:"), err);
    }
})();
