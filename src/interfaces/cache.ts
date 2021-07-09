import Leaderboard from "./leaderboard";
import DredPlayers from "./dredplayers"

export default interface Cache {
    leaderboard:Leaderboard;
    players:Array<DredPlayers>;
}