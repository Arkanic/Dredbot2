import ResourcesObject from "../interfaces/resourcesObject";
import {Command} from "../handler/client";

let cmd:Command= {
    name: "test",
    description: "Testing command",
    unlisted: true,
    execute(resources:ResourcesObject):void {
        let {message} = resources;
        message.channel.send("hi");
    }
}
module.exports = cmd;