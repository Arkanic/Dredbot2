import fs from "fs";

import ResourcesObject from "../interfaces/resourcesObject";
import {Command} from "../handler/client";

let cmd:Command = {
    name: "help",
    description: "List all commands and their descriptions",
    execute(resources:ResourcesObject) {
        let {message, client, prefix} = resources;
        let li = "";

        const commandNames = fs.readdirSync(__dirname).filter(file => file.endsWith(".js"));
        for(let i in commandNames) {
            const command:Command = require(`./${commandNames[i]}`);
            if(!command.unlisted) {
                li += `Name: \`${prefix}${command.name}\`, Description: \`${command.description}\`\n`;
            }
        }
        message.channel.send(li);
    }
}
module.exports = cmd;