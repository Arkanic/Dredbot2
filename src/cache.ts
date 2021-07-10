import Cache from "./interfaces/cache";
import DredPlayers, * as dp from "./cache/dredplayers";
import ShipGetter from "./cache/leaderboard";
import * as MongoDB from "./mongodb";

export let cache:Cache = {
    leaderboard: {
        ships: [],
        finished: false,
        currentOffset:0,
        last: {
            startedTime:0,
            finishedTime:0
        }
    },
    players: [
        new DredPlayers("wss://d0.drednot.io:4000", "US"),
        new DredPlayers("wss://d1.drednot.io:4000", "Poland"),
        new DredPlayers("wss://s2.drednot.io:4000", "Singapore"),
        new DredPlayers("wss://t0.drednot.io:4000", "Test")
    ]
};

//
// leaderboard
//
let shipGetter = new ShipGetter((ships) => {
    // on chunk
    for(let i in ships) {
        cache.leaderboard.ships.push(ships[i]);
    }
    cache.leaderboard.currentOffset = ships[ships.length-1].score;
}, (endOffset) => {
    // on finish
    cache.leaderboard.last.finishedTime = Date.now();
    cache.leaderboard.finished = true;
    MongoDB.insertLeaderboard(cache.leaderboard.last.finishedTime, cache.leaderboard.ships);
    console.log(`Finished collecting ships, ended at offset ${endOffset}`);
});
shipGetter.getShips();
cache.leaderboard.last.startedTime = Date.now();
setInterval(() => {
    cache.leaderboard.ships = [];
    cache.leaderboard.finished = false;
    cache.leaderboard.currentOffset = 0;
    shipGetter = new ShipGetter((ships) => {
        // on chunk
        for(let i in ships) {
            cache.leaderboard.ships.push(ships[i]);
        }
        cache.leaderboard.currentOffset = ships[ships.length-1].score;
    }, (endOffset) => {
        // on finish
        cache.leaderboard.last.finishedTime = Date.now();
        cache.leaderboard.finished = true;
        MongoDB.insertLeaderboard(cache.leaderboard.last.finishedTime, cache.leaderboard.ships);
        console.log(`Finished collecting ships, ended at offset ${endOffset}`);
    });
    shipGetter.getShips();
    cache.leaderboard.last.startedTime = Date.now();
}, 1000*60*60);

//
// Players
//
for(let i in cache.players) {
    cache.players[i].ping();
}
setInterval(() => {
    for(let i in cache.players) {
        cache.players[i].ping();
    }
}, 1000 * 30);