import Express from "express";
const app:Express.Application = Express();
app.get("/", function(req, res) {
    res.send("online");
});
app.listen(process.env.PORT||8080);

import Discord from "discord.js";
import fs from "fs";
import dotenv from "dotenv";

import Client, {Command} from "./handler/client";

import * as MongoDB from "./mongodb";
MongoDB.start();

import {cache} from "./cache";
import ResourcesObject from "./interfaces/resourcesObject";

import {millisecondsToMinSeconds} from "./utils/formatting";

dotenv.config({
    path: ".env"
});

const client:Client = new Client();
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
    if(message.author.bot) return;


    let prefix = client.config.prefix;
    if(!message.content.startsWith(prefix)) return;

    let args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift()!.toLowerCase();
    const command:{[unit:string]:Command}|undefined = client.commands.get(commandName);

    if(!command) {
        return message.react("🤔");
    }

    try {
        let resources:ResourcesObject = {message, client, cache, prefix, mongodb:MongoDB.db};
        if(!cache.leaderboard.finished) {
            message.channel.send(`**Dredbot is still collecting ships, and any ship with less than ${cache.leaderboard.currentOffset} points will not be shown by any ship-related command.**`);
        } else {
            message.channel.send(`**Ships last updated ${millisecondsToMinSeconds(Date.now() - cache.leaderboard.last.finishedTime)} ago.**`);
        }
        await (command as unknown as Command).execute(resources);
        console.log(`[${new Date().toUTCString()}] Command "${commandName}" executed in "${message.guild.name}"`);
    } catch(error) {
        message.channel.send(`\`\`\`${error}\`\`\``);
        console.log(error);
    }
});

client.login(client.config.key);