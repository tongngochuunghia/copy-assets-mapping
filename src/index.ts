import fse from "fs-extra";
import path from "path";
import chalk from "chalk";
import commandLineArgs, { CommandLineOptions } from "command-line-args";
import { author, name, version } from "../package.json";

export interface IOptions extends CommandLineOptions {
    mapping: string;
    debug: boolean;
}

export interface IMappingItem {
    from: string;
    to: string;
}

/**
 * Command options
 */
let options: IOptions;

/**
 * Logger
 */
const logger = {
    info: console.log,
    error: console.error,
    debug: (message?: any, ...params: any[]): void => {
        if (options && options.debug) {
            const length = params.length;
            switch (length) {
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

        const absoluteFromPath = path.resolve(fromPath);
        const absoluteToPath = path.resolve(to);
        logger.debug("%s - [debug]: Copying from %s to %s", new Date().toISOString(), chalk.gray(absoluteFromPath), chalk.gray(absoluteToPath));

        if (fse.statSync(from).isDirectory()) {
            // copy dir
            fse.copySync(fromPath, to);
            logger.info(`  - [Folder] ${chalk.gray(from)} ${chalk.green("successfully")} copied to ${chalk.gray(to)}`);
        } else {
            // copy file
            fse.copyFileSync(fromPath, to);
            logger.info(`  - [File]   ${chalk.gray(from)} ${chalk.green("successfully")} copied to ${chalk.gray(to)}`);
        }
    } catch (err) {
        logger.info(`  >>> Copy ${chalk.gray(from)} ${chalk.red("failed")}. ${err}`);
    }
};

/**
 * Main function.
 */
export default ((): void => {
    // Write log module info
    logger.info(chalk.yellow(`${name} (Version ${version} - ${author})`));

    // https://github.com/75lb/command-line-args
    options = commandLineArgs([
        { name: "mapping", alias: "m", type: String, defaultValue: "./mapping.json" },
        { name: "debug", alias: "d", type: Boolean, defaultValue: false }
    ]) as any;

    // Log options
    logger.debug("%s - [debug]: options=%s", new Date().toISOString(), JSON.stringify(options));

    try {
        const absolutePath = path.resolve(options.mapping);
        logger.debug("%s - [debug]: mappingPath=%s", new Date().toISOString(), absolutePath);

        if (fse.existsSync(absolutePath)) {
            const mappingData = fse.readFileSync(absolutePath, { encoding: "utf8" });
            logger.debug("%s - [debug]: rawData=%s", new Date().toISOString(), mappingData);

            const mappingArray: IMappingItem[] = JSON.parse(mappingData);
            logger.debug("%s - [debug]: mappingData=%s", new Date().toISOString(), JSON.stringify(mappingArray));

            (mappingArray || []).forEach(({ from, to }) => {
                copyPluginItem(from, to);
            });
        } else {
            logger.info(`  - ${chalk.yellow("File or folder")} ${chalk.green("absolutePath")} ${chalk.yellow("not found")}`);
        }
        logger.info(chalk.green("Completed."));
    } catch (err) {
        logger.error(chalk.red("Copying error:"), err);
    }
})();
