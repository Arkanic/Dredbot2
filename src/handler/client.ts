import {Client, Collection} from "discord.js";

export default class extends Client {
    config:{[unit:string]:any};
    commands:Collection<string, {[unit:string]:any}>;
    constructor(config:{[unit:string]:any}) {
        super();
        this.commands = new Collection();
        this.config = config;
    }
}