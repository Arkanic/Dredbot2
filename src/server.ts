import Discord from "discord.js";
import Enmap from "enmap";
import fs from "fs";

import Client from "./handler/client";
import ShipGetter from "./cache/leaderboard";
import leaderboard from "./cache/leaderboard";

import Cache from "./interfaces/cache";
import ResourcesObject from "./interfaces/resourcesObject";

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
    if(message.author.bot) return;


    let prefix = config.prefix;
    if(!message.content.startsWith(prefix)) return;

    let args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift()!.toLowerCase();
    const command = client.commands.get(commandName);

    if(!command) {
        return message.react("🤔");
    }

    try {
        let resources:ResourcesObject = {message, client, cache, prefix};
        if(!cache.leaderboard.finished) {
            message.channel.send(`**Note: Dredbot is still collecting ships, and any ship with less than ${cache.leaderboard.currentOffset} points in any ship-realted command will not be shown.**`);
        }
        await command!.execute(resources);
        console.log(`[${new Date().toUTCString()}] Command "${commandName}" executed in "${message.guild.name}"`);
    } catch(error) {
        message.channel.send(`\`\`\`${error}\`\`\``);
        console.log(error);
    }
});

let cache:Cache = {
    leaderboard: {
        ships: [],
        finished: false,
        currentOffset:0
    }
};

let shipGetter = new ShipGetter((ships) => {
    // on chunk
    for(let i in ships) {
        cache.leaderboard.ships.push(ships[i]);
    }
    cache.leaderboard.currentOffset = ships[ships.length-1].score;
}, (endOffset) => {
    // on finish
    console.log(`Finished collecting ships, ended at offset ${endOffset}`);
});
shipGetter.getShips();
setInterval(() => {
    cache.leaderboard.ships = [];
    cache.leaderboard.finished = false;
    cache.leaderboard.currentOffset = 0;
    shipGetter.getShips();
}, 1000*60*60)

client.login(config.key);