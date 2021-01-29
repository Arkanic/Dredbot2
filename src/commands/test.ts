import ResourcesObject from "../interfaces/resourcesObject";

module.exports = {
    name: "test",
    execute(resources:ResourcesObject):void {
        let {message} = resources;
        message.channel.send("hi");
    }
}