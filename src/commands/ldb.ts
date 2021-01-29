import Discord from "discord.js";
import Ship from "../interfaces/ship";
import ResourcesObject from "../interfaces/resourcesObject";

function commaNumber(num:number):string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let ldb = {
    name: "ldb",
    execute(resources:ResourcesObject):void {
        let {message, cache, prefix} = resources;

        message.channel.send("Fetching...").then(function(loadingMessage:Discord.Message) {
            let query:string = 

            let ships:Array<Ship> = [];
            message.channel.send(JSON.stringify(ships));
        });
    }
}
module.exports = ldb;