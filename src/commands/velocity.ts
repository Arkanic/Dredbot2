import ResourcesObject from "../interfaces/resourcesObject";
import { Command } from "../handler/client";
import Ship from "../interfaces/ship";

/**
 * Turns a number into a string with comma notation (e.g. 1234 becomes "1,234")
 */
function commaNumber(num: number): string {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

/**
 * Transforms a Ship object into a string that is sent to discord
 */
function shipString(position: number, ship: Ship): string {
    return `\n**${commaNumber(position + 1)}** \`${ship.name} {${ship.hex}}\` (${commaNumber(ship.score)}pts)`;
}

let cmd: Command = {
    name: "velocity",
    description: "Show which ships are changing in points the most",
    execute(resources: ResourcesObject): void {
        let { message, mongodb } = resources;
        let leaderboards = mongodb.collection("dredbot");

        let loading = message.channel.send("Loading...");
        loading.then((loadingMessage) => {

            let capable = true;

            leaderboards.find({}).toArray((err, results) => {
                if (err) throw err;
                if (!results) capable = false;
                if (results.length < 2) capable = false;

                if (capable) {
                    let older = results[0].ships;
                    let newer = results[results.length - 1].ships;

                    let ships = [];

                    // uh oh slow
                    for (let i in older) {
                        let oldShip = older[i] as Ship;
                        let newShip = newer[i] as Ship;

                        oldShip.score = newShip.score - oldShip.score;
                        ships.push(oldShip);
                    }

                    let vArg = message.content.split(" ")[1] || "";
                    vArg = (vArg.length > 0 && vArg.toLowerCase().startsWith("l")) ? "lower" : "higher";

                    // this may seem like repetition,
                    // but it actually makes the if statement have to run once
                    // rather than 100k times.
                    // TODO: implement something like timsort
                    let sortingMethod:null|((a:Ship, b:Ship) => number);
                    if(vArg == "higher") sortingMethod = (a, b) => {
                        return b.score - a.score;
                    }
                    else sortingMethod = (a, b) => {
                        return a.score - b.score;
                    }

                    ships.sort(sortingMethod);


                    loadingMessage.delete();

                    let m = "";
                    let i = 0;
                    while (m.length <= 2000) {
                        m += shipString(i, ships[i]);
                        i++;
                    }
                    message.channel.send(m);
                } else {
                    message.channel.send("Dredbot hasn't collected enough ship cycles for this command!\nTry again tomorrow.");
                }
            });
        });
    }
}
module.exports = cmd;