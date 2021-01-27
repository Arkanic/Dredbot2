import Discord from "discord.js";

let ldb = {
    name: "ldb",
    execute(resources:{[unit:string]:any}) {
        let {message, cache, prefix} = resources;

        message.channel.send("Fetching...").then(function(msg:Discord.Message) {
            let query:string = message.content.substr(prefix.length + ldb.name.length + 1);
            let matches:Array<{[unit:string]:any}> = [];

            let lb:Array<{[unit:string]:any}> = cache.leaderboard;
            matches = lb.filter(function(s:{[unit:string]:any}) {
                return s.ship_name.toLowerCase().includes(query.toLowerCase());
            });

            let m = "";
            function gss(match:{[unit:string]:any}):string {
                return `\n**${match.position}**: \`${match.name}\` (*${match.score}pts*)`;
            }
            if(matches == []) m = "***[No Results]***";
            else {
                let j:number = 0;
                for(let i in matches) {
                    let nstr = gss(matches[i]);
                    if(m.length + nstr.length < 2000) {
                        m += nstr;
                    } else if(j <= 2) {
                        message.channel.send(m || "**[No Results]**");
                        m = gss(matches[i]);
                        j++;
                    } else {
                        j++;
                    }
                }
                if(j == 0) {
                    message.channel.send(m || "**[No Results]**");
                }
            }
            let tp = 0;
            for(let i in matches) {
                tp += parseInt(matches[i].score);
            }
            msg.delete();
            message.channel.send(`Total points for the term "\`${query || "~"}\`": **${tp}pts** (${matches.length} ships, out of ${cache.leaderboard.length} ships.)`);
        });
    }
}
module.exports = ldb;