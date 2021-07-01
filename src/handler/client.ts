import {Client, Collection} from "discord.js";
import ResourcesObject from "../interfaces/resourcesObject";


export interface Command {
    name:string;
    description:string;
    unlisted?:boolean;
    execute(resources:ResourcesObject):void;
}

export default class extends Client {
    config:{
        key:string;
        prefix:string;
    };
    commands:Collection<string, {[unit:string]:Command}>;
    constructor() {
        super();
        this.commands = new Collection();

        if(!process.env.TOKEN) console.error("process.env.TOKEN is non-existant! please set this to the bot token.");
        if(!process.env.PREFIX) console.error("process.env.PREFIX is non-existant! please set this to the bot prefix.");
        this.config = {
            key: process.env.TOKEN as string,
            prefix: process.env.PREFIX as string
        };
    }
}