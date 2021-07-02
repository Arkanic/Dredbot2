import Cache from "./interfaces/cache";
import ShipGetter from "./cache/leaderboard";

export let cache:Cache = {
    leaderboard: {
        ships: [],
        finished: false,
        currentOffset:0,
        last: {
            startedTime:0,
            finishedTime:0
        }
    }
};

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
    console.log(`Finished collecting ships, ended at offset ${endOffset}`);
});
shipGetter.getShips();
cache.leaderboard.last.startedTime = Date.now();
setInterval(() => {
    cache.leaderboard.ships = [];
    cache.leaderboard.finished = false;
    cache.leaderboard.currentOffset = 0;
    shipGetter.reset();
    shipGetter.getShips();
    cache.leaderboard.last.startedTime = Date.now();
}, 1000*60*60*2);