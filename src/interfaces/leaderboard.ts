import Ship from "./ship";

export default interface Leaderboard {
    ships:Array<Ship>;
    finished:boolean;
    currentOffset:number;
}