import Ship from "./ship";

export default interface Leaderboard {
    ships:Array<Ship>;
    finished:boolean;
    currentOffset:number;
    last: {
        finishedTime:number,
        startedTime:number,
    }
}