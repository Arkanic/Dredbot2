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

function millisecondsToMinSeconds(duration:number):string {
    let milliseconds = Math.floor((duration % 1000) / 100);
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let hoursStr = (hours < 10) ? "0" + hours : hours;
    let minutesStr = (minutes < 10) ? "0" + minutes : minutes;
    let secondsStr = (seconds < 10) ? "0" + seconds : seconds;

    return `${hoursStr}h${minutesStr}m${secondsStr}.${milliseconds}s`;
}

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
        } else {
            message.channel.send(`**Ships last updated ${millisecondsToMinSeconds(Date.now() - cache.leaderboard.last.finishedTime)} minutes ago.**`);
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
        currentOffset:0,
        last: {
            startedTime:0,
            finishedTime:0
        }
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
    cache.leaderboard.last.finishedTime = Date.now();
    cache.leaderboard.finished = true;
    console.log(`Finished collecting ships, ended at offset ${endOffset}`);
});
shipGetter.getShips();
cache.leaderboard.last.startedTime = Date.now();
setInterval(() => {
    cache.leaderboard.ships = [];
    cache.leaderboard.finished = false;
    cache.leaderboard.currentOffset = 0;
    shipGetter.getShips();
    cache.leaderboard.last.startedTime = Date.now();
}, 1000*60*60)

client.login(config.key);