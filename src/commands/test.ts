module.exports = {
    name: "test",
    execute(cache:{[unit:string]:any}) {
        let {message} = cache;
        message.channel.send("hi");
    }
}