"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fse = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var CopyAssetsMapping = (function () {
    function CopyAssetsMapping(props) {
        var _this = this;
        this.execute = function () {
            try {
                var absolutePath = path.resolve(_this.config.mappingPath);
                if (fse.existsSync(absolutePath)) {
                    var fileData = fse.readFileSync(absolutePath, { encoding: "utf8" });
                    var mappingArray = JSON.parse(fileData);
                    (mappingArray || []).forEach(function (_a) {
                        var from = _a.from, to = _a.to;
                        _this.copyPluginItem(from, to);
                    });
                }
                else {
                    console.log(_this.className + "#execute: \"" + absolutePath + "\" not found.");
                }
            }
            catch (error) {
                console.log(_this.className + "#execute: " + error);
            }
        };
        this.copyPluginItem = function (from, to) {
            try {
                fse.ensureDirSync(path.dirname(to));
                var fromPath = fse.existsSync(from) ? from : from.replace("node_modules/", "../");
                if (fse.statSync(from).isDirectory()) {
                    fse.copySync(fromPath, to);
                    console.log("Folder \"" + from + "\" successfully copied to \"" + to + "\".");
                }
                else {
                    fse.copyFileSync(fromPath, to);
                    console.log("File \"" + from + "\" successfully copied to \"" + to + "\".");
                }
            }
            catch (error) {
                console.log("  : Copy " + from + " failed. " + error);
            }
        };
        this.config = props;
        if (this.config.debug) {
            console.log(this.className + "#constructor: props=" + JSON.stringify(props));
        }
    }
    Object.defineProperty(CopyAssetsMapping.prototype, "className", {
        get: function () {
            return this.constructor.name;
        },
        enumerable: false,
        configurable: true
    });
    return CopyAssetsMapping;
}());
exports.default = CopyAssetsMapping;
