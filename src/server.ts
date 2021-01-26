import Discord from "discord.js";
import Enmap from "enmap";
import fs from "fs";

import Client from "./handler/client";

const config = require("../config.json");

const client:Client = new Client(config);
client.commands = new Discord.Collection();

const commands:any = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith(".js"));
for(const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Loaded ${command.name}`);
}

client.once("disconnect", () => {
    console.log("Disconnect");
});

client.on("message", async message => {
    if(!message.guild) return;
    let prefix = config.prefix;
    if(!message.content.startsWith(prefix)) return;

    let args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift()!.toLowerCase();
    const command = client.commands.get(commandName);

    if(message.author.bot) return;

    try {
        await command!.execute({message, client});
        console.log(`[${new Date().toUTCString()}] Command "${commandName}" executed in "${message.guild.name}"`);
    } catch(error) {
        message.channel.send(`\`\`\`${error}\`\`\``);
        console.log(error);
    }
});

client.login(config.key);