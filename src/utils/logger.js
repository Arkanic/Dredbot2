// js because this is too big brain for types
const chalk = require("chalk");

export default class Logger {
    /**
     * Make logger instance
     * 
     * @param {string} name name of the module
     * @param {string} color color of the module
     */
    constructor(name, color) {
        this.name = name;
        if(chalk[color]) {
            this.color = color;
        } else {
            this.color = "white";
        }
    }

    /**
     * @param {string} message 
     */
    log(message) {
        console.log(`[${chalk[this.color].bold(this.name)}]: ${message}`);
    }

    /**
     * @param {string} message 
     */
    warn(message) {
        console.log(`[${chalk[this.color].bold(this.name)}]: ${chalk.yellow(message)}`);
    }

    /**
     * @param {string} message 
     */
    error(message) {
        console.log(`[${chalk[this.color].bold(this.name)}]: ${chalk.red(message)}`);
    }

    /**
     * @param {string} message 
     */
    success(message) {
        console.log(`[${chalk[this.color].bold(this.name)}]: ${chalk.green(message)}`);
    }

    /**
     * @param {string} message
     */
    critical(message) {
        console.log(`[${chalk[this.color].bold(this.name)}]: ${chalk.black.bgRed(message)}`);
    }

    /**
     * @param {string} message 
     */
    info(message) {
        console.log(`[${chalk[this.color].bold(this.name)}]: ${chalk.blue(message)}`);
    }
}