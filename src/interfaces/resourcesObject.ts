import Discord from "discord.js";
import * as MongoDB from "mongodb";
import Cache from "./cache";

export default interface ResourcesObject {
    message:Discord.Message;
    client:Discord.Client;
    cache:Cache;
    prefix:string;
    mongodb:MongoDB.Db;
}