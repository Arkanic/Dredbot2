import Leaderboard from "./leaderboard";
import DredPlayers from "../cache/dredplayers"

export default interface Cache {
    leaderboard:Leaderboard;
    players:Array<DredPlayers>;
}