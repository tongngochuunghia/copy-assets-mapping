"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var CopyAssetsMapping_1 = __importDefault(require("./CopyAssetsMapping"));
var package_json_1 = require("../package.json");
var Index = (function () {
    function Index() {
        var _this = this;
        this.execute = function () {
            console.log(chalk_1.default.yellow(package_json_1.name + " (Version " + package_json_1.version + " - " + package_json_1.author + ")"));
            (new CopyAssetsMapping_1.default(_this.config)).execute();
        };
        this.isNullOrEmpty = function (value) {
            return value === undefined || value === null || value === "";
        };
        this.getParams = function () {
            var params = {};
            var args = process.argv;
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var param = args_1[_i];
                var split = param.split(/=/g);
                params[split[0]] = (split.length > 1) ? split[1] : "";
            }
            if (_this.config.debug) {
                console.log(_this.className + "#parseParams: params=" + JSON.stringify(params));
            }
            return params;
        };
        this.className = this.constructor.name;
        this.config = {
            debug: false,
            mappingPath: "./mapping.json"
        };
        this.params = this.getParams();
        if (!this.isNullOrEmpty(this.params.mappingPath)) {
            this.config.mappingPath = this.params.mappingPath;
        }
    }
    return Index;
}());
var index = new Index();
index.execute();
exports.default = index;