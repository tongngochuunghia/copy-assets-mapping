import fse from "fs-extra";
import path from "path";
import chalk from "chalk";
import { author, name, version } from "../package.json";

export interface IConfig {
    mappingPath: string;
}

export interface IMappingItem {
    from: string;
    to: string;
}

/**
 * Debug flag.
 */
const __DEV__ = false;

/**
 * Check Object is null or String null or empty.
 *
 * @param {object | string} value Object or String
 * @returns if null or empty return true, otherwise return false.
 */
const isNullOrEmpty = (value: any): value is undefined | boolean => {
    return value === undefined || value === null || value === "";
};

/**
 * Read and parse params from command line args.
 *
 * @see https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program
 */
const getConfig = (): IConfig => {
    const params: IConfig = {} as any;
    const args: string[] = process.argv;
    if (__DEV__) {
        console.log("#getConfig", args);
    }
    for (const param of args) {
        const split: string[] = param.split(/=/g);
        (params as any)[split[0]] = (split.length > 1) ? split[1] : "";
    }
    if (isNullOrEmpty(params.mappingPath)) {
        params.mappingPath = "./mapping.json";
    }
    if (__DEV__) {
        console.log("#getConfig: params=", params);
    }
    return params;
};

/**
 * Copy file or folder.
 *
 * @param from {string} From path
 * @param to {string} To path
 */
const copyPluginItem = (from: string, to: string): void => {
    try {
        // create dir to if not exist
        fse.ensureDirSync(path.dirname(to));
        const fromPath = fse.existsSync(from) ? from : from.replace("node_modules/", "../");
        if (fse.statSync(from).isDirectory()) {
            // copy dir
            fse.copySync(fromPath, to);
            console.log(`  - [Folder] ${chalk.gray(from)} ${chalk.green("successfully")} copied to ${chalk.gray(to)}.`);
        } else {
            // copy file
            fse.copyFileSync(fromPath, to);
            console.log(`  - [File]   ${chalk.gray(from)} ${chalk.green("successfully")} copied to ${chalk.gray(to)}.`);
        }
    } catch (error) {
        console.log(`  >>> Copy ${chalk.gray(from)} ${chalk.red("failed")}. ${error}`);
    }
};

/**
 * Main function.
 */
export default ((): void => {
    // Write log module info
    console.log(chalk.yellow(`${name} (Version ${version} - ${author})`));

    const config = getConfig();
    // try {
    //     const absolutePath = path.resolve(config.mappingPath);
    //     if (fse.existsSync(absolutePath)) {
    //         // fse.readFileSync
    //         const fileData = fse.readFileSync(absolutePath, { encoding: "utf8" });
    //         const mappingArray: IMappingItem[] = JSON.parse(fileData);
    //         (mappingArray || []).forEach(({ from, to }) => {
    //             copyPluginItem(from, to);
    //         });
    //     } else {
    //         console.log(`  - ${chalk.yellow("File or folder")} ${chalk.green("absolutePath")} ${chalk.yellow("not found.")}`);
    //     }
    //     console.log(chalk.green("Completed."));
    // } catch (error) {
    //     console.log(chalk.red("Copying error:"));
    //     console.error(error);
    // }
})();
