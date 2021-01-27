module.exports = {
    name: "test",
    execute(resources:{[unit:string]:any}) {
        let {message} = resources;
        message.channel.send("hi");
    }
}